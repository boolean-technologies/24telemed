import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Result, Spin } from 'antd';
import { apiFetch } from '../api/client';
import { Consultation, useVerifyPayment } from '../api/partners';

const ATTEMPTS = 5;
const DELAY_MS = 3000;

/** Paystack redirects here (?reference=...) after checkout. Confirms the
 * payment with the backend — the webhook may also settle it independently. */
export function PaymentCallbackPage() {
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref');
  const navigate = useNavigate();
  const verify = useVerifyPayment();
  const [state, setState] = useState<'checking' | 'unpaid' | 'missing'>('checking');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      const page = await apiFetch<{ results: Consultation[] }>('/partners/consultations/').catch(() => null);
      const consultation = page?.results.find((c) => c.reference === reference);
      if (!consultation) {
        setState('missing');
        return;
      }
      for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
        const result = await verify.mutateAsync(consultation.id).catch(() => null);
        if (result && result.status !== 'pending_payment') {
          navigate(`/app/consultations/${consultation.id}`, { replace: true });
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
      setState('unpaid');
    })();
  }, [reference]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state === 'checking') {
    return <Result icon={<Spin size="large" />} title="Confirming your payment…" subTitle="This takes a few seconds." />;
  }

  return (
    <Result
      status="warning"
      title={state === 'missing' ? "We couldn't find this payment" : "We haven't received your payment yet"}
      subTitle="If you were charged, it will show as paid on your consultations page within a few minutes."
      extra={
        <Link to="/app">
          <Button type="primary">Go to my consultations</Button>
        </Link>
      }
    />
  );
}

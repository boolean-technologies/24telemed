const PARTNER_SLUG_KEY = 'PARTNER_PORTAL_SLUG';

export function formatMoney(amount: string | number, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function doctorName(doctor: { first_name: string; last_name: string }) {
  return `Dr. ${[doctor.first_name, doctor.last_name].filter(Boolean).join(' ')}`.trim();
}

/** Remembers which clinic the patient came from, for redirects after logout. */
export const lastPartnerSlug = {
  get: () => {
    try {
      return localStorage.getItem(PARTNER_SLUG_KEY) || import.meta.env.VITE_DEFAULT_PARTNER_SLUG || '';
    } catch {
      return import.meta.env.VITE_DEFAULT_PARTNER_SLUG || '';
    }
  },
  set: (slug: string) => {
    try {
      localStorage.setItem(PARTNER_SLUG_KEY, slug);
    } catch {
      // Private mode etc. — only affects post-logout redirects.
    }
  },
};

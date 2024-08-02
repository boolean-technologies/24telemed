import { useCurrentUser } from "@local/api-generated";
import { RegistrationPageLayout } from "./RegistrationPageLayout";

export function AccountPatientProfileSetupPage(){
    const { data } = useCurrentUser();
    if (!data) return null;
    return <RegistrationPageLayout title="Account Setup" userId={data.id} />
}
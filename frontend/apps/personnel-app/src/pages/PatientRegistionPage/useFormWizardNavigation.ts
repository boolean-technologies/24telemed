import { useState, useCallback } from 'react';

export function useFormWizardNavigation(totalSteps: number) {
  const [step, setStep] = useState(0); // Initial step is now 0

  const goNext = useCallback(() => {
    setStep((currentStep) => {
      // Move to the next step if not already at the last step
      const nextStep = currentStep + 1;
      return nextStep < totalSteps ? nextStep : currentStep;
    });
  }, []);

  const goBack = useCallback(() => {
    setStep((currentStep) => {
      // Move to the previous step if not already at the first step
      const prevStep = currentStep - 1;
      return prevStep >= 0 ? prevStep : currentStep;
    });
  }, []);

  // Directly jump to any step, ensuring it's within the valid range
  const goToStep = useCallback((targetStep: number) => {
    if (targetStep >= 0 && targetStep < totalSteps) {
      setStep(targetStep);
    }
  }, []);

  return { step, goNext, goBack, goToStep };
}

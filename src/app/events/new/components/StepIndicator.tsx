interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="text-center text-lg font-semibold text-gray-700">
      Etapa {currentStep} de {totalSteps}
    </div>
  );
}
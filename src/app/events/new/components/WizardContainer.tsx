'use client';

import { useState, useEffect } from 'react';
import StepIndicator from './StepIndicator';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Courses from './Step2Courses';
import Step3Lots from './Step3Lots';

export interface EventData {
  name: string;
  url: string;
  date: string;
  time: string;
  location: string;
  banner: string;
  description: string;
}

export default function WizardContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState<EventData>({
    name: '',
    url: '',
    date: '',
    time: '',
    location: '',
    banner: '',
    description: '',
  });

  const totalSteps = 3;

  // Escuta evento customizado 'wizard-next' disparado pelo Step1BasicInfo
  useEffect(() => {
    const handleWizardNext = () => {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      }
    };
    window.addEventListener('wizard-next', handleWizardNext);
    return () => window.removeEventListener('wizard-next', handleWizardNext);
  }, [currentStep, totalSteps]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      console.log('eventData ao voltar:', eventData);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo eventData={eventData} setEventData={setEventData} />;
      case 2:
        return <Step2Courses />;
      case 3:
        return <Step3Lots />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-8">{renderStep()}</div>
      <div className="mt-8 flex justify-between">
        {currentStep > 1 && (
          <button
            onClick={handlePrev}
            className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            ← Voltar
          </button>
        )}
        {currentStep === 1 && (
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            ← Dashboard
          </button>
        )}
        
        {currentStep < totalSteps && currentStep > 1 && (
          <button
            onClick={handleNext}
            className="ml-auto px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Próximo →
          </button>
        )}
      </div>
    </div>
  );
}
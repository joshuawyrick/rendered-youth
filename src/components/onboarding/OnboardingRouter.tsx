
import React, { useState } from 'react';
import AgeGate from './AgeGate';
import ParentEmailCollection from './ParentEmailCollection';
import TeenSignupForm from './TeenSignupForm';
import AdultSignupForm from './AdultSignupForm';

type OnboardingStep = 'age-gate' | 'parent-email' | 'pending-parent' | 'teen-signup' | 'adult-signup';

interface OnboardingData {
  age?: number;
  isMinor?: boolean;
  requiresParentConsent?: boolean;
  sessionToken?: string;
}

const OnboardingRouter = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('age-gate');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const handleAgeVerified = (data: OnboardingData) => {
    setOnboardingData(data);
    
    if (data.requiresParentConsent) {
      setCurrentStep('parent-email');
    } else if (data.isMinor) {
      setCurrentStep('teen-signup');
    } else {
      setCurrentStep('adult-signup');
    }
  };

  const handleEmailSubmitted = () => {
    setCurrentStep('pending-parent');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'age-gate':
        return <AgeGate onAgeVerified={handleAgeVerified} />;
      
      case 'parent-email':
        return (
          <ParentEmailCollection
            sessionToken={onboardingData.sessionToken!}
            onEmailSubmitted={handleEmailSubmitted}
          />
        );
      
      case 'pending-parent':
        return (
          <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">📧</div>
              <h1 className="text-3xl font-bold text-ry-black mb-4">
                Email Sent!
              </h1>
              <p className="text-gray-600 mb-6">
                We've sent instructions to your parent's email. 
                They'll need to complete the verification process before you can continue.
              </p>
              <p className="text-sm text-gray-500">
                You can close this page and return when your parent has finished the setup.
              </p>
            </div>
          </div>
        );
      
      case 'teen-signup':
        return <TeenSignupForm age={onboardingData.age!} />;
      
      case 'adult-signup':
        return <AdultSignupForm age={onboardingData.age!} />;
      
      default:
        return <AgeGate onAgeVerified={handleAgeVerified} />;
    }
  };

  return renderCurrentStep();
};

export default OnboardingRouter;

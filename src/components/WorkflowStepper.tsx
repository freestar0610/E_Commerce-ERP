import React from 'react';
import { WORKFLOW_STEPS } from '../constants';
import { ArrowRight, CheckCircle2, Loader2, Circle } from 'lucide-react';

interface WorkflowStepperProps {
  currentStep: number;
}

export default function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">오늘의 워크플로우</h2>
        <div className="px-3 py-1 bg-blue-500/10 text-blue-400 font-bold rounded-full text-[11px] uppercase tracking-wider">
          진행률 75%
        </div>
      </div>
      
      <div className="flex items-start gap-4">
        {WORKFLOW_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex-1 flex flex-col items-center group cursor-pointer">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300
                ${currentStep > step.id ? 'bg-green-500/20 text-green-400' : 
                  currentStep === step.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 
                  'bg-[#2C2C2E] text-gray-500 border border-gray-700'}
                group-hover:scale-110
              `}>
                {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : 
                 currentStep === step.id ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                 <Circle className="w-6 h-6" />}
              </div>
              <p className={`text-sm font-bold mb-1 transition-colors ${currentStep === step.id ? 'text-white' : 'text-gray-400'}`}>{step.label}</p>
              <p className="text-[10px] text-gray-500 text-center px-1 font-medium">{step.description}</p>
            </div>
            {index < WORKFLOW_STEPS.length - 1 && (
              <div className="pt-6">
                <ArrowRight className="w-4 h-4 text-gray-700" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

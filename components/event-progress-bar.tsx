"use client"

import React from "react"
import { Check, Loader2, ImageIcon, Share2, UserCheck, CloudUpload, Wrench } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ProgressStep {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  status: 'completed' | 'current' | 'pending'
}

interface EventProgressBarProps {
  eventId: string
  currentStep: number // 1-5
  customerName?: string
}

const steps: ProgressStep[] = [
  {
    id: '1',
    label: 'Thumbnail images created',
    icon: ImageIcon,
    status: 'pending'
  },
  {
    id: '2',
    label: 'Photo selection link shared with customer',
    icon: Share2,
    status: 'pending'
  },
  {
    id: '3',
    label: 'Customer submitted the photo selection',
    icon: UserCheck,
    status: 'pending'
  },
  {
    id: '4',
    label: 'Selected photos uploaded to cloud',
    icon: CloudUpload,
    status: 'pending'
  },
  {
    id: '5',
    label: 'Work in progress',
    icon: Wrench,
    status: 'pending'
  }
]

export function EventProgressBar({ eventId, currentStep, customerName }: EventProgressBarProps) {
  const getStepStatus = (stepNumber: number): 'completed' | 'current' | 'pending' => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'pending'
  }

  const updatedSteps = steps.map((step, index) => ({
    ...step,
    status: getStepStatus(index + 1)
  }))

  const completedSteps = updatedSteps.filter(s => s.status === 'completed').length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <div className="mb-4 pb-4 border-b">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-muted-foreground">Workflow Progress</h3>
        <div className="flex items-center gap-2">
          {customerName && currentStep >= 3 && (
            <span className="text-xs text-muted-foreground">
              {customerName}
            </span>
          )}
          <span className="text-xs font-medium">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* Compact Horizontal Progress Bar with Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="relative flex items-center justify-between">
          {updatedSteps.map((step) => {
            const Icon = step.icon
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
                    step.status === 'completed' && "bg-primary border-primary text-primary-foreground",
                    step.status === 'current' && "bg-primary border-primary text-primary-foreground ring-2 ring-primary/30",
                    step.status === 'pending' && "bg-background border-muted text-muted-foreground"
                  )}
                >
                  {step.status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : step.status === 'current' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs mt-2 text-center max-w-[100px] line-clamp-2",
                    step.status === 'completed' && "text-muted-foreground",
                    step.status === 'current' && "text-primary font-medium",
                    step.status === 'pending' && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}



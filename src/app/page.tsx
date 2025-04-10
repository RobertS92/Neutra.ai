'use client';

import {OnboardingForm} from '@/components/onboarding-form';
import {MealPlanDisplay} from '@/components/meal-plan-display';
import {useState} from 'react';
import {MealPlan} from '@/types';

export default function Home() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">NutriAIMeal</h1>
      <OnboardingForm setMealPlan={setMealPlan} />
      {mealPlan && <MealPlanDisplay mealPlan={mealPlan} />}
    </div>
  );
}

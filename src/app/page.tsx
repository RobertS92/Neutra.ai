'use client';

import {OnboardingForm} from '@/components/onboarding-form';
import {MealPlanDisplay} from '@/components/meal-plan-display';
import {useState} from 'react';
import {MealPlan} from '@/types';
import {RecipeDetailView} from '@/components/recipe-detail-view';

export default function Home() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [showRecipe, setShowRecipe] = useState(false); // State to control RecipeDetailView visibility

  const handleMealPlanClick = () => {
    setShowRecipe(true); // Set state to true when MealPlanDisplay is clicked
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">NutriAIMeal</h1>
      <OnboardingForm setMealPlan={setMealPlan} />
      {mealPlan && (
        <div onClick={handleMealPlanClick} className="cursor-pointer">
          <MealPlanDisplay mealPlan={mealPlan} />
        </div>
      )}
      {showRecipe && <RecipeDetailView />}
    </div>
  );
}


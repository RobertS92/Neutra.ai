'use client';

import {useState, useEffect} from 'react';
import {MealPlan} from '@/types';
import {RecipeDetailView} from '@/components/recipe-detail-view';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Slider} from '@/components/ui/slider';
import {OnboardingForm} from '@/components/onboarding-form';
import {generateMealPlan, GenerateMealPlanOutput} from '@/ai/flows/generate-meal-plan';

interface MealData {
  id: number;
  type: string;
  title: string;
  calories: number;
  tags: string[];
  image: string;
}

export default function Home() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [showRecipe, setShowRecipe] = useState<number | boolean>(false);
  const [scaleFactor, setScaleFactor] = useState<number>(100); // Scale factor in percentage
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [mealData, setMealData] = useState<MealData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dummy onboarding data for testing purposes
  const dummyOnboardingData = {
    dietaryRestrictions: 'vegetarian, dairy-free',
    fitnessGoals: 'lose 15 lbs in 2 months',
    tastePreferences: 'spicy, Asian cuisine',
    cookingSkills: 'beginner',
    timeAvailability: '30 minutes',
    mealFrequency: '3',
  };

  useEffect(() => {
    if (onboardingComplete) {
      fetchMealPlan();
    }
  }, [onboardingComplete]);

  const fetchMealPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the generateMealPlan Genkit flow with dummy onboarding data
      const mealPlanOutput: GenerateMealPlanOutput = await generateMealPlan(dummyOnboardingData);
      const parsedMealPlan = JSON.parse(mealPlanOutput.mealPlan);

      if (Array.isArray(parsedMealPlan)) {
        setMealData(parsedMealPlan);
      } else {
        console.error('Invalid meal plan format:', parsedMealPlan);
        setError('Failed to load meal plan. Invalid data format.');
        setMealData(null);
      }

      setLoading(false);
    } catch (e: any) {
      console.error('Failed to generate meal plan:', e);
      setError('Failed to generate meal plan. Please try again.');
      setLoading(false);
      setMealData(null);
    }
  };

  const handleRegeneratePlan = () => {
    fetchMealPlan();
  };

  const handleScaleChange = (value: number[]) => {
    setScaleFactor(value[0]);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Your Personalized Meal Plan</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Built for your goal: lose 15 lbs in 2 months, vegetarian, dairy-free, and under 20-minute prep.
      </p>

      {!onboardingComplete ? (
        <OnboardingForm setMealPlan={() => setOnboardingComplete(true)} />
      ) : (
        <>
          <div className="flex justify-between w-full max-w-2xl mb-4">
            <Button variant="outline">Edit Profile</Button>
            <Button onClick={handleRegeneratePlan} disabled={loading}>
              {loading ? 'Generating...' : 'Regenerate My Plan'}
            </Button>
          </div>

          {/* Scale Plan Slider */}
          <div className="flex items-center space-x-4 mb-4 w-full max-w-2xl">
            <span className="w-24 text-right">Scale Plan:</span>
            <Slider
              defaultValue={[scaleFactor]}
              max={200}
              min={50}
              step={1}
              onValueChange={handleScaleChange}
              className="flex-1"
            />
            <span className="w-12">{scaleFactor}%</span>
          </div>

          {/* Meal Plan Content */}
          <div className="w-full max-w-2xl">
            {loading && <p>Loading meal plan...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {mealData &&
              mealData.map(meal => (
                <Card
                  key={meal.id}
                  className="mb-4 cursor-pointer"
                  onClick={() => setShowRecipe(meal.id)}
                >
                  <CardHeader>
                    <CardTitle>{meal.title}</CardTitle>
                    <CardDescription>{meal.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src={meal.image} alt={meal.title} className="mb-2 rounded-md" />
                    <p>{meal.calories} kcal</p>
                    <div className="flex space-x-2">
                      {meal.tags.map((tag, index) => (
                        <Button key={index} variant="secondary" size="sm">
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {showRecipe && <RecipeDetailView mealId={showRecipe} scaleFactor={scaleFactor / 100} />}
        </>
      )}
    </div>
  );
}

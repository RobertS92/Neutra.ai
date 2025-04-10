'use client';

import {useState} from 'react';
import {MealPlan} from '@/types';
import {RecipeDetailView} from '@/components/recipe-detail-view';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Slider} from '@/components/ui/slider';

export default function Home() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>({content: 'Generated Meal Plan Content'});
  const [showRecipe, setShowRecipe] = useState(false);
  const [scaleFactor, setScaleFactor] = useState<number>(100); // Scale factor in percentage

  const handleRegeneratePlan = () => {
    alert('Regenerate plan clicked');
  };

  const handleMealPlanClick = () => {
    setShowRecipe(true);
  };

  const handleScaleChange = (value: number[]) => {
    setScaleFactor(value[0]);
  };

  const mealData = [
    {
      id: 1,
      type: 'Breakfast',
      title: 'Vegan Chickpea Quinoa Bowl',
      calories: 520,
      tags: ['High-Protein', 'Gluten-Free', '30 Min'],
      image: 'https://picsum.photos/200/150',
    },
    {
      id: 2,
      type: 'Lunch',
      title: 'Lentil Soup with Whole Grain Bread',
      calories: 480,
      tags: ['High-Fiber', 'Vegetarian', '25 Min'],
      image: 'https://picsum.photos/200/151',
    },
    {
      id: 3,
      type: 'Dinner',
      title: 'Tofu Stir-Fry with Brown Rice',
      calories: 550,
      tags: ['Vegan', 'Quick Prep', '20 Min'],
      image: 'https://picsum.photos/200/152',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Your Personalized Meal Plan</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Built for your goal: lose 15 lbs in 2 months, vegetarian, dairy-free, and under 20-minute prep.
      </p>

      <div className="flex justify-between w-full max-w-2xl mb-4">
        <Button variant="outline">Edit Profile</Button>
        <Button onClick={handleRegeneratePlan}>Regenerate My Plan</Button>
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
        {mealData.map(meal => (
          <Card key={meal.id} className="mb-4 cursor-pointer" onClick={() => setShowRecipe(meal.id)}>
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
    </div>
  );
}

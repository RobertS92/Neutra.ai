'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {MealPlan} from '@/types';
import {Slider} from '@/components/ui/slider';
import {useState, useCallback} from 'react';
import {Ingredients, scaleIngredients} from '@/services/recipe-scaling';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
}

export const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({mealPlan}) => {
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [scaledIngredients, setScaledIngredients] = useState<Ingredients | null>(null);
  const {toast} = useToast();

  const handleScaleChange = useCallback((value: number[]) => {
    setScaleFactor(value[0] / 100);
  }, []);

  const handleScaleIngredients = async () => {
    try {
      // Mock ingredients for testing purposes
      const mockIngredients: Ingredients = {
        'Chicken Breast': '200g',
        'Broccoli': '1 head',
        'Rice': '1 cup',
      };

      const scaled = await scaleIngredients(mockIngredients, scaleFactor);
      setScaledIngredients(scaled);
      toast({
        title: 'Ingredients scaled successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to scale ingredients.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Your Meal Plan</CardTitle>
        <CardDescription>Here is your personalized meal plan. Adjust the scale factor below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Meal Plan Content:</h3>
          <p>{mealPlan.content}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Scale Meal Plan:</h3>
          <div className="flex items-center space-x-4">
            <span className="w-12 text-right">Scale:</span>
            <Slider
              defaultValue={[100]}
              max={200}
              min={50}
              step={1}
              onValueChange={handleScaleChange}
              className="flex-1"
            />
            <span className="w-12">{scaleFactor * 100}%</span>
          </div>
          <Button onClick={handleScaleIngredients}>Scale Ingredients</Button>
        </div>

        {scaledIngredients && (
          <div>
            <h3 className="text-lg font-semibold">Scaled Ingredients:</h3>
            <ul>
              {Object.entries(scaledIngredients).map(([ingredient, amount]) => (
                <li key={ingredient}>
                  {ingredient}: {amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

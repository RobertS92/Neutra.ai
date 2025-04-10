'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

interface RecipeDetailViewProps {
  mealId: number | boolean;
  scaleFactor: number;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({mealId, scaleFactor}) => {
  const recipeData = {
    1: {
      name: 'Vegan Chickpea Quinoa Bowl',
      mealType: 'Lunch',
      image: 'https://picsum.photos/400/300',
      prepTime: '25 mins',
      calories: 520,
      protein: 23,
      carbs: 42,
      fat: 18,
      fiber: 11,
      tags: ['High-Fiber', 'Low-GI', 'Vegetarian'],
      ingredients: [
        {name: 'Chickpeas', amount: 1.5, unit: 'cups'},
        {name: 'Quinoa', amount: 1, unit: 'cup'},
        {name: 'Spinach', amount: 1, unit: 'handful'},
        {name: 'Lemon', amount: 0.5, unit: 'piece'},
      ],
      instructions: [
        'Rinse quinoa and cook in boiling water for 15 minutes.',
        'In a pan, sauté onions and garlic.',
        'Add chickpeas, spinach, and cooked quinoa.',
        'Season with cumin, paprika, and lemon. Serve warm.',
      ],
      nutrition: {
        calories: '520 kcal',
        protein: '23g',
        carbs: '42g',
        fat: '18g',
        fiber: '11g',
        iron: '19% DV',
        vitaminC: '28% DV',
      },
    },
    2: {
      name: 'Lentil Soup with Whole Grain Bread',
      mealType: 'Lunch',
      image: 'https://picsum.photos/400/301',
      prepTime: '30 mins',
      calories: 480,
      protein: 20,
      carbs: 50,
      fat: 15,
      fiber: 15,
      tags: ['High-Fiber', 'Vegetarian', 'Vegan'],
      ingredients: [
        {name: 'Lentils', amount: 1, unit: 'cup'},
        {name: 'Carrots', amount: 1, unit: 'cup'},
        {name: 'Celery', amount: 0.5, unit: 'cup'},
        {name: 'Whole Grain Bread', amount: 2, unit: 'slices'},
      ],
      instructions: [
        'Sauté carrots and celery in a pot.',
        'Add lentils and vegetable broth, then simmer for 20 minutes.',
        'Serve with a slice of whole grain bread.',
      ],
      nutrition: {
        calories: '480 kcal',
        protein: '20g',
        carbs: '50g',
        fat: '15g',
        fiber: '15g',
      },
    },
    3: {
      name: 'Tofu Stir-Fry with Brown Rice',
      mealType: 'Dinner',
      image: 'https://picsum.photos/400/302',
      prepTime: '20 mins',
      calories: 550,
      protein: 25,
      carbs: 60,
      fat: 20,
      fiber: 10,
      tags: ['Vegan', 'Quick Prep', 'Gluten-Free'],
      ingredients: [
        {name: 'Tofu', amount: 1, unit: 'block'},
        {name: 'Broccoli', amount: 1, unit: 'cup'},
        {name: 'Bell Peppers', amount: 0.5, unit: 'cup'},
        {name: 'Brown Rice', amount: 1, unit: 'cup'},
      ],
      instructions: [
        'Press tofu to remove excess water, then cube it.',
        'Stir-fry tofu, broccoli, and bell peppers in a pan.',
        'Serve over brown rice.',
      ],
      nutrition: {
        calories: '550 kcal',
        protein: '25g',
        carbs: '60g',
        fat: '20g',
        fiber: '10g',
      },
    },
  };

  // Ensure mealId is a number and is a valid key in recipeData
  const recipeId = typeof mealId === 'number' && recipeData[mealId] ? mealId : 1;
  const recipe = recipeData[recipeId];

  if (!recipe) {
    return <Card>
      <CardContent>
        Recipe Not Found
      </CardContent>
    </Card>;
  }

  const scaledIngredients = recipe.ingredients.map(ingredient => ({
    ...ingredient,
    amount: ingredient.amount * scaleFactor,
  }));

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>{recipe.mealType} - Prep Time: {recipe.prepTime}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <img src={recipe.image} alt={recipe.name} className="mb-4 rounded-md" />
        <div className="flex space-x-4">
          <span>Calories: {recipe.calories} kcal</span>
          <span>Protein: {recipe.protein}g</span>
          <span>Carbs: {recipe.carbs}g</span>
          <span>Fat: {recipe.fat}g</span>
          <span>Fiber: {recipe.fiber}g</span>
        </div>
        <div className="flex space-x-2">
          {recipe.tags.map((tag, index) => (
            <Button key={index} variant="secondary" size="sm">
              {tag}
            </Button>
          ))}
        </div>

        <h3 className="text-lg font-semibold">Ingredients</h3>
        <ul>
          {scaledIngredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name}: {ingredient.amount} {ingredient.unit}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold">Instructions</h3>
        <ol className="list-decimal pl-6">
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>

        <h3 className="text-lg font-semibold">Nutritional Information</h3>
        <p>Calories: {recipe.nutrition.calories}</p>
        <p>Protein: {recipe.nutrition.protein}</p>
        <p>Carbs: {recipe.nutrition.carbs}</p>
        <p>Fat: {recipe.nutrition.fat}</p>
        <p>Fiber: {recipe.nutrition.fiber}</p>
      </CardContent>
    </Card>
  );
};

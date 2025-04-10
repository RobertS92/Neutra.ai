'use server';
/**
 * @fileOverview Generates personalized meal plans based on user preferences using AI.
 *
 * - generateMealPlan - A function that generates a meal plan.
 * - GenerateMealPlanInput - The input type for the generateMealPlan function.
 * - GenerateMealPlanOutput - The return type for the generateMealPlan function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateMealPlanInputSchema = z.object({
  dietaryRestrictions: z
    .string()
    .describe('Dietary restrictions of the user (e.g., vegetarian, vegan, gluten-free).'),
  fitnessGoals: z
    .string()
    .describe('Fitness goals of the user (e.g., weight loss, muscle gain, general health).'),
  tastePreferences: z
    .string()
    .describe('Taste preferences of the user, including cuisines and disliked foods.'),
  cookingSkills: z.string().describe('The cooking skill level of the user.'),
  timeAvailability: z.string().describe('The time availability of the user for meal preparation.'),
  mealFrequency: z.string().describe('How many meals the user wants in the plan.'),
});
export type GenerateMealPlanInput = z.infer<typeof GenerateMealPlanInputSchema>;

const MealSchema = z.object({
  id: z.number().describe('Unique identifier for the meal.'),
  type: z.string().describe('The type of meal (e.g., breakfast, lunch, dinner).'),
  title: z.string().describe('The title of the meal.'),
  calories: z.number().describe('The number of calories in the meal.'),
  tags: z.array(z.string()).describe('Tags associated with the meal (e.g., High-Protein, Gluten-Free).'),
  image: z.string().describe('URL of the meal image.'),
});

const GenerateMealPlanOutputSchema = z.object({
  mealPlan: z.string().describe('A detailed meal plan for the user, including recipes and nutritional information, in JSON format.'),
});
export type GenerateMealPlanOutput = z.infer<typeof GenerateMealPlanOutputSchema>;

export async function generateMealPlan(input: GenerateMealPlanInput): Promise<GenerateMealPlanOutput> {
  return generateMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMealPlanPrompt',
  input: {
    schema: z.object({
      dietaryRestrictions: z
        .string()
        .describe('Dietary restrictions of the user (e.g., vegetarian, vegan, gluten-free).'),
      fitnessGoals: z
        .string()
        .describe('Fitness goals of the user (e.g., weight loss, muscle gain, general health).'),
      tastePreferences: z
        .string()
        .describe('Taste preferences of the user, including cuisines and disliked foods.'),
      cookingSkills: z.string().describe('The cooking skill level of the user.'),
      timeAvailability: z.string().describe('The time availability of the user for meal preparation.'),
      mealFrequency: z.string().describe('How many meals the user wants in the plan.'),
    }),
  },
  output: {
    schema: z.object({
      mealPlan: z.string().describe('A detailed meal plan for the user, including recipes and nutritional information, in JSON format.'),
    }),
  },
  prompt: `You are a personal meal plan assistant. Generate a meal plan based on the following information:

Dietary Restrictions: {{{dietaryRestrictions}}}
Fitness Goals: {{{fitnessGoals}}}
Taste Preferences: {{{tastePreferences}}}
Cooking Skills: {{{cookingSkills}}}
Time Availability: {{{timeAvailability}}}
Meal Frequency: {{{mealFrequency}}}

Create a meal plan that is tailored to the user's specific needs and preferences. The meal plan should be an array of JSON objects. Each object should conform to the following schema:

\`\`\`json
{
  "id": 1,
  "type": "Breakfast",
  "title": "Vegan Chickpea Quinoa Bowl",
  "calories": 520,
  "tags": ["High-Protein", "Gluten-Free", "30 Min"],
  "image": "https://picsum.photos/200/150"
}
\`\`\`

Ensure the output is valid JSON.
`,
});

const generateMealPlanFlow = ai.defineFlow<
  typeof GenerateMealPlanInputSchema,
  typeof GenerateMealPlanOutputSchema
>(
  {
    name: 'generateMealPlanFlow',
    inputSchema: GenerateMealPlanInputSchema,
    outputSchema: GenerateMealPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

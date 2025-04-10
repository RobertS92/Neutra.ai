'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Button} from '@/components/ui/button';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {generateMealPlan} from '@/ai/flows/generate-meal-plan';
import {useToast} from '@/hooks/use-toast';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {MealPlan} from '@/types';

const formSchema = z.object({
  dietaryRestrictions: z.string().describe('Dietary restrictions'),
  fitnessGoals: z.string().describe('Fitness goals'),
  tastePreferences: z.string().describe('Taste preferences'),
  cookingSkills: z.string().describe('Cooking skills'),
  timeAvailability: z.string().describe('Time availability'),
  mealFrequency: z.string().describe('Meal frequency'),
});

interface OnboardingFormProps {
  setMealPlan: (mealPlan: MealPlan) => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({setMealPlan}) => {
  const {toast} = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryRestrictions: '',
      fitnessGoals: '',
      tastePreferences: '',
      cookingSkills: '',
      timeAvailability: '',
      mealFrequency: '',
    },
  });

  useEffect(() => {
    form.reset();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const mealPlanData = await generateMealPlan(values);
      if (mealPlanData) {
        setMealPlan({content: mealPlanData.mealPlan});
        toast({
          title: 'Meal plan generated successfully!',
        });
        router.refresh();
      } else {
        toast({
          title: 'Failed to generate meal plan.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error generating meal plan.',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
        <FormField
          control={form.control}
          name="dietaryRestrictions"
          render={({field}) => (
            <FormItem>
              <FormLabel>Dietary Restrictions</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vegetarian, Gluten-Free" {...field} />
              </FormControl>
              <FormDescription>Specify any dietary restrictions you have.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fitnessGoals"
          render={({field}) => (
            <FormItem>
              <FormLabel>Fitness Goals</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weight Loss, Muscle Gain" {...field} />
              </FormControl>
              <FormDescription>
                Let us know about your fitness goals so we can generate appropriate meal plan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tastePreferences"
          render={({field}) => (
            <FormItem>
              <FormLabel>Taste Preferences</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Likes Italian, Dislikes Spicy" {...field} />
              </FormControl>
              <FormDescription>Mention your taste preferences.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cookingSkills"
          render={({field}) => (
            <FormItem>
              <FormLabel>Cooking Skills</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Beginner, Intermediate" {...field} />
              </FormControl>
              <FormDescription>Specify your cooking skill level.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeAvailability"
          render={({field}) => (
            <FormItem>
              <FormLabel>Time Availability</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 30 minutes, 1 hour" {...field} />
              </FormControl>
              <FormDescription>
                Specify the time you have available for meal preparation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealFrequency"
          render={({field}) => (
            <FormItem>
              <FormLabel>Meal Frequency</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3 meals, 5 meals" {...field} />
              </FormControl>
              <FormDescription>
                Specify how many meals you would like to have in your plan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Generate Meal Plan</Button>
      </form>
    </Form>
  );
};

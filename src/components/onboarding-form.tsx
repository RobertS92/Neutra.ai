'use client';

import {useState, useCallback, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {PantryScanner} from '@/components/pantry-scanner';
import {useToast} from '@/hooks/use-toast';
import {Textarea} from '@/components/ui/textarea';
import {Slider} from '@/components/ui/slider';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define types for onboarding data and steps
interface OnboardingData {
  entryMode?: 'llm' | 'interactive';
  age?: number;
  height?: number;
  weight?: number;
  biologicalSex?: string;
  activityLevel?: string;
  fitnessGoals?: string;
  goalIntensity?: number;
  dietType?: string;
  allergies?: string[];
  medicalConditions?: string[];
  tastePreferences?: {
    sweet: number;
    spicy: number;
    savory: number;
    umami: number;
  };
  preferredCuisines?: string[];
  dislikedIngredients?: string[];
  timePerMeal?: number;
  cookingSkill?: string;
  equipment?: string[];
  mealPrepPreference?: string;
  pantryInventory?: string;
  manualIngredients?: string;
  uploadedIngredients?: { [category: string]: string[] };
  summaryConfirmation?: boolean;
}

interface StepProps {
  onNext: () => void;
  onSelect: (value: any) => void;
  onboardingData: OnboardingData;
}

const onboardingFormSchema = z.object({
  entryMode: z.enum(['llm', 'interactive']).optional(),
  age: z.number().min(12).max(100).optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  biologicalSex: z.string().optional(),
  activityLevel: z.string().optional(),
  fitnessGoals: z.string().optional(),
  goalIntensity: z.number().min(0).max(100).optional(),
  dietType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  tastePreferences: z.object({
    sweet: z.number(),
    spicy: z.number(),
    savory: z.number(),
    umami: z.number(),
  }).optional(),
  preferredCuisines: z.array(z.string()).optional(),
  dislikedIngredients: z.array(z.string()).optional(),
  timePerMeal: z.number().optional(),
  cookingSkill: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  mealPrepPreference: z.string().optional(),
  pantryInventory: z.string().optional(),
  manualIngredients: z.string().optional(),
  uploadedIngredients: z.record(z.array(z.string())).optional(),
  summaryConfirmation: z.boolean().optional(),
});

export const OnboardingForm = ({setMealPlan}: {setMealPlan: () => void}) => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: onboardingData,
  });

  const handleNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handleDataCapture = (data: Partial<OnboardingData>) => {
    setOnboardingData(prevData => ({...prevData, ...data}));
  };

  const EntryModeStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {entryMode: 'llm' | 'interactive'}) => void}) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>How would you like to set up your personalized meal experience?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button variant="outline" onClick={() => {
            onSelect({entryMode: 'llm'});
            onNext();
          }}>
            Describe Your Goals (Recommended for Fast Setup)
          </Button>
          <CardDescription>Tell us what you're trying to achieve and we’ll take care of the rest.</CardDescription>
          <Button variant="outline" onClick={() => {
            onSelect({entryMode: 'interactive'});
            onNext();
          }}>
            Build My Plan Step-by-Step (Interactive Setup)
          </Button>
          <CardDescription>Tap through guided steps to customize everything visually.</CardDescription>
        </CardContent>
      </Card>
    );
  };

  const AgeAndBasicInfoStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {age: number}) => void}) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Age</CardTitle>
          <CardDescription>We adjust calories, nutrients, and recommendations based on your age.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <FormField
              control={form.control}
              name="age"
              render={({field}) => (
                <FormItem>
                  <FormLabel>How old are you?</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => {
                      const age = parseInt(e.target.value);
                      if (!isNaN(age)) {
                        onSelect({age: age});
                      }
                      field.onChange(age);
                    }}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </Form>
          <Button onClick={onNext}>Next</Button>
        </CardContent>
      </Card>
    );
  };

  const FitnessGoalsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {fitnessGoals: string}) => void}) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Fitness Goals</CardTitle>
          <CardDescription>What are your fitness and health goals?</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <FormField
              control={form.control}
              name="fitnessGoals"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Fitness Goals</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} onChange={(e) => {
                      onSelect({fitnessGoals: e.target.value});
                      field.onChange(e.target.value);
                    }}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </Form>
          <Button onClick={onNext}>Next</Button>
        </CardContent>
      </Card>
    );
  };

  const GoalIntensityStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {goalIntensity: number}) => void}) => {
    const [intensity, setIntensity] = useState(50);

    useEffect(() => {
      onSelect({goalIntensity: intensity});
    }, [intensity, onSelect]);

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Goal Intensity</CardTitle>
          <CardDescription>How aggressive should your plan be?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Slider
              defaultValue={[intensity]}
              max={100}
              min={0}
              step={1}
              onValueChange={(value) => setIntensity(value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Gentle</span>
              <span>Balanced</span>
              <span>Committed</span>
              <span>Maximum Effort</span>
            </div>
          </div>
          <Button onClick={onNext}>Next</Button>
        </CardContent>
      </Card>
    );
  };

  const DietaryNeedsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {dietType: string}) => void}) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dietary Needs</CardTitle>
          <CardDescription>Select your diet type.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => {
              onSelect({dietType: 'vegetarian'});
              onNext();
            }}>Vegetarian</Button>
            <Button variant="outline" onClick={() => {
              onSelect({dietType: 'vegan'});
              onNext();
            }}>Vegan</Button>
            <Button variant="outline" onClick={() => {
              onSelect({dietType: 'ketogenic'});
              onNext();
            }}>Ketogenic</Button>
            <Button variant="outline" onClick={() => {
              onSelect({dietType: 'paleo'});
              onNext();
            }}>Paleo</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AllergiesStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {allergies: string[]}) => void}) => {
    const [allergies, setAllergies] = useState<string[]>([]);

    const handleAllergySelection = (allergy: string) => {
      if (allergies.includes(allergy)) {
        setAllergies(prevAllergies => prevAllergies.filter(item => item !== allergy));
      } else {
        setAllergies(prevAllergies => [...prevAllergies, allergy]);
      }
    };

    useEffect(() => {
      onSelect({allergies: allergies});
    }, [allergies, onSelect]);

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Allergies &amp; Intolerances</CardTitle>
          <CardDescription>Select any allergies or intolerances you have.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => handleAllergySelection('dairy')}>Dairy</Button>
            <Button variant="outline" onClick={() => handleAllergySelection('gluten')}>Gluten</Button>
            <Button variant="outline" onClick={() => handleAllergySelection('soy')}>Soy</Button>
          </div>
          <Button onClick={onNext}>Next</Button>
        </CardContent>
      </Card>
    );
  };

  const TastePreferencesStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {tastePreferences: {sweet: number, spicy: number, savory: number, umami: number}}) => void}) => {
    const [tastePreferences, setTastePreferences] = useState({
      sweet: 50,
      spicy: 50,
      savory: 50,
      umami: 50,
    });

    useEffect(() => {
      onSelect({tastePreferences: tastePreferences});
    }, [tastePreferences, onSelect]);

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Taste &amp; Cuisine Preferences</CardTitle>
          <CardDescription>Tell us about your taste preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Sweet</Label>
              <Slider
                defaultValue={[tastePreferences.sweet]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => setTastePreferences({...tastePreferences, sweet: value[0]})}
              />
            </div>
            <div>
              <Label>Spicy</Label>
              <Slider
                defaultValue={[tastePreferences.spicy]}
                max={100}
                min={0}
                step={1}
                onValueChange={(value) => setTastePreferences({...tastePreferences, spicy: value[0]})}
              />
            </div>
          </div>
          <Button onClick={onNext}>Next</Button>
        </CardContent>
      </Card>
    );
  };

  const CuisinePreferencesStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {preferredCuisines: string[]}) => void}) => {
    const [preferredCuisines, setPreferredCuisines] = useState<string[]>([]);

    const handleCuisineSelection = (cuisine: string) => {
      if (preferredCuisines.includes(cuisine)) {
        setPreferredCuisines(prevCuisines => prevCuisines.filter(item => item !== cuisine));
      } else {
        setPreferredCuisines(prevCuisines => [...prevCuisines, cuisine]);
      }
    };

    useEffect(() => {
      onSelect({preferredCuisines: preferredCuisines});
    }, [preferredCuisines, onSelect]);

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cuisine Preferences</CardTitle>
          <CardDescription>Select your preferred cuisines.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => handleCuisineSelection('mediterranean')}>Mediterranean</Button>
            <Button variant="outline" onClick={() => handleCuisineSelection('asian')}>Asian</Button>
            <Button variant="outline" onClick={() => handleCuisineSelection('latin')}>Latin</Button>
          </div>
          <Button onClick={onNext}>Next</Button>
        </CardContent>
      </Card>
    );
  };

  const CookingHabitsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {timePerMeal: number, cookingSkill: string}) => void}) => {
    const [timePerMeal, setTimePerMeal] = useState(20);
    const [cookingSkill, setCookingSkill] = useState('beginner');

    useEffect(() => {
      onSelect({timePerMeal: timePerMeal, cookingSkill: cookingSkill});
    }, [timePerMeal, cookingSkill, onSelect]);

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cooking Habits</CardTitle>
          <CardDescription>Tell us about your cooking habits.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Time per meal (minutes)</Label>
              <Slider
                defaultValue={[timePerMeal]}
                max={60}
                min={10}
                step={5}
                onValueChange={(value) => setTimePerMeal(value[0])}
              />
            </div>
            <div>
              <Label>Cooking Skill</Label>
              <Select onValueChange={(value) => setCookingSkill(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="confident">Confident</SelectItem>
                  <SelectItem value="chef">Chef</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={onNext}>Next</Button>
        </CardContent>
      </Card>
    );
  };

  const EquipmentStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {equipment: string[]}) => void}) => {
    const [equipment, setEquipment] = useState<string[]>([]);

    const handleEquipmentSelection = (equipmentItem: string) => {
      if (equipment.includes(equipmentItem)) {
        setEquipment(prevEquipment => prevEquipment.filter(item => item !== equipmentItem));
      } else {
        setEquipment(prevEquipment => [...prevEquipment, equipmentItem]);
      }
    };

    useEffect(() => {
      onSelect({equipment: equipment});
    }, [equipment, onSelect]);

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Equipment</CardTitle>
          <CardDescription>Select the equipment you have.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => handleEquipmentSelection('oven')}>Oven</Button>
            <Button variant="outline" onClick={() => handleEquipmentSelection('blender')}>Blender</Button>
            <Button variant="outline" onClick={() => handleEquipmentSelection('air fryer')}>Air Fryer</Button>
          </div>
          <Button onClick={onNext}>Next</Button>
        </CardContent>
      </Card>
    );
  };

  const PantryScanStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {pantryInventory?:string; manualIngredients?:string; uploadedIngredients?: { [category: string]: string[] }}) => void}) => {
    const [pantryInventory, setPantryInventory] = useState('');
    const [manualIngredients, setManualIngredients] = useState('');
    const [uploadedIngredients, setUploadedIngredients] = useState<{ [category: string]: string[] }>({});
  
    const handleCategorySelection = (category: string, ingredient: string) => {
      setUploadedIngredients(prevIngredients => {
        const updatedIngredients = { ...prevIngredients };
  
        if (!updatedIngredients[category]) {
          updatedIngredients[category] = [];
        }
  
        if (updatedIngredients[category].includes(ingredient)) {
          updatedIngredients[category] = updatedIngredients[category].filter(item => item !== ingredient);
        } else {
          updatedIngredients[category].push(ingredient);
        }
          
        onSelect({ uploadedIngredients: updatedIngredients });
        return updatedIngredients;
      });
    };
  
    const predefinedCategories = [
      'Fruits',
      'Vegetables',
      'Grains',
      'Proteins',
      'Dairy',
      'Spices',
      'Oils',
      'Nuts',
      'Canned Goods',
      'Baking Supplies',
    ];
  
    const subcategories = {
      Fruits: ['Apple', 'Banana', 'Orange', 'Grapes', 'Strawberries'],
      Vegetables: ['Carrot', 'Broccoli', 'Spinach', 'Tomato', 'Cucumber'],
      Grains: ['Rice', 'Quinoa', 'Oats', 'Pasta', 'Bread'],
      Proteins: ['Chicken', 'Beef', 'Tofu', 'Lentils', 'Eggs'],
      Dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream'],
      Spices: ['Salt', 'Pepper', 'Cumin', 'Paprika', 'Garlic Powder'],
      Oils: ['Olive Oil', 'Coconut Oil', 'Vegetable Oil', 'Sesame Oil'],
      Nuts: ['Almonds', 'Peanuts', 'Cashews', 'Walnuts', 'Pecans'],
      'Canned Goods': ['Tomatoes', 'Beans', 'Corn', 'Peas'],
      'Baking Supplies': ['Flour', 'Sugar', 'Baking Powder', 'Vanilla Extract'],
    };
  
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Pantry Scan (Optional)</CardTitle>
          <CardDescription>Want to scan your pantry or fridge to start with what you already have?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <PantryScanner />
            <Textarea
              placeholder="Manually enter ingredients"
              value={manualIngredients}
              onChange={(e) => {
                setManualIngredients(e.target.value);
                onSelect({ manualIngredients: e.target.value });
              }}
            />
             <div className="flex flex-col space-y-2">
              {predefinedCategories.map((category) => (
                <div key={category} className="flex flex-col space-y-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">{category}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {subcategories[category]?.map((ingredient) => (
                        <DropdownMenuItem key={ingredient}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start ${
                              uploadedIngredients[category]?.includes(ingredient) ? 'bg-accent text-accent-foreground' : ''
                            }`}
                            onClick={() => handleCategorySelection(category, ingredient)}
                          >
                            {ingredient}
                          </Button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
  
            <Button onClick={() => {
              onSelect({ uploadedIngredients: uploadedIngredients });
              onNext();
            }}>Upload</Button>
            <Button variant="secondary" onClick={onNext}>Skip and plan from scratch</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SummaryConfirmationStep = ({onNext, onSelect, onboardingData}: {onNext: () => void; onSelect: (value: {summaryConfirmation: boolean}) => void; onboardingData: OnboardingData}) => {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Summary &amp; Confirmation</CardTitle>
          <CardDescription>Review your preferences and confirm.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p>Age: {onboardingData.age}</p>
            <p>Fitness Goals: {onboardingData.fitnessGoals}</p>
            <p>Diet Type: {onboardingData.dietType}</p>
            <Button onClick={() => {
              onSelect({summaryConfirmation: true});
              onNext();
            }}>Looks Good - Start Meal Planning</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EntryModeStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 2:
        return (
          <AgeAndBasicInfoStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 3:
        return (
          <FitnessGoalsStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 4:
        return (
          <GoalIntensityStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 5:
        return (
          <DietaryNeedsStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 6:
        return (
          <AllergiesStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 7:
        return (
          <TastePreferencesStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 8:
        return (
          <CuisinePreferencesStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 9:
        return (
          <CookingHabitsStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 10:
        return (
          <EquipmentStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 11:
        return (
          <MealPrepPreferenceStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 12:
        return (
          <PantryScanStep
            onNext={handleNextStep}
            onSelect={(value) => handleDataCapture(value)}
          />
        );
      case 13:
        return (
          <SummaryConfirmationStep
            onNext={() => {
              console.log('Final Onboarding Data:', onboardingData);
              toast({
                title: 'Onboarding Complete!',
                description: 'Your meal plan is being generated.',
              });
              // NOW CALL THE SET ONBOARDING COMPLETE FOR HOME SCREEN
              setMealPlan();
            }}
            onSelect={(value) => handleDataCapture({summaryConfirmation: value})}
            onboardingData={onboardingData}
          />
        );
      default:
        return <p>Onboarding Complete!</p>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {renderStep()}
    </div>
  );
};

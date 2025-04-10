'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Icons} from '@/components/icons';
import {useState, useCallback} from 'react';
import {Slider} from '@/components/ui/slider';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {PantryScanner} from '@/components/pantry-scanner';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';

// Define types for onboarding data and steps
interface OnboardingData {
  entryMode?: 'llm' | 'interactive';
  age?: number;
  basicInfo?: {height?: number; weight?: number; biologicalSex?: string; activityLevel?: string};
  fitnessGoals?: {
    primaryGoal: string;
    secondaryGoals?: string[];
    weightChange?: number;
    timeline?: string;
    activityLevel?: string;
    intensityLevel?: number;
    trainingSchedule?: string;
    targetBodyAreas?: string[];
    recompositionIntent?: string;
  };
  dietaryNeeds?: {
    dietType: string;
    allergies?: string[];
    medicalConditions?: string[];
  };
  tastePreferences?: {
    sweet?: number;
    spicy?: number;
    savory?: number;
    umami?: number;
    cuisines?: string[];
    dislikedIngredients?: string[];
  };
  cookingHabits?: {
    timePerMeal?: string;
    cookingSkill?: string;
    equipment?: string[];
    mealPrepPreference?: string;
  };
  pantryInventory?: string;
  manualIngredients?: string;
  summaryConfirmation?: string;
  uploadedIngredients?: { [category: string]: string[] }; // Added: Track uploaded ingredients
}

const dietTypeOptions = [
  {value: 'omnivore', label: 'Omnivore'},
  {value: 'vegetarian', label: 'Vegetarian'},
  {value: 'vegan', label: 'Vegan'},
  {value: 'pescatarian', label: 'Pescatarian'},
  {value: 'keto', label: 'Keto'},
  {value: 'lowFODMAP', label: 'Low-FODMAP'},
  {value: 'diabetic', label: 'Diabetic-Friendly'},
  {value: 'paleo', label: 'Paleo'},
  {value: 'glutenFree', label: 'Gluten-Free'},
  {value: 'dash', label: 'DASH'},
  {value: 'whole30', label: 'Whole30'},
  {value: 'aip', label: 'AIP'},
  {value: 'highProtein', label: 'High-Protein'},
  {value: 'mediterranean', label: 'Mediterranean'},
];

const cuisineOptions = [
  {value: 'mediterranean', label: 'Mediterranean'},
  {value: 'asian', label: 'Asian'},
  {value: 'latin', label: 'Latin'},
  {value: 'african', label: 'African'},
  {value: 'indian', label: 'Indian'},
  {value: 'american', label: 'American'},
];

const equipmentOptions = [
  {value: 'oven', label: 'Oven'},
  {value: 'blender', label: 'Blender'},
  {value: 'airFryer', label: 'Air Fryer'},
  {value: 'crockpot', label: 'Crockpot'},
];

interface OnboardingFormProps {
  setMealPlan: (mealPlan: {content: string}) => void;
}

// Functional components for each step
const EntryModeStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: 'llm' | 'interactive') => void}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>How would you like to set up your personalized meal experience?</CardTitle>
        <CardDescription>We adjust calories, nutrients, and recommendations based on your age.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          onClick={() => {
            onSelect('llm');
            onNext();
          }}
        >
          Describe Your Goals (Recommended for Fast Setup)
        </Button>
        <Button
          onClick={() => {
            onSelect('interactive');
            onNext();
          }}
        >
          Build My Plan Step-by-Step (Interactive Setup)
        </Button>
      </CardContent>
    </Card>
  );
};

const AgeStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: number) => void}) => {
  const [age, setAge] = useState<number | null>(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>How old are you?</CardTitle>
        <CardDescription>We adjust calories, nutrients, and recommendations based on your age.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Input
          type="number"
          placeholder="Enter your age"
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            if (age && age >= 12 && age <= 100) {
              onSelect(age);
              onNext();
            }
          }}
          disabled={!age || age < 12 || age > 100}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

const FitnessGoalsLLMStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: string) => void}) => {
  const [goals, setGoals] = useState('');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fitness &amp; Health Goals (LLM)</CardTitle>
        <CardDescription>
          What are your fitness and health goals? Include things like weight changes, muscle targets, energy goals, or timelines.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Textarea placeholder="Enter your goals" onChange={(e) => setGoals(e.target.value)} />
        <Button
          onClick={() => {
            onSelect(goals);
            onNext();
          }}
          disabled={!goals}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

const FitnessGoalsInteractiveStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => {
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
  const [weightChange, setWeightChange] = useState<number | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  const [intensityLevel, setIntensityLevel] = useState<number[]>([50]);

  const handleIntensityChange = (value: number[]) => {
    setIntensityLevel(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fitness &amp; Health Goals (Interactive)</CardTitle>
        <CardDescription>Choose your primary goal and provide additional details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <h3 className="text-lg font-semibold">Primary Goal</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={primaryGoal === 'loseWeight' ? 'default' : 'outline'}
            onClick={() => setPrimaryGoal('loseWeight')}
          >
            Lose Weight
          </Button>
          <Button
            variant={primaryGoal === 'buildMuscle' ? 'default' : 'outline'}
            onClick={() => setPrimaryGoal('buildMuscle')}
          >
            Build Muscle
          </Button>
          <Button
            variant={primaryGoal === 'recomposition' ? 'default' : 'outline'}
            onClick={() => setPrimaryGoal('recomposition')}
          >
            Recomposition
          </Button>
          <Button
            variant={primaryGoal === 'endurance' ? 'default' : 'outline'}
            onClick={() => setPrimaryGoal('endurance')}
          >
            Endurance &amp; Performance
          </Button>
          <Button
            variant={primaryGoal === 'maintainWeight' ? 'default' : 'outline'}
            onClick={() => setPrimaryGoal('maintainWeight')}
          >
            Maintain Weight
          </Button>
          <Button
            variant={primaryGoal === 'supportCondition' ? 'default' : 'outline'}
            onClick={() => setPrimaryGoal('supportCondition')}
          >
            Support a Medical Condition
          </Button>
          <Button
            variant={primaryGoal === 'postpartum' ? 'default' : 'outline'}
            onClick={() => setPrimaryGoal('postpartum')}
          >
            Postpartum Recovery
          </Button>
          <Button
            variant={primaryGoal === 'healthyAging' ? 'default' : 'outline'}
            onClick={() => setPrimaryGoal('healthyAging')}
          >
            Healthy Aging / Longevity
          </Button>
        </div>

        {primaryGoal === 'loseWeight' && (
          <>
            <h3 className="text-lg font-semibold">Lose Weight Details</h3>
            <Input
              type="number"
              placeholder="How many pounds would you like to lose?"
              onChange={(e) => setWeightChange(Number(e.target.value))}
            />
            <Input type="text" placeholder="By when?" onChange={(e) => setTimeline(e.target.value)} />
            <Input type="text" placeholder="How active are you?" onChange={(e) => setActivityLevel(e.target.value)} />
          </>
        )}

        <h3 className="text-lg font-semibold">Goal Intensity</h3>
        <div className="flex items-center space-x-4">
          <span className="w-12 text-right">Intensity:</span>
          <Slider
            defaultValue={intensityLevel}
            max={100}
            min={0}
            step={1}
            onValueChange={handleIntensityChange}
            className="flex-1"
          />
          <span className="w-12">{intensityLevel[0]}%</span>
        </div>

        <Button
          onClick={() => {
            onSelect({
              primaryGoal,
              weightChange,
              timeline,
              activityLevel,
              intensityLevel: intensityLevel[0],
            });
            onNext();
          }}
          disabled={!primaryGoal}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

const DietaryNeedsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => {
  const [dietType, setDietType] = useState<string | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showDietDisclaimer, setShowDietDisclaimer] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddAllergy = () => {
    if (inputValue.trim() !== '' && !allergies.includes(inputValue.trim())) {
      setAllergies([...allergies, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setAllergies(allergies.filter(allergy => allergy !== allergyToRemove));
  };

  const handleDietTypeChange = (value: string) => {
    setDietType(value);
    if (['keto', 'aip', 'whole30'].includes(value)) {
      setShowDietDisclaimer(true);
    } else {
      setShowDietDisclaimer(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dietary Needs &amp; Health</CardTitle>
        <CardDescription>Select your diet type and any allergies or medical conditions.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <h3 className="text-lg font-semibold">Select Your Diet Type</h3>
        <div className="flex flex-wrap gap-2">
          {dietTypeOptions.map(option => (
            <Button
              key={option.value}
              variant={dietType === option.value ? 'default' : 'outline'}
              onClick={() => handleDietTypeChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {showDietDisclaimer && (
          <Alert variant="warning">
            <AlertTitle>Trigger Warning/Disclaimer</AlertTitle>
            <AlertDescription>
              Some restrictive diets can affect your health. Consult a professional before starting plans like Keto, AIP, or Whole30.
            </AlertDescription>
          </Alert>
        )}

        <h3 className="text-lg font-semibold">Allergies &amp; Intolerances</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {allergies.map(allergy => (
            <Button key={allergy} variant="secondary" onClick={() => handleRemoveAllergy(allergy)}>
              {allergy}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add allergy"
            value={inputValue}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-full"
          />
          <Button type="button" onClick={handleAddAllergy}>
            Add
          </Button>
        </div>

        <h3 className="text-lg font-semibold">Medical Conditions (Optional)</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={medicalConditions.includes('diabetes') ? 'default' : 'outline'}
            onClick={() =>
              setMedicalConditions(prev =>
                prev.includes('diabetes') ? prev.filter(item => item !== 'diabetes') : [...prev, 'diabetes']
              )
            }
          >
            Diabetes
          </Button>
          <Button
            variant={medicalConditions.includes('pcos') ? 'default' : 'outline'}
            onClick={() =>
              setMedicalConditions(prev => (prev.includes('pcos') ? prev.filter(item => item !== 'pcos') : [...prev, 'pcos']))
            }
          >
            PCOS
          </Button>
          {/* Add more medical conditions as needed */}
        </div>

        <Button
          onClick={() => {
            onSelect({
              dietType,
              allergies,
              medicalConditions,
            });
            onNext();
          }}
          disabled={!dietType}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

const TastePreferencesStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => {
  const [sweet, setSweet] = useState<number[]>([50]);
  const [spicy, setSpicy] = useState<number[]>([50]);
  const [savory, setSavory] = useState<number[]>([50]);
  const [umami, setUmami] = useState<number[]>([50]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSliderChange = (setter: (value: number[]) => void) => (value: number[]) => {
    setter(value);
  };

  const handleCuisineSelect = (cuisine: string) => {
    setCuisines(prev => {
      if (prev.includes(cuisine)) {
        return prev.filter(item => item !== cuisine);
      } else {
        return [...prev, cuisine];
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddDislikedIngredient = () => {
    if (inputValue.trim() !== '' && !dislikedIngredients.includes(inputValue.trim())) {
      setDislikedIngredients([...dislikedIngredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveDislikedIngredient = (ingredientToRemove: string) => {
    setDislikedIngredients(dislikedIngredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Taste &amp; Cuisine Preferences</CardTitle>
        <CardDescription>Tell us about your taste preferences.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <h3 className="text-lg font-semibold">Flavor Preferences</h3>
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <span className="w-12 text-right">Sweet:</span>
            <Slider
              defaultValue={sweet}
              max={100}
              min={0}
              step={1}
              onValueChange={handleSliderChange(setSweet)}
              className="flex-1"
            />
            <span className="w-12">{sweet[0]}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-12 text-right">Spicy:</span>
            <Slider
              defaultValue={spicy}
              max={100}
              min={0}
              step={1}
              onValueChange={handleSliderChange(setSpicy)}
              className="flex-1"
            />
            <span className="w-12">{spicy[0]}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-12 text-right">Savory:</span>
            <Slider
              defaultValue={savory}
              max={100}
              min={0}
              step={1}
              onValueChange={handleSliderChange(setSavory)}
              className="flex-1"
            />
            <span className="w-12">{savory[0]}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-12 text-right">Umami:</span>
            <Slider
              defaultValue={umami}
              max={100}
              min={0}
              step={1}
              onValueChange={handleSliderChange(setUmami)}
              className="flex-1"
            />
            <span className="w-12">{umami[0]}%</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold">Cuisine Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {cuisineOptions.map(cuisine => (
            <Button
              key={cuisine.value}
              variant={cuisines.includes(cuisine.value) ? 'default' : 'outline'}
              onClick={() => handleCuisineSelect(cuisine.value)}
            >
              {cuisine.label}
            </Button>
          ))}
        </div>

        <h3 className="text-lg font-semibold">Disliked Ingredients</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {dislikedIngredients.map(ingredient => (
            <Button key={ingredient} variant="secondary" onClick={() => handleRemoveDislikedIngredient(ingredient)}>
              {ingredient}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add disliked ingredient"
            value={inputValue}
            onChange={handleInputChange}
            className="border rounded px-2 py-1 w-full"
          />
          <Button type="button" onClick={handleAddDislikedIngredient}>
            Add
          </Button>
        </div>

        <Button
          onClick={() => {
            onSelect({
              sweet: sweet[0],
              spicy: spicy[0],
              savory: savory[0],
              umami: umami[0],
              cuisines,
              dislikedIngredients,
            });
            onNext();
          }}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

const CookingHabitsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => {
  const [timePerMeal, setTimePerMeal] = useState<string | null>(null);
  const [cookingSkill, setCookingSkill] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [mealPrepPreference, setMealPrepPreference] = useState<string | null>(null);

  const handleEquipmentSelect = (item: string) => {
    setEquipment(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cooking Habits &amp; Equipment</CardTitle>
        <CardDescription>Share your cooking habits and equipment.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <h3 className="text-lg font-semibold">Time Per Meal</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant={timePerMeal === '15' ? 'default' : 'outline'} onClick={() => setTimePerMeal('15')}>
            15 mins
          </Button>
          <Button variant={timePerMeal === '30' ? 'default' : 'outline'} onClick={() => setTimePerMeal('30')}>
            30 mins
          </Button>
          <Button variant={timePerMeal === '45' ? 'default' : 'outline'} onClick={() => setTimePerMeal('45')}>
            45+ mins
          </Button>
        </div>

        <h3 className="text-lg font-semibold">Cooking Skill</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant={cookingSkill === 'beginner' ? 'default' : 'outline'} onClick={() => setCookingSkill('beginner')}>
            Beginner
          </Button>
          <Button variant={cookingSkill === 'confident' ? 'default' : 'outline'} onClick={() => setCookingSkill('confident')}>
            Confident
          </Button>
          <Button variant={cookingSkill === 'chef' ? 'default' : 'outline'} onClick={() => setCookingSkill('chef')}>
            Chef
          </Button>
        </div>

        <h3 className="text-lg font-semibold">Equipment</h3>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map(item => (
            <Button
              key={item.value}
              variant={equipment.includes(item.value) ? 'default' : 'outline'}
              onClick={() => handleEquipmentSelect(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <h3 className="text-lg font-semibold">Meal Prep Preference</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={mealPrepPreference === 'daily' ? 'default' : 'outline'}
            onClick={() => setMealPrepPreference('daily')}
          >
            Daily
          </Button>
          <Button
            variant={mealPrepPreference === 'weekly' ? 'default' : 'outline'}
            onClick={() => setMealPrepPreference('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={mealPrepPreference === 'leftovers' ? 'default' : 'outline'}
            onClick={() => setMealPrepPreference('leftovers')}
          >
            Leftovers
          </Button>
          <Button
            variant={mealPrepPreference === 'noLeftovers' ? 'default' : 'outline'}
            onClick={() => setMealPrepPreference('noLeftovers')}
          >
            No Leftovers
          </Button>
        </div>

        <Button
          onClick={() => {
            onSelect({
              timePerMeal,
              cookingSkill,
              equipment,
              mealPrepPreference,
            });
            onNext();
          }}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

const PantryScanStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: {pantryInventory?:string,manualIngredients?:string, uploadedIngredients?: { [category: string]: string[] }}}) => {
  const [pantryInventory, setPantryInventory] = useState('');
  const [manualIngredients, setManualIngredients] = useState('');
  const [uploadedIngredients, setUploadedIngredients] = useState<{ [category: string]: string[] }>({});

  const handleIngredientSelect = (category: string, ingredient: string, selected: boolean) => {
    setUploadedIngredients(prev => {
      const categoryIngredients = prev[category] || [];
      if (selected) {
        return { ...prev, [category]: [...categoryIngredients, ingredient] };
      } else {
        return { ...prev, [category]: categoryIngredients.filter(item => item !== ingredient) };
      }
    });
  };

  const foodCategories = {
    'Grains': ['Rice', 'Pasta', 'Bread', 'Oats', 'Quinoa'],
    'Fruits': ['Apple', 'Banana', 'Orange', 'Grapes', 'Berries'],
    'Vegetables': ['Broccoli', 'Carrots', 'Spinach', 'Tomatoes', 'Potatoes'],
    'Proteins': ['Chicken', 'Beef', 'Fish', 'Tofu', 'Lentils'],
    'Dairy': ['Milk', 'Cheese', 'Yogurt', 'Butter'],
    'Spices': ['Salt', 'Pepper', 'Garlic Powder', 'Cumin', 'Paprika'],
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pantry Scan (Optional)</CardTitle>
        <CardDescription>
          Want to scan your pantry, upload a list, or plan from scratch?
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <PantryScanner />
        <Accordion type="multiple">
          {Object.entries(foodCategories).map(([category, ingredients]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map(ingredient => (
                    <Button
                      key={ingredient}
                      variant={uploadedIngredients[category]?.includes(ingredient) ? 'default' : 'outline'}
                      onClick={() => {
                        const isSelected = !uploadedIngredients[category]?.includes(ingredient);
                        handleIngredientSelect(category, ingredient, isSelected);
                      }}
                    >
                      {ingredient}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Textarea
          placeholder="Enter ingredients manually (comma-separated)"
          onChange={(e) => setManualIngredients(e.target.value)}
        />
        <Button
          onClick={() => {
            onSelect({pantryInventory, manualIngredients, uploadedIngredients});
            onNext();
          }}
        >
          Upload - Skip and plan from scratch
        </Button>
      </CardContent>
    </Card>
  );
};

const SummaryConfirmationStep = ({onNext, onSelect, onboardingData}: {onNext: () => void; onSelect: (value: string) => void; onboardingData: OnboardingData}) => {
  const [summary, setSummary] = useState('');
  const {toast} = useToast();

  // Generate a summary based on the onboarding data
  const generateSummary = useCallback(() => {
    let generatedSummary = 'Here’s what we’ll do: ';
    if (onboardingData.age) {
      generatedSummary += `You’re ${onboardingData.age}, `;
    }
    if (onboardingData.fitnessGoals) {
      generatedSummary += `want to achieve your fitness goals `;
    }
    if (onboardingData.dietaryNeeds) {
      generatedSummary += `while following a ${onboardingData.dietaryNeeds.dietType} diet `;
    }
    generatedSummary += 'We’ll create a personalized meal plan that fits your needs.';
    setSummary(generatedSummary);
  }, [onboardingData]);

  // Generate summary on component mount
  useState(() => {
    generateSummary();
  }, [generateSummary]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Smart Summary &amp; Confirmation</CardTitle>
        <CardDescription>Review your preferences and confirm your meal plan.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
        <div className="flex justify-between">
          <Button
            onClick={() => {
              onSelect(summary);
              onNext();
              toast({
                title: 'Meal Plan Generated!',
                description: 'Your personalized meal plan is ready.',
              });
              setMealPlan({content: 'Generated Meal Plan Content'});
            }}
          >
            Looks Good - Start Meal Planning
          </Button>
          <Button variant="outline" onClick={() => {}}>
            Edit Something
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const OnboardingForm: React.FC<OnboardingFormProps> = ({setMealPlan}) => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const {toast} = useToast();

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handleDataCapture = (data: any) => {
    setOnboardingData(prevData => ({...prevData, ...data}));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EntryModeStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({entryMode: value})}
          />
        );
      case 2:
        return (
          <AgeStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({age: value})}
          />
        );
      case 3:
        if (onboardingData.entryMode === 'llm') {
          return (
            <FitnessGoalsLLMStep
              onNext={nextStep}
              onSelect={(value) => handleDataCapture({fitnessGoals: value})}
            />
          );
        } else {
          return (
            <FitnessGoalsInteractiveStep
              onNext={nextStep}
              onSelect={(value) => handleDataCapture({fitnessGoals: value})}
            />
          );
        }
      case 4:
        return (
          <DietaryNeedsStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({dietaryNeeds: value})}
          />
        );
      case 5:
        return (
          <TastePreferencesStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({tastePreferences: value})}
          />
        );
      case 6:
        return (
          <CookingHabitsStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({cookingHabits: value})}
          />
        );
      case 7:
        return (
          <PantryScanStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({pantryInventory: value})}
          />
        );
      case 8:
        return (
          <SummaryConfirmationStep
            onNext={() => {
              console.log('Final Onboarding Data:', onboardingData);
              toast({
                title: 'Onboarding Complete!',
                description: 'Your meal plan is being generated.',
              });
              setMealPlan({content: 'Generated Meal Plan Content'});
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


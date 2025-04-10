'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Icons} from '@/components/icons';
import {useState} from 'react';
import {Slider} from '@/components/ui/slider';

// Define types for onboarding data and steps
interface OnboardingData {
  cookingFor?: string[];
  dietType?: string;
  fitnessGoals?: string;
  allergies?: string[];
  tastePreferences?: {spicy: number; cuisines: string[]; dislikedFoods: string[]};
  cookingHabits?: {cookEveryday: boolean; mealPrep: boolean; fastMeals: boolean};
  scheduleSync?: {appleHealth: boolean; fastingWindow: string; workoutSchedule: boolean};
}

const cookingForOptions = [
  {value: 'justMe', label: 'Just me'},
  {value: 'mePartner', label: 'Me + partner'},
  {value: 'family', label: 'Family'},
  {value: 'healthNeeds', label: 'For someone with health needs'},
  {value: 'mealPrep', label: 'Meal prep for the week'},
];

const dietTypeOptions = [
  {value: 'omnivore', label: 'Omnivore'},
  {value: 'vegetarian', label: 'Vegetarian'},
  {value: 'vegan', label: 'Vegan'},
  {value: 'pescatarian', label: 'Pescatarian'},
  {value: 'keto', label: 'Keto'},
  {value: 'lowFODMAP', label: 'Low-FODMAP'},
  {value: 'diabetic', label: 'Diabetic'},
];

const cuisineOptions = [
  {value: 'asian', label: 'Asian'},
  {value: 'mediterranean', label: 'Mediterranean'},
  {value: 'african', label: 'African'},
  {value: 'latin', label: 'Latin'},
  {value: 'american', label: 'American'},
];

interface OnboardingFormProps {
  setMealPlan: (mealPlan: {content: string}) => void;
}

// Functional components for each step

const WhoAreYouCookingForStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (values: string[]) => void}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (value: string) => {
    setSelected(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Who Are You Cooking For?</CardTitle>
        <CardDescription>Select all that apply.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {cookingForOptions.map(option => (
          <Button
            key={option.value}
            variant={selected.includes(option.value) ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
        <Button onClick={() => {
          onSelect(selected);
          onNext();
        }}
          disabled={selected.length === 0}
        >Next</Button>
      </CardContent>
    </Card>
  );
};

const DietTypeStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: string) => void}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diet Type</CardTitle>
        <CardDescription>Select your diet type.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {dietTypeOptions.map(option => (
          <Button
            key={option.value}
            variant={selected === option.value ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => setSelected(option.value)}
          >
            {option.label}
          </Button>
        ))}
        <Button onClick={() => {
          if (selected) {
            onSelect(selected);
            onNext();
          }
        }}
          disabled={!selected}
        >Next</Button>
      </CardContent>
    </Card>
  );
};

const FitnessGoalsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: string) => void}) => {
  const [sliderValue, setSliderValue] = useState<number[]>([50]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fitness Goals</CardTitle>
        <CardDescription>Set your fitness goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Goal Intensity:</h3>
          <div className="flex items-center space-x-4">
            <span className="w-12 text-right">Intensity:</span>
            <Slider
              defaultValue={sliderValue}
              max={100}
              min={0}
              step={1}
              onValueChange={handleSliderChange}
              className="flex-1"
            />
            <span className="w-12">{sliderValue[0]}%</span>
          </div>
        </div>
        <Button onClick={() => {
          onSelect(sliderValue.toString());
          onNext();
        }}>Next</Button>
      </CardContent>
    </Card>
  );
};

const AllergiesRestrictionsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: string[]) => void}) => {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Allergies &amp; Restrictions</CardTitle>
        <CardDescription>List any allergies or restrictions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {allergies.map(allergy => (
            <Button key={allergy} variant="secondary" onClick={() => handleRemoveAllergy(allergy)}>
              {allergy}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
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
        <Button onClick={() => {
          onSelect(allergies);
          onNext();
        }}>Next</Button>
      </CardContent>
    </Card>
  );
};

const TastePreferencesCuisineStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => {
  const [spicyLevel, setSpicyLevel] = useState<number[]>([50]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const handleSpicyChange = (value: number[]) => {
    setSpicyLevel(value);
  };

  const handleCuisineSelect = (cuisine: string) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisine)) {
        return prev.filter(item => item !== cuisine);
      } else {
        return [...prev, cuisine];
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Taste Preferences &amp; Cuisine</CardTitle>
        <CardDescription>Indicate your taste preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Spicy Preference:</h3>
          <div className="flex items-center space-x-4">
            <span className="w-12 text-right">Spicy:</span>
            <Slider
              defaultValue={spicyLevel}
              max={100}
              min={0}
              step={1}
              onValueChange={handleSpicyChange}
              className="flex-1"
            />
            <span className="w-12">{spicyLevel[0]}%</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Cuisine Preferences:</h3>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map(cuisine => (
              <Button
                key={cuisine.value}
                variant={selectedCuisines.includes(cuisine.value) ? 'default' : 'outline'}
                onClick={() => handleCuisineSelect(cuisine.value)}
              >
                {cuisine.label}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={() => {
          onSelect({spicy: spicyLevel[0], cuisines: selectedCuisines});
          onNext();
        }}>Next</Button>
      </CardContent>
    </Card>
  );
};

const CookingHabitsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => {
  const [cookEveryday, setCookEveryday] = useState(false);
  const [mealPrep, setMealPrep] = useState(false);
  const [fastMeals, setFastMeals] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cooking Habits</CardTitle>
        <CardDescription>Share your cooking habits.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={cookEveryday}
              onChange={() => setCookEveryday(!cookEveryday)}
              className="h-5 w-5"
            />
            <span>I like to cook every day</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={mealPrep}
              onChange={() => setMealPrep(!mealPrep)}
              className="h-5 w-5"
            />
            <span>I want to meal prep once or twice a week</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={fastMeals}
              onChange={() => setFastMeals(!fastMeals)}
              className="h-5 w-5"
            />
            <span>I prefer 15-minute meals</span>
          </label>
        </div>
        <Button onClick={() => {
          onSelect({cookEveryday, mealPrep, fastMeals});
          onNext();
        }}>Next</Button>
      </CardContent>
    </Card>
  );
};

const ScheduleActivitySyncStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => {
  const [appleHealth, setAppleHealth] = useState(false);
  const [fastingWindow, setFastingWindow] = useState('12:12');
  const [workoutSchedule, setWorkoutSchedule] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule &amp; Activity Sync</CardTitle>
        <CardDescription>Sync your schedule and activity data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={appleHealth}
              onChange={() => setAppleHealth(!appleHealth)}
              className="h-5 w-5"
            />
            <span>Connect Apple Health</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={workoutSchedule}
              onChange={() => setWorkoutSchedule(!workoutSchedule)}
              className="h-5 w-5"
            />
            <span>Plan meals around my workout schedule</span>
          </label>
        </div>
        <Button onClick={() => {
          onSelect({appleHealth, fastingWindow, workoutSchedule});
          onNext();
        }}>Generate Meal Plan</Button>
      </CardContent>
    </Card>
  );
};

export const OnboardingForm: React.FC<OnboardingFormProps> = ({setMealPlan}) => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

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
          <WhoAreYouCookingForStep
            onNext={nextStep}
            onSelect={(values) => handleDataCapture({cookingFor: values})}
          />
        );
      case 2:
        return (
          <DietTypeStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({dietType: value})}
          />
        );
      case 3:
        return (
          <FitnessGoalsStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({fitnessGoals: value})}
          />
        );
      case 4:
        return (
          <AllergiesRestrictionsStep
            onNext={nextStep}
            onSelect={(value) => handleDataCapture({allergies: value})}
          />
        );
      case 5:
        return (
          <TastePreferencesCuisineStep
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
          <ScheduleActivitySyncStep
            onNext={() => {
              console.log('Final Onboarding Data:', onboardingData);
              setMealPlan({content: 'Generated Meal Plan Content'});
            }}
            onSelect={(value) => handleDataCapture({scheduleSync: value})}
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

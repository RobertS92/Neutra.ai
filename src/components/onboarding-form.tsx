'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Icons} from '@/components/icons';
import {useState} from 'react';

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

const FitnessGoalsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: string) => void}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Fitness Goals</CardTitle>
      <CardDescription>Set your fitness goals.</CardDescription>
    </CardHeader>
    <CardContent>
      <Button onClick={onNext}>Next</Button>
    </CardContent>
  </Card>
);

const AllergiesRestrictionsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: string[]) => void}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Allergies &amp; Restrictions</CardTitle>
      <CardDescription>List any allergies or restrictions.</CardDescription>
    </CardHeader>
    <CardContent>
      <Button onClick={onNext}>Next</Button>
    </CardContent>
  </Card>
);

const TastePreferencesCuisineStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Taste Preferences &amp; Cuisine</CardTitle>
      <CardDescription>Indicate your taste preferences.</CardDescription>
    </CardHeader>
    <CardContent>
      <Button onClick={onNext}>Next</Button>
    </CardContent>
  </Card>
);

const CookingHabitsStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Cooking Habits</CardTitle>
      <CardDescription>Share your cooking habits.</CardDescription>
    </CardHeader>
    <CardContent>
      <Button onClick={onNext}>Next</Button>
    </CardContent>
  </Card>
);

const ScheduleActivitySyncStep = ({onNext, onSelect}: {onNext: () => void; onSelect: (value: any) => void}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Schedule &amp; Activity Sync</CardTitle>
      <CardDescription>Sync your schedule and activity data.</CardDescription>
    </CardHeader>
    <CardContent>
      <Button onClick={onNext}>Generate Meal Plan</Button>
    </CardContent>
  </Card>
);

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

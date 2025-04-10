'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export const RecipeDetailView: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Recipe Detail</CardTitle>
        <CardDescription>Detailed information about the selected recipe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>This is a placeholder for the recipe detail view.</p>
      </CardContent>
    </Card>
  );
};


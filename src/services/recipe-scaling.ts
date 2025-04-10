/**
 * Represents a list of ingredients with amounts.
 */
export interface Ingredients {
  [ingredient: string]: string;
}

/**
 * Asynchronously scales the ingredients of a recipe by a given factor.
 *
 * @param ingredients The original list of ingredients with amounts.
 * @param scaleFactor The factor by which to scale the ingredients.
 * @returns A promise that resolves to a new Ingredients object with scaled amounts.
 */
export async function scaleIngredients(
  ingredients: Ingredients,
  scaleFactor: number
): Promise<Ingredients> {
  // TODO: Implement this by calling an API.

  const scaledIngredients: Ingredients = {};
  for (const ingredient in ingredients) {
    if (ingredients.hasOwnProperty(ingredient)) {
      scaledIngredients[ingredient] = ingredients[ingredient];
    }
  }
  return scaledIngredients;
}

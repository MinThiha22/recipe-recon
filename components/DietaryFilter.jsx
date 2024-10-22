// DietaryFilter.js

// Array of poultry (birds)
const poultryKeywords = [
  "chicken",
  "turkey",
  "duck",
  "goose",
  "quail",
  "pheasant",
];

// Array of red meats
const redMeatKeywords = [
  "beef",
  "veal",
  "lamb",
  "mutton",
  "goat",
  "venison",
  "bison",
  "elk",
  "rabbit",
  "kangaroo",
];

// Array of pork-related meats
const porkKeywords = ["pork", "ham", "bacon", "prosciutto"];

// Array of game meats
const gameMeatKeywords = ["wild boar", "partridge", "ostrich", "hare", "moose"];

// Array of processed meats
const processedMeatKeywords = [
  "sausage",
  "hot dog",
  "pepperoni",
  "salami",
  "chorizo",
  "bologna",
];

// Array of fish
const fishKeywords = [
  "salmon",
  "tuna",
  "cod",
  "haddock",
  "halibut",
  "mackerel",
  "trout",
  "swordfish",
  "sea bass",
  "sardines",
  "anchovies",
  "snapper",
  "grouper",
  "tilapia",
];

// Array of shellfish
const shellfishKeywords = [
  "shrimp",
  "prawns",
  "crab",
  "lobster",
  "mussels",
  "clams",
  "oysters",
  "scallops",
];

// Array of other seafood and cephalopods
const otherSeafoodKeywords = [
  "squid",
  "octopus",
  "cuttlefish",
  "eel",
  "sea urchin",
  "crawfish",
  "abalone",
  "whelk",
];

// Array of dairy and egg products (for vegan filter)
const dairyAndEggKeywords = [
  "milk",
  "cheese",
  "butter",
  "cream",
  "yogurt",
  "egg",
  "eggs",
  "honey",
  "gelatin",
];

// Combined array of all non-vegetarian keywords
const nonVegetarianKeywords = [
  ...poultryKeywords,
  ...redMeatKeywords,
  ...porkKeywords,
  ...gameMeatKeywords,
  ...processedMeatKeywords,
  ...fishKeywords,
  ...shellfishKeywords,
  ...otherSeafoodKeywords,
];

// UPDATED: Combined function to check for both vegetarian and vegan filters
export const isRecipeDietaryCompliant = (recipe, isVeganFilter) => {
  const title = recipe.title.toLowerCase();

  // UPDATED: Safely handle undefined ingredients by providing empty arrays
  const ingredients = (recipe.missedIngredients || [])
    .concat(recipe.usedIngredients || [])
    .map((ingredient) => ingredient.name.toLowerCase());

  // Check for non-vegetarian ingredients
  const containsMeatOrFish = nonVegetarianKeywords.some(
    (keyword) =>
      title.includes(keyword) ||
      ingredients.some((ingredient) => ingredient.includes(keyword))
  );

  // If Vegan filter is applied, also check for non-vegan ingredients
  const containsDairyOrEgg = dairyAndEggKeywords.some(
    (keyword) =>
      title.includes(keyword) ||
      ingredients.some((ingredient) => ingredient.includes(keyword))
  );

  // If applying Vegan filter, ensure that both non-vegetarian and non-vegan ingredients are not present
  if (isVeganFilter) {
    return !containsMeatOrFish && !containsDairyOrEgg;
  }

  // For Vegetarian filter, just ensure no meat or fish is present
  return !containsMeatOrFish;
};

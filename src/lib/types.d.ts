type FoodItem = {
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  portion_weight: number;
  barcode: string;
  edit_locked: boolean;
  creator_id: number;
};

type Food = {
  type: string;
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  portion_weight: number;
  barcode: string;
  edit_locked: boolean;
  creator_id: number;
};

type Ingredient = {
  food_item_id: number;
  amount: number;
  food_collection_id: number;
  food_item: FoodItem;
};

type FoodCollection = {
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  portion_weight: number;
  edit_locked: boolean;
  creator_id: number;
  ingredients: Ingredient[];
};

type Meal = {
  id: number;
  food_amount: number;
  calories: number;
  food_item_id: number;
  food_collection_id: number;
  created_at: Date;
  food_item: FoodItem;
  food_collection: FoodCollection;
  mealtime_id: number;
};

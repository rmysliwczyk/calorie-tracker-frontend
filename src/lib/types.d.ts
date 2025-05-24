type FoodItem = {
	id: number | undefined,
	name: string | undefined,
	calories: number | undefined,
	fats: number | undefined,
	carbs: number | undefined,
	protein: number | undefined,
	portion_weight: number | undefined,
	barcode: string | undefined,
	is_locked?: boolean | undefined,
	creator_id?: number | undefined
}

type Food = {
	type: string | undefined,
	id: number | undefined,
	name: string | undefined,
	calories: number | undefined,
	fats: number | undefined,
	carbs: number | undefined,
	protein: number | undefined,
	portion_weight: number | undefined,
	barcode: string | undefined,
	is_locked?: boolean | undefined,
	creator_id?: number | undefined
}

type Ingredient = {
	food_item_id: number,
	amount: number,
    food_collection_id?: number,
    food_item?: FoodItem
}

type FoodCollection = {
	id?: number | undefined,
	name: string | undefined,
	calories: number | undefined,
	fats: number | undefined,
	carbs: number | undefined,
	protein: number | undefined,
	portion_weight: number | undefined,
	barcode?: string | undefined,
	is_locked?: boolean | undefined,
	creator_id?: number | undefined
	ingredients: Ingredient[] | undefined
}

type Meal = {
	id?: number | undefined,
	food_amount: number | undefined,
	calories: number | undefined,
	food_item_id?: number | undefined,
	food_collection_id?: number | undefined,
	created_at: Date | undefined,
	food_item?: FoodItem | undefined,
	food_collection?: FoodCollection | undefined,
	mealtime_id?: number | undefined
}
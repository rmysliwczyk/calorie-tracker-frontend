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
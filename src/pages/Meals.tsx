import { useNavigate } from "react-router";
import FoodList from "../components/FoodList";
import MealsList from "../components/MealsList";

export default function Meals() {
  const navigate = useNavigate();
  function handleSelectMeal(selectedMealId: number) {
      navigate(`/meals/${selectedMealId}`);
  }

  return <MealsList onSelectMeal={handleSelectMeal} />;
}

import { useNavigate } from "react-router";
import FoodItemsList from "../components/FoodItemsList";

export default function FoodItems() {
  const navigate = useNavigate();
  function handleSelectFoodItem(selectedFoodItemId: Number) {
    navigate(`/fooditems/${selectedFoodItemId}`);
  }

  return <FoodItemsList onSelectProduct={handleSelectFoodItem} />;
}

import { useNavigate } from "react-router";
import FoodList from "../components/FoodList";

export default function FoodItems() {
  const navigate = useNavigate();
  function handleSelectFoodItem(selectedFoodItemId: Number) {
    navigate(`/fooditems/${selectedFoodItemId}`);
  }

  return <FoodList onSelectProduct={handleSelectFoodItem} />;
}

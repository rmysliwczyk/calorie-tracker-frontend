import { useNavigate } from "react-router";
import FoodList from "../components/FoodList";

export default function Food() {
  const navigate = useNavigate();
  function handleSelectFoodItem(selectedFoodId: number) {
    navigate(`/fooditems/${selectedFoodId}`);
  }

  return <FoodList foodItemsOnly={false} allowAdd={true} onSelectProduct={handleSelectFoodItem} />;
}

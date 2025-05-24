import { useNavigate } from "react-router";
import FoodList from "../components/FoodList";

export default function FoodItems() {
  const navigate = useNavigate();
  function handleSelectFoodItem(selectedFoodId: number, selectedFoodType: string) {

    if(selectedFoodType === "item") {
      navigate(`/fooditems/${selectedFoodId}`);
    } else if (selectedFoodType === "collection") {
      navigate(`/foodcollections/${selectedFoodId}`);
    } else {
      console.error(new Error("Somehow, selected food was neither item nor collection."));
    }
  }

  return <FoodList foodItemsOnly={false} allowAdd={true} onSelectProduct={handleSelectFoodItem} />;
}

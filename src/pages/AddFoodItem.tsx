import { useNavigate } from "react-router";
import FoodItemForm from "../components/FoodItemForm";
import usePost from "../hooks/usePost";

export default function AddFoodItem() {
  const navigate = useNavigate();
  const { post, error: postError} = usePost();
  function handleSubmit(formData: FoodItem) {
    post("/fooditems", formData);
    navigate("/fooditems");
  }

  return <FoodItemForm onSubmit={handleSubmit} buttonText="Add food item" responseError={postError} />;
}

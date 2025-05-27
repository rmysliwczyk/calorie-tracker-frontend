import { useNavigate } from "react-router";
import FoodItemForm from "../components/FoodItemForm";
import usePost from "../hooks/usePost";
import { useEffect } from "react";

export default function AddFoodItem() {
  const navigate = useNavigate();
  const { post, error: postError, data } = usePost();

  function handleSubmit(formData: FoodItem) {
    post("/fooditems", formData);
  }

  useEffect(
    function () {
      // If there was data received in response, we succesfully added the product and can navigate away
      if (data) {
        navigate("/food");
      }
    },
    [data]
  );

  return (
    <FoodItemForm onSubmit={handleSubmit} buttonText="Add food item" responseError={postError} />
  );
}

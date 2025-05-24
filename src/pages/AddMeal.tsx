import { useNavigate } from "react-router";
import FoodItemForm from "../components/FoodItemForm";
import usePost from "../hooks/usePost";
import { useEffect } from "react";
import MealForm from "../components/MealForm";
import type { SubmitHandler } from "react-hook-form";
import useFetch from "../hooks/useFetch";

interface IMealFormInput {
  calories: number;
  food_amount: number;
  food_item_id: number;
  food_collection_id: number;
  mealtime_id: number;
}


export default function AddMeal() {
  const navigate = useNavigate();
  const {data: foodData, loading} = useFetch<Food>("/fooditems/1");
  const { post, error: postError, data } = usePost();

  function handleSubmit(data: IMealFormInput) {
    post("/meals", data);
  }

  useEffect(
    function () {
      // If there was data received in response, we succesfully added the product and can navigate away
      if (data) {
        navigate("/meals");
      }
    },
    [data]
  );

  if (foodData)
  return (
    <MealForm onSubmit={handleSubmit} food_data={foodData} buttonText="Add meal" responseError={postError} />
  );
}

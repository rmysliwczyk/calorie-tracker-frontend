import { useLocation, useNavigate } from "react-router";
import usePost from "../hooks/usePost";
import { useEffect, useState } from "react";
import MealForm from "../components/MealForm";
import useFetch from "../hooks/useFetch";
import FoodList from "../components/FoodList";
import dayjs from "dayjs";
import {type MealFormSchema } from "../components/MealForm";

export default function AddMeal() {
  const {state} = useLocation();
  if(state) {
    var {selectedDate}:{selectedDate: string} = state;
    var {mealtime_id}:{mealtime_id: number} = state;
  }
  else {
    var selectedDate = dayjs().format("YYYY-MM-DD")
    var mealtime_id = 1;
  }
  const [isSelectingFood, setIsSelectingFood] = useState<boolean>(true);
  const [searchUrl, setSearchUrl] = useState<string>("")

  const navigate = useNavigate();

  const {data: foodData} = useFetch<Food>(searchUrl);
  const { post, error: postError, data } = usePost();

  function handleSubmit(data: MealFormSchema) {
    post("/meals/", data);
  }

  function handleSelectProduct(id: number) {
    setSearchUrl(`/fooditems/${id}`);
    setIsSelectingFood(false);
  }

  useEffect(
    function () {
      // If there was data received in response, we succesfully added the product and can navigate away
      if (data) {
        navigate("/meals", {state: {selectedDate: selectedDate}});
      }
    },
    [data]
  );

  if (isSelectingFood) {
    return <FoodList allowAdd={false} onSelectProduct={handleSelectProduct} foodItemsOnly={false}/>
  }

  if (foodData) {
    return (
      <MealForm onSubmit={handleSubmit} created_at={selectedDate} mealtime_id={mealtime_id} food_data={{...foodData}} buttonText="Add meal" responseError={postError} />
    );
  }
}

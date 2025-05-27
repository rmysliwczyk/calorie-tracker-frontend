import { useNavigate, useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import MealForm, { type MealFormSchema } from "../components/MealForm";
import dayjs from "dayjs";
import usePatch from "../hooks/usePatch";
import { Alert, CircularProgress } from "@mui/material";

export default function Meal() {
  const params = useParams();
  const navigate = useNavigate();
  const { patch, error: mealPostError } = usePatch<Meal>();
  const {
    data: mealData,
    error: mealFetchError,
    loading: mealLoading,
  } = useFetch<Meal>(`/meals/${params.mealId}`);
  async function handleSubmit(updatedMealData: MealFormSchema) {
    const responseData = await patch(`/meals/${params.mealId}`, updatedMealData);
    if (responseData) {
      navigate("/meals");
    }
  }

  return mealPostError ? (
    <Alert severity="error">Couldn't update meals data. Error: {mealPostError}</Alert>
  ) : mealFetchError ? (
    <Alert severity="error">Couldn't load meals data. Error: {mealFetchError}</Alert>
  ) : mealLoading ? (
    <CircularProgress />
  ) : (
    mealData && (
      <MealForm
        buttonText="Update meal"
        onSubmit={handleSubmit}
        food_data={
          mealData.food_collection_id === null
            ? { ...mealData.food_item, type: "item" }
            : { ...mealData.food_collection, type: "collection" }
        }
        created_at={dayjs(mealData.created_at).format("YYYY-MM-DD")}
      />
    )
  );
}

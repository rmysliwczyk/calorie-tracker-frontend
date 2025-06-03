import { useNavigate } from "react-router";
import usePost from "../hooks/usePost";
import { useEffect } from "react";
import FoodCollectionForm, { type FoodCollectionFormSchema } from "../components/FoodCollectionForm";

export default function AddFoodCollection() {
  const navigate = useNavigate();
  const { post, error: postError, data } = usePost();

  function handleSubmit(formData: FoodCollectionFormSchema) {
    post("/foodcollections/", formData);
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
    <FoodCollectionForm onSubmit={handleSubmit} buttonText="Add recipe" responseError={postError} />
  );
}

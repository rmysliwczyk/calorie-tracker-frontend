import { useParams } from "react-router";
import { useState } from "react";
import { Alert, CircularProgress, Grid } from "@mui/material";
import { useAuth } from "../context/authContext";
import useFetch from "../hooks/useFetch";
import useDelete from "../hooks/useDelete";
import usePatch from "../hooks/usePatch";
import { useNavigate } from "react-router";
import Todo from "./Todo";
import FoodCollectionInfo from "../components/FoodCollectionInfo";
import FoodCollectionForm, {
  type FoodCollectionFormSchema,
} from "../components/FoodCollectionForm";

export default function FoodCollection() {
  const params = useParams();

  const {
    data: fetchData,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useFetch<FoodCollection>(`/foodcollections/${params.foodcollection_id}`);
  const { deletereq, error: errorDelete } = useDelete();
  const { patch, error: errorPatch } = usePatch();
  const [editMode, setEditMode] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  function editModeToggle() {
    setEditMode((prevState) => !prevState);
  }

  async function handleDelete() {
    try {
      const result = await deletereq(`/foodcollections/${params.foodcollection_id}`);
      console.log("Deleted:", result);
      navigate("/food");
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  async function handleEdit(formData: FoodCollectionFormSchema) {
    try {
      await patch(`/foodcollections/${params.foodcollection_id}`, formData);
      refetch();
      editModeToggle();
      return true;
    } catch (err) {
      console.error("Failed to post:", err);
    }
  }

  if (fetchLoading)
    return (
      <>
        <CircularProgress />
      </>
    );
  if (fetchError || errorDelete)
    return (
      <Alert severity="error">
        Error: {fetchError} {errorDelete}
      </Alert>
    );

  if (fetchData) {
    return (
      <Grid>
        {editMode ? (
          <FoodCollectionForm
            buttonText={"UPDATE RECIPE"}
            onSubmit={handleEdit}
            initialData={fetchData}
            responseError={errorPatch}
          />
        ) : fetchData.creator_id === auth.userId || auth.isAdmin ? (
          <FoodCollectionInfo data={fetchData} onDelete={handleDelete} onEdit={editModeToggle} />
        ) : (
          <FoodCollectionInfo data={fetchData} />
        )}
      </Grid>
    );
  }
}

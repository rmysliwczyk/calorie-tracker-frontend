import { useParams } from "react-router";
import { useState } from "react";
import { Alert, CircularProgress, Grid } from "@mui/material";
import { useAuth } from "../context/authContext";
import useFetch from "../hooks/useFetch";
import useDelete from "../hooks/useDelete";
import usePatch from "../hooks/usePatch";
import { useNavigate } from "react-router";
import FoodItemForm from "../components/FoodItemForm";
import FoodItemInfo from "../components/FoodItemInfo";

export default function FoodItem() {
  const params = useParams();

  const {
    data: fetchData,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useFetch<FoodItem>(`/fooditems/${params.fooditem_id}`);
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
      const result = await deletereq(`/fooditems/${params.fooditem_id}`);
      console.log("Deleted:", result);
      navigate("/fooditems");
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  async function handleEdit(formData: FoodItem) {
    try {
      await patch(`/fooditems/${params.fooditem_id}`, formData);
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
          <FoodItemForm
            buttonText={"Update Product"}
            onSubmit={handleEdit}
            initialData={fetchData}
            responseError={errorPatch}
          />
        ) : fetchData.creator_id === auth.userId || auth.isAdmin ? (
          <FoodItemInfo data={fetchData} onDelete={handleDelete} onEdit={editModeToggle} />
        ) : (
          <FoodItemInfo data={fetchData} />
        )}
      </Grid>
    );
  }
}

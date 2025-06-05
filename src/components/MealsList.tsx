import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, Divider, Grid, Typography } from "@mui/material";

type MealsListProps = {
  onSelectMeal(selectedId: number): void;
  onDeleteMeal(selectedId: number): void;
  selectMultiple: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectedMultiple(selectedIds: number[]): void;
  data: Meal[] | null;
};

export default function MealsList(props: MealsListProps) {
  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, mealId: number) {
    const isChecked = event.target.checked;
    props.setSelectedIds((selectedIds) =>
      isChecked
      ? [...selectedIds, mealId] // add if checked
      : selectedIds.filter((id) => id !== mealId) // remove if unchecked
    );
  } 

  return (
    <>
      {props.data?.map(function (element) {
        return (
          <Grid
            container
            key={element.id}
            direction={"row"}
            justifyContent={"centered"}
            alignItems={"center"}
            sx={{height: "70px"}}
          >
            <Grid size={11} container sx={{alignItems: "center", justifyItems: "center"}} onClick={function() { props.onSelectMeal(element.id) }}>
              <Grid size={4}>
                {element.food_item?.name || element.food_collection?.name}{" "}
              </Grid>
              <Grid size={4}>
                <Typography variant="caption">{element.food_amount} g</Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="caption">{element.calories} kcal</Typography>
              </Grid>
            </Grid>
            <Grid size={1}>
              {props.selectMultiple ? 
              <Checkbox onChange={function(event) {handleSelect(event, element.id)}} />:
              <DeleteIcon onClick={function(){props.onDeleteMeal(element.id)}} />
              }
            </Grid>
            <Grid size={12}>
              <Divider component="div" sx={{ margin: "auto", maxWidth: "450px" }} />
            </Grid>
          </Grid>
        );
      })}
    </>
  );
}

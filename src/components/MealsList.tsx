import DeleteIcon from "@mui/icons-material/Delete";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { Mealtime } from "../pages/Meals";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useEffect } from "react";

type MealsListProps = {
  onSelectMeal(selectedId: number): void;
  onDeleteMeal(selectedId: number): void;
  onAddMeal(mealId: number): void;
  selectMultiple: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onSelectedMultiple(selectedIds: number[]): void;
  data: Meal[] | null;
  mealtimes: Mealtime[];
};

export default function MealsList(props: MealsListProps) {
  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, mealId: number) {
    const isChecked = event.target.checked;
    props.setSelectedIds(
      (selectedIds) =>
        isChecked
          ? [...selectedIds, mealId] // add if checked
          : selectedIds.filter((id) => id !== mealId) // remove if unchecked
    );
  }

  useEffect(
    function () {
      props.mealtimes.forEach(function(mealtime) {mealtime.calories = 0});
      props.data?.forEach(function (meal) {
        props.mealtimes.forEach(function (mealtime) {
          if (meal.mealtime_id == mealtime.mealtime_id) {
            mealtime.calories += Number(meal.calories);
          }
        });
      });
    },
    [props.data]
  );

  return (
    <>
      {props.mealtimes.map(function (mealtime) {
        return (
          <Accordion key={mealtime.mealtime_id}>
            <AccordionSummary>
              <Stack
                direction={"row"}
                sx={{ alignItems: "center", justifyContent: "space-between", width: "100%" }}
                spacing={3}
              >
                <AddBoxIcon
                  fontSize={"large"}
                  color={"primary"}
                  onClick={function (event) {
                    event.stopPropagation();
                    props.onAddMeal(mealtime.mealtime_id);
                  }}
                />
                <Typography>{mealtime.mealtime_name}</Typography>
                <Typography variant={"caption"}>
                  {mealtime.calories.toFixed(2) || 0} kcal
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {props.data?.map(function (element) {
                if (element.mealtime_id != mealtime.mealtime_id) {
                  return null;
                } else {
                  return (
                    <Grid
                      container
                      key={element.id}
                      direction={"row"}
                      justifyContent={"centered"}
                      alignItems={"center"}
                    >
                      <Grid
                        size={11}
                        container
                        sx={{
                          alignItems: "center",
                          justifyItems: "center",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                        onClick={function () {
                          props.onSelectMeal(element.id);
                        }}
                      >
                        <Grid size={9}>
                          {element.food_item?.name || element.food_collection?.name}{" "}
                        </Grid>
                        <Grid size={1}>
                          <Typography variant="caption">{element.food_amount} g</Typography>
                        </Grid>
                        <Grid size={2}>
                          <Typography variant="caption">{element.calories} kcal</Typography>
                        </Grid>
                      </Grid>
                      <Grid size={1}>
                        {props.selectMultiple ? (
                          <Checkbox
                            onChange={function (event) {
                              handleSelect(event, element.id);
                            }}
                          />
                        ) : (
                          <DeleteIcon
                            onClick={function () {
                              props.onDeleteMeal(element.id);
                            }}
                          />
                        )}
                      </Grid>
                      <Grid size={12}>
                        <Divider component="div" sx={{ margin: "auto", maxWidth: "450px" }} />
                      </Grid>
                    </Grid>
                  );
                }
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
}

// {props.data?.map(function (element) {
//   return (
//     <Grid
//       container
//       key={element.id}
//       direction={"row"}
//       justifyContent={"centered"}
//       alignItems={"center"}
//       sx={{height: "70px"}}
//     >
//       <Grid size={11} container sx={{alignItems: "center", justifyItems: "center"}} onClick={function() { props.onSelectMeal(element.id) }}>
//         <Grid size={4}>
//           {element.food_item?.name || element.food_collection?.name}{" "}
//         </Grid>
//         <Grid size={4}>
//           <Typography variant="caption">{element.food_amount} g</Typography>
//         </Grid>
//         <Grid size={4}>
//           <Typography variant="caption">{element.calories} kcal</Typography>
//         </Grid>
//       </Grid>
//       <Grid size={1}>
//         {props.selectMultiple ?
//         <Checkbox onChange={function(event) {handleSelect(event, element.id)}} />:
//         <DeleteIcon onClick={function(){props.onDeleteMeal(element.id)}} />
//         }
//       </Grid>
//       <Grid size={12}>
//         <Divider component="div" sx={{ margin: "auto", maxWidth: "450px" }} />
//       </Grid>
//     </Grid>
//   );
// })}

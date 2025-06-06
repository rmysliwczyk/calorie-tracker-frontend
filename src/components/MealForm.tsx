import { Alert, Button, Grid, InputAdornment, TextField } from "@mui/material";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import FoodItemInfo from "./FoodItemInfo";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface MealFormProps {
  buttonText: string;
  onSubmit: SubmitHandler<MealFormSchema>;
  food_data: Food;
  initialData?: MealFormSchema;
  responseError?: string | null;
  created_at: string;
  mealtime_id?: number;
}

const mealFormSchema = z.object({
  calories: z.coerce.number({
    required_error: "Calories are required",
    invalid_type_error: "Calories must be a number",
  }).gte(0),
  food_amount: z.coerce.number({
    required_error: "Food amount is required",
    invalid_type_error: "Food amount must be a number",
  }).gte(0),
  food_item_id: z.optional(z.number()),
  food_collection_id: z.optional(z.number()),
  mealtime_id: z.number(),
  created_at: z.string(),
});

export type MealFormSchema = z.infer<typeof mealFormSchema>;

export default function MealForm(props: MealFormProps) {
  const {
    control,
    trigger,
    handleSubmit,
    watch,
    setValue,
    unregister,
    formState: { errors },
  } = useForm<MealFormSchema>({
    defaultValues: {
      calories: props.initialData?.calories || ("" as unknown as number),
      food_amount: props.initialData?.food_amount || ("" as unknown as number),
      food_item_id: props.food_data.id || 0,
      food_collection_id: props.food_data.id || 0,
      mealtime_id: props.mealtime_id || 1,
      created_at: props.created_at,
    },
    resolver: zodResolver(mealFormSchema),
  });

  const activeField = useRef<"food_amount" | "calories" | null>(null);

  const food_amount = watch("food_amount");
  const calories = watch("calories");

  useEffect(function () {
    if (props.food_data.type === "item") unregister("food_collection_id");
    else unregister("food_item_id");
  }, []);

  useEffect(
    function () {
      if (activeField.current === "food_amount") {
        let value = Number(((food_amount / 100) * props.food_data.calories).toFixed(2));
        if(!isFinite(value)) {
          value = 0;
        }
        setValue("calories", isNaN(value) ? 0 : Number(value));
        trigger();
      }
    },
    [food_amount]
  );

  useEffect(
    function () {
      if (activeField.current === "calories") {
        let value = Number(((calories / props.food_data.calories) * 100).toFixed(2));
        if(!isFinite(value)) {
          value = 0;
        }
        setValue("food_amount", isNaN(value) ? 0 : Number(value));
        trigger();
      }
    },
    [calories]
  );

  return (
    <Grid
      container
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(props.onSubmit)}
      sx={{ display: "flex", alignItems: "center" }}
      spacing={2}
    >
      {props.responseError && (
        <Grid size={12}>
          <Alert severity="error">{props.responseError}</Alert>
        </Grid>
      )}
      <Grid size={12}>
        <FoodItemInfo data={props.food_data as FoodItem} />
      </Grid>
      <Grid size={6}>
        <Controller
          name="calories"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Meal calories"
              onFocus={function () {
                activeField.current = "calories";
              }}
              fullWidth
              error={Boolean(errors.calories)}
              helperText={errors.calories?.message}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                },
                input: {
                  endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                },
              }}
            />
          )}
        />
      </Grid>
      <Grid size={6}>
        <Controller
          name="food_amount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Food amount"
              error={Boolean(errors.food_amount)}
              helperText={errors.food_amount?.message}
              onFocus={function () {
                activeField.current = "food_amount";
              }}
              fullWidth
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                },
                input: {
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                },
              }}
            />
          )}
        />
      </Grid>
      <Grid size={12}>
        <Button type="submit" sx={{ height: "50px" }} fullWidth variant="contained">
          {props.buttonText}
        </Button>
      </Grid>
    </Grid>
  );
}

import { Alert, Button, Grid, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FoodList from "./FoodList";
import useFetch from "../hooks/useFetch";
import { Decimal } from "decimal.js";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FoodCollectionFormProps {
  buttonText: string;
  onSubmit: SubmitHandler<FoodCollectionFormSchema>;
  initialData?: FoodCollection;
  responseError?: string | null;
}

const ingredientSchema = z.object({
  food_item_id: z.number(),
  food_item: z.any(),
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .gte(0.1),
});

const foodCollectionFormSchema = z.object({
  name: z.string(),
  calories: z.number().gte(0.1),
  fats: z.number().gte(0.1),
  carbs: z.number().gte(0.1),
  protein: z.number().gte(0.1),
  portion_weight: z.coerce.number().nonnegative(),
  ingredients: z.array(ingredientSchema).min(1, { message: "At least one ingredient is required" }),
});

export type FoodCollectionFormSchema = z.infer<typeof foodCollectionFormSchema>;

export default function FoodCollectionForm(props: FoodCollectionFormProps) {
  const [isSelectingFood, setIsSelectingFood] = useState(false);
  const [searchUrl, setSearchUrl] = useState("");
  const { data: foodData, error: foodFetchError } = useFetch<FoodItem>(searchUrl);
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FoodCollectionFormSchema>({
    defaultValues: {
      name: props.initialData?.name || "",
      calories: props.initialData?.calories || 0,
      fats: props.initialData?.fats || 0,
      carbs: props.initialData?.carbs || 0,
      protein: props.initialData?.protein || 0,
      portion_weight: props.initialData?.portion_weight || ("" as unknown as number),
      ingredients: props.initialData?.ingredients || [],
    },
    resolver: zodResolver(foodCollectionFormSchema),
  });

  async function handleSelectFoodItem(selectedFoodItemId: number) {
    setSearchUrl(`/fooditems/${selectedFoodItemId}`);
    setIsSelectingFood(false);
  }

  useEffect(
    function () {
      if (foodData) {
        const prev = getValues("ingredients") as Ingredient[];
        const exists = prev.some((ingredient) => ingredient.food_item_id === foodData.id);
        if (!exists) {
          setValue("ingredients", [
            ...prev,
            {
              food_item_id: foodData.id,
              food_item: foodData,
              amount: 1,
            },
          ]);
        }
      }
    },
    [foodData]
  );

  const ingredients = useWatch({ control, name: "ingredients" });

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) return;

    let nutritionalValues = {
      calories: new Decimal(0),
      fats: new Decimal(0),
      carbs: new Decimal(0),
      protein: new Decimal(0),
      total_weight: new Decimal(0),
    };

    for (const ingredient of ingredients) {
      const amount = new Decimal(ingredient.amount || 0);
      const multiplier = amount.div(100);

      nutritionalValues.calories = nutritionalValues.calories.plus(
        multiplier.times(ingredient.food_item?.calories || 0)
      );
      nutritionalValues.fats = nutritionalValues.fats.plus(
        multiplier.times(ingredient.food_item?.fats || 0)
      );
      nutritionalValues.carbs = nutritionalValues.carbs.plus(
        multiplier.times(ingredient.food_item?.carbs || 0)
      );
      nutritionalValues.protein = nutritionalValues.protein.plus(
        multiplier.times(ingredient.food_item?.protein || 0)
      );
      nutritionalValues.total_weight = nutritionalValues.total_weight.plus(amount);
    }

    const totalWeight = nutritionalValues.total_weight.gt(0)
      ? nutritionalValues.total_weight
      : new Decimal(1);

    function round(val: Decimal) {
      return Number(val.toFixed(2));
    }

    setValue("calories", round(nutritionalValues.calories.div(totalWeight).times(100)));
    setValue("fats", round(nutritionalValues.fats.div(totalWeight).times(100)));
    setValue("carbs", round(nutritionalValues.carbs.div(totalWeight).times(100)));
    setValue("protein", round(nutritionalValues.protein.div(totalWeight).times(100)));
  }, [ingredients]);

  if (!isSelectingFood) {
    return (
      <Paper elevation={3} sx={{ padding: "20px", marginInline: "10px" }}>
        <Grid
          container
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit(props.onSubmit)}
          sx={{ display: "flex", alignItems: "center" }}
          spacing={2}
        >
          <Grid size={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  label="Name"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="calories"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  error={Boolean(errors.calories)}
                  helperText={errors.calories?.message}
                  label="Calories"
                  variant="outlined"
                  fullWidth
                  slotProps={{
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
              name="portion_weight"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.portion_weight)}
                  helperText={errors.portion_weight?.message}
                  label="Portion weight"
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name="fats"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  error={Boolean(errors.fats)}
                  helperText={errors.fats?.message}
                  label="Fat"
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name="carbs"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  error={Boolean(errors.carbs)}
                  helperText={errors.carbs?.message}
                  label="Carbs"
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name="protein"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  error={Boolean(errors.protein)}
                  helperText={errors.protein?.message}
                  label="Protein"
                  variant="outlined"
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    },
                  }}
                />
              )}
            />
          </Grid>
          {getValues("ingredients").length > 0 && (
            <Grid size={12}>
              <Button type="submit" color="primary" variant="contained">
                {props.buttonText}
              </Button>
            </Grid>
          )}
          {props.responseError && (
            <Grid size={12}>
              <Alert severity="error">{props.responseError}</Alert>
            </Grid>
          )}
          <Grid size={12}>
            <Button variant="outlined" onClick={() => setIsSelectingFood(true)}>
              Add Food Item To Recipe
            </Button>
          </Grid>
          {foodFetchError ? (
            <Grid size={12}>
              <Alert severity="error">{foodFetchError}</Alert>
            </Grid>
          ) : (
            ingredients.map((ingredient, index) => (
              <Grid container size={12} key={ingredient.food_item_id} sx={{ alignItems: "center" }}>
                <Grid size={6}>
                  <Typography variant="h6">{ingredient.food_item.name}</Typography>
                  <Typography variant="caption">
                    {ingredient.food_item.calories}kcal/100g
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Controller
                    name={`ingredients.${index}.amount`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.ingredients?.[index]?.amount)}
                        helperText={errors.ingredients?.[index]?.amount?.message}
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end">g</InputAdornment>,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
    );
  } else {
    return (
      <FoodList allowAdd={false} foodItemsOnly={true} onSelectProduct={handleSelectFoodItem} />
    );
  }
}

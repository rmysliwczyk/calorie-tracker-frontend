import {
  Alert,
  Box,
  Button,
  Card,
  ClickAwayListener,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useEffect, useState, type ChangeEvent } from "react";
import BarcodeScanner from "./BarcodeScannerCustom";
import AddIcon from "@mui/icons-material/Add";
import FoodList from "./FoodList";
import useFetch from "../hooks/useFetch";
import { data } from "react-router";
import { Decimal } from "decimal.js"; // If you want to match backend precision, otherwise use Number

interface FoodCollectionFormProps {
  buttonText: string;
  onSubmit: (formData: FoodCollection) => void;
  initialData?: FoodCollection;
  responseError?: string | null;
}

export default function FoodCollectionForm(props: FoodCollectionFormProps) {
  const [isSelectingFood, setIsSelectingFood] = useState(false);
  const [containsErrors, setContainsErrors] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const { data: foodData, error, loading } = useFetch<FoodItem>(searchUrl);

  const [inputs, setInputs] = useState<FoodCollection>({
    name: props.initialData?.name || "",
    calories: props.initialData?.calories || 0,
    fats: props.initialData?.fats || 0,
    carbs: props.initialData?.carbs || 0,
    protein: props.initialData?.protein || 0,
    portion_weight: props.initialData?.portion_weight || 0,
    barcode: props.initialData?.barcode || "",
    ingredients: props.initialData?.ingredients || [],
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const inputName = event.target.name;
    const value = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, [inputName]: value }));
  }

  function handleScannerToggle() {
    setIsScannerOpen((prevState) => !prevState);
  }

  function handleScanSuccess(decodedText: string) {
    setInputs((prevInputs) => ({ ...prevInputs, barcode: decodedText }));
    setIsScannerOpen(false);
  }

  async function handleSelectFoodItem(selectedFoodItemId: number) {
    console.log(selectedFoodItemId);
    setSearchUrl(`/fooditems/${selectedFoodItemId}`);
    setIsSelectingFood(false);
  }

  useEffect(
    function () {
      if (foodData !== null) {
        setInputs((prevState) => {
          const exists = (prevState.ingredients ?? []).some(
            (ingredient) => ingredient.food_item_id === Number(foodData.id)
          );
          if (exists) return prevState;
          return {
            ...prevState,
            ingredients: [
              ...(prevState.ingredients ?? []),
              { food_item_id: Number(foodData.id), food_item: foodData, amount: 1 },
            ],
          };
        });
      }
    },
    [foodData]
  );

  useEffect(() => {
    if (!inputs.ingredients || inputs.ingredients.length === 0) return;

    let nutritionalValues = {
      calories: new Decimal(0),
      fats: new Decimal(0),
      carbs: new Decimal(0),
      protein: new Decimal(0),
      total_weight: new Decimal(0),
    };

    for (const ingredient of inputs.ingredients) {
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

    setInputs((prev) => ({
      ...prev,
      calories: round(nutritionalValues.calories.div(totalWeight).times(100)),
      fats: round(nutritionalValues.fats.div(totalWeight).times(100)),
      carbs: round(nutritionalValues.carbs.div(totalWeight).times(100)),
      protein: round(nutritionalValues.protein.div(totalWeight).times(100)),
    }));
  }, [inputs.ingredients]);

  function handleIngredientAmountChange(index: number, value: number) {
    setInputs((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.map((ingredient, i) =>
        i === index ? { ...ingredient, amount: value } : ingredient
      ),
    }));
  }

  if (!isSelectingFood) {
    return (
      <Box
        component={"form"}
        onSubmit={function (event) {
          event.preventDefault();
          if (!containsErrors) {
            props.onSubmit(inputs);
          } else {
            setAlertMessage("Form contains errors");
          }
        }}
      >
        <Grid container spacing={1} component={Paper} elevation={3} sx={{ padding: "10px" }}>
          <Grid size={12} sx={{ padding: "10px" }}>
            <TextField
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              value={inputs.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={12} sx={{ padding: "10px" }}>
            <Divider variant="middle" />
          </Grid>
          <Grid container size={6} sx={{ padding: "10px" }}>
            <Grid size={12}>
              <Typography variant="h5">Calories</Typography>
            </Grid>
            <Grid size={12}>
              {inputs.calories} <Typography variant="caption">kcal/100g</Typography>
            </Grid>
          </Grid>
          <Grid container size={6} sx={{ padding: "10px" }}>
            <TextField
            type="number"
            id="portion-weight"
            name="portion_weight"
            label="Portion weight"
            variant="outlined"
            value={inputs.portion_weight}
            onChange={handleChange}
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
          />
          </Grid>
          <Grid size={12} sx={{ padding: "10px" }}>
            <Divider variant="middle" />
          </Grid>
          <Grid container size={4} sx={{ padding: "10px" }}>
            <Grid size={12}>
              <Typography variant="h5">Fat</Typography>
            </Grid>
            <Grid size={12}>
              {inputs.fats} <Typography variant="caption">g/100g</Typography>
            </Grid>
          </Grid>
          <Grid container size={4} sx={{ padding: "10px" }}>
            <Grid size={12}>
              <Typography variant="h5">Carbs</Typography>
            </Grid>
            <Grid size={12}>
              {inputs.carbs} <Typography variant="caption">g/100g</Typography>
            </Grid>
          </Grid>
          <Grid container size={4} sx={{ padding: "10px" }}>
            <Grid size={12}>
              <Typography variant="h5">Protein</Typography>
            </Grid>
            <Grid size={12}>
              {inputs.protein} <Typography variant="caption">g/100g</Typography>
            </Grid>
          </Grid>
          <Grid size={12} sx={{ padding: "10px" }}>
            <Divider variant="middle" />
          </Grid>

          <Grid
            container
            size={12}
            sx={{ padding: "10px", justifyContent: "center", alignItems: "center" }}
          >
            <Grid
              container
              component={"button"}
              direction={"column"}
              onClick={function () {
                setIsSelectingFood((prevState) => !prevState);
              }}
              spacing={0}
              size={3}
              sx={{ height: "100%" }}
            >
              <Grid size={12}>
                <AddIcon color="primary" fontSize="large" />
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" color="primary">
                  Add
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" color="primary">
                  ingredient
                </Typography>
              </Grid>
            </Grid>
            <Grid component={"button"} type="submit" size={3} sx={{ height: "100%" }}>
              <Typography variant="button" color="primary">
                {props.buttonText}
              </Typography>
            </Grid>
          </Grid>

          <Grid size={12} sx={{ padding: "10px" }}>
            <Divider variant="middle" />
          </Grid>
          {inputs.ingredients?.map((ingredient, idx) => (
            <Grid key={ingredient.food_item_id} size={12}>
              <Card variant="outlined">
                <Typography variant="h6">
                  <TextField
                    type="number"
                    value={ingredient.amount}
                    onChange={(e) =>
                      handleIngredientAmountChange(idx, Number(e.target.value))
                    }
                    sx={{ width: 80, mr: 1 }}
                  />
                  of {ingredient.food_item?.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  } else {
    return (
      <FoodList allowAdd={false} foodItemsOnly={true} onSelectProduct={handleSelectFoodItem} />
    );
  }
}

import {
  Alert,
  Button,
  ClickAwayListener,
  Grid,
  InputAdornment,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useEffect, useState, type ChangeEvent } from "react";
import BarcodeScanner from "./BarcodeScannerCustom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

interface MealFormProps {
  buttonText: string;
  onSubmit: SubmitHandler<IMealFormInput>;
  food_data: Food;
  initialData?: Meal;
  responseError?: string | null;
}

interface IMealFormInput {
  calories: number;
  food_amount: number;
  food_item_id: number;
  food_collection_id: number;
  mealtime_id: number;
}

export default function MealForm(props: MealFormProps) {
  const [containsErrors, setContainsErrors] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      calories: props.initialData?.id || 0,
      food_amount: props.initialData?.food_amount || 0,
      food_item_id: (props.food_data.type === "item" && props.food_data.id) || 0,
      food_collection_id: (props.food_data.type === "collection" && props.food_data.id ) || 0,
      mealtime_id: props.initialData?.mealtime_id || 1,
    },
  });

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
        <Grid size={6}>
          <Controller
            name="calories"
            control={control}
            render={({ field }) => (
              <TextField
                inputRef={field.ref}
                name={field.name}
                value={getValues("food_amount")}
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
            <Controller name="food_amount" control={control} 
            render={({field}) => <TextField {...field} fullWidth slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }} />}/>

        </Grid>
        </Grid>
    </Paper>
  );
}

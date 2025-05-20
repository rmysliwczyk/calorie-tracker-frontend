import { Alert, Button, ClickAwayListener, Grid, InputAdornment, Modal, Paper, TextField } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { useEffect, useState, type ChangeEvent } from "react";
import BarcodeScanner from "./BarcodeScannerCustom";

interface FoodItemFormProps {
  buttonText: string;
  onSubmit: (formData: FoodItem) => void;
  initialData?: FoodItem;
  responseError?: string | null;
}

export default function FoodItemForm(props: FoodItemFormProps) {
  const [containsErrors, setContainsErrors] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [inputs, setInputs] = useState<FoodItem>({
    id: props.initialData?.id,
    name: props.initialData?.name,
    calories: props.initialData?.calories,
    fats: props.initialData?.fats,
    carbs: props.initialData?.carbs,
    protein: props.initialData?.protein,
    portion_weight: props.initialData?.portion_weight,
    barcode: props.initialData?.barcode,
  });

  const [errors, setErrors] = useState({
    name: "",
    calories: "",
    fats: "",
    carbs: "",
    protein: "",
    portion_weight: "",
    barcode: "",
  });

  // Checking individual errors, when error object changes,
  // and setting a general error flag if there are any
  useEffect(function() {
    let hadErrors = false;
    Object.entries(errors).forEach(function(element) {
      if (element[1] !== "") {
        hadErrors = true;
      }
    })
    if(hadErrors === false) {
      setAlertMessage("");
      setContainsErrors(false);
    } else {
      setContainsErrors(true);
    }
  },[errors])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const inputName = event.target.name;
    const value = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, [inputName]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [inputName]: "" }));

    if (["calories", "fats", "carbs", "protein", "barcode", "portion_weight"].includes(inputName)) {
      if (isNaN(Number(value))) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [inputName]: "Field must be a number",
        }));
      } else if (Number(value) < 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [inputName]: "Field value must be positive",
        }));
      }
    }
  }

  function handleScannerToggle() {
    setIsScannerOpen((prevState) => !prevState);
  }

  function handleScanSuccess(decodedText: string) {
    setInputs((prevInputs) => ({ ...prevInputs, barcode: decodedText }));
    setIsScannerOpen(false);
  }

  return (
    <Paper elevation={3} sx={{ padding: "20px", marginInline: "10px" }}>
      <Grid
        container
        component="form"
        autoComplete="off"
        onSubmit={function (event) {
          event.preventDefault();
          if (!containsErrors) {
            props.onSubmit(inputs);
          } else {
            setAlertMessage("Form contains errors");
          }
        }}
        sx={{ display: "flex", alignItems: "center" }}
        spacing={2}
      >
        <Grid size={12}>
          <TextField id="name" name="name" label="Name" variant="outlined" value={inputs.name} onChange={handleChange} fullWidth />
        </Grid>
        <Grid size={6}>
          <TextField
            id="calories"
            name="calories"
            label="Calories"
            variant="outlined"
            value={inputs.calories}
            onChange={handleChange}
            error={Boolean(errors.calories)}
            helperText={errors.calories}
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
              },
            }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            id="portion-weight"
            name="portion_weight"
            label="Portion weight"
            variant="outlined"
            value={inputs.portion_weight}
            onChange={handleChange}
            error={Boolean(errors.portion_weight)}
            helperText={errors.portion_weight}
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            id="fats"
            name="fats"
            label="Fat"
            variant="outlined"
            value={inputs.fats}
            onChange={handleChange}
            error={Boolean(errors.fats)}
            helperText={errors.fats}
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            id="carbs"
            name="carbs"
            label="Carbs"
            variant="outlined"
            value={inputs.carbs}
            onChange={handleChange}
            error={Boolean(errors.carbs)}
            helperText={errors.carbs}
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            id="protein"
            name="protein"
            label="Protein"
            variant="outlined"
            value={inputs.protein}
            onChange={handleChange}
            error={Boolean(errors.protein)}
            helperText={errors.protein}
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
          />
        </Grid>
        <Grid size={8}>
          <TextField
            id="barcode"
            name="barcode"
            label="Barcode"
            variant="outlined"
            value={inputs.barcode}
            onChange={handleChange}
            error={Boolean(errors.barcode)}
            helperText={errors.barcode}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <QrCodeIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={4}>
          <Button fullWidth sx={{ height: "50px" }} variant="contained" onClick={handleScannerToggle}>
            <QrCodeIcon />
          </Button>
        </Grid>
        <Grid size={12}>
          <Button type="submit" color="primary" variant="contained">
            {props.buttonText}
          </Button>
        </Grid>
        {alertMessage && (
          <Grid size={12}>
            <Alert severity="warning">{alertMessage}</Alert>
          </Grid>
        )}
        {props.responseError && (
          <Grid size={12}>
            <Alert severity="error">{props.responseError}</Alert>
          </Grid>
        )}
      </Grid>
      <Modal open={isScannerOpen}>
        <ClickAwayListener onClickAway={handleScannerToggle}>
          <Grid container component={Paper} sx={{ padding: "10px", width: "100vw", height: "80vh", justifyContent: "center", alignItems: "center" }}>
            <BarcodeScanner qrCodeSuccessCallback={handleScanSuccess} />
          </Grid>
        </ClickAwayListener>
      </Modal>
    </Paper>
  );
}

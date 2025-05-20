import { useState, type ChangeEvent, type FormEvent } from "react";
import { Grid, Paper, TextField, InputAdornment, Button, Modal, ClickAwayListener, Box, Alert } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import BarcodeScanner from "./BarcodeScannerCustom";
import type { Html5QrcodeResult } from "html5-qrcode";
import usePost from "../hooks/usePost";
import { useNavigate } from "react-router";

type FormData = {
  name: string;
  calories: string;
  fats: string;
  carbs: string;
  protein: string;
  portion_weight: string;
  barcode: string;
};

export default function AddFoodItemForm() {
  const [inputs, setInputs] = useState<FormData>({
    name: "",
    calories: "",
    fats: "",
    carbs: "",
    protein: "",
    portion_weight: "",
    barcode: "",
  });

  const [errors, setErrors] = useState<FormData>({
    name: "",
    calories: "",
    fats: "",
    carbs: "",
    protein: "",
    portion_weight: "",
    barcode: "",
  });

  const [containsErrors, setContainsErrors] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const { post, data: postDataReceived, error: postError, loading: postLoading } = usePost();
  const navigate = useNavigate();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const inputName = event.target.name;
    const value = event.target.value;
    setInputs((prevInputs) => ({ ...prevInputs, [inputName]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [inputName]: "" }));
    setContainsErrors(false);

    if (["calories", "fats", "carbs", "protein", "barcode", "portion_weight"].includes(inputName)) {
      if (isNaN(Number(value))) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [inputName]: "Field must be a number",
        }));
        setContainsErrors(true);
      } else if (Number(value) < 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [inputName]: "Field value must be positive",
        }));
        setContainsErrors(true);
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!containsErrors) {
      post("/fooditems", inputs);
    } else {
      console.log("Form had errors");
    }
  }

  function handleScannerToggle() {
    setIsScannerOpen((prevState) => (prevState ? false : true));
  }

  function handleScanSuccess(decodedText: string, result: Html5QrcodeResult) {
    console.log(result);
    setInputs((prevInputs) => ({ ...prevInputs, barcode: decodedText }));
    setIsScannerOpen(false);
  }

  if (postDataReceived) {
    //This will have to navigate to the origin
    navigate("/fooditems", { state: { origin: "Add product" } });
  }

  return (
    <>
      <Paper elevation={3} sx={{ padding: "20px", marginInline: "10px" }}>
        <Grid container component="form" autoComplete="off" onSubmit={handleSubmit} sx={{ display: "flex", alignItems: "center" }} spacing={2}>
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
              Add product
            </Button>
          </Grid>
          <Grid size={12}>
            {postError && (
              <Box sx={{ mb: "3px" }}>
                <Alert severity="error">{postError}</Alert>
              </Box>
            )}
          </Grid>
        </Grid>
        <Modal open={isScannerOpen}>
          <ClickAwayListener onClickAway={handleScannerToggle}>
            <Grid container component={Paper} sx={{ padding: "10px", width: "100vw", height: "80vh", justifyContent: "center", alignItems: "center" }}>
              <BarcodeScanner qrCodeSuccessCallback={handleScanSuccess} />
            </Grid>
          </ClickAwayListener>
        </Modal>
      </Paper>
    </>
  );
}

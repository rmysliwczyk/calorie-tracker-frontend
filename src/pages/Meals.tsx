import { useLocation, useNavigate } from "react-router";
import MealsList from "../components/MealsList";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Alert, Button, CircularProgress, Grid } from "@mui/material";
import dayjs from "dayjs";
import ShareIcon from '@mui/icons-material/Share';
import type { Dayjs } from "dayjs";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useDelete from "../hooks/useDelete";
import { toast } from "react-toastify";
import usePatch from "../hooks/usePatch";

export default function Meals() {
  const { state } = useLocation();
  if (state) {
    var { selectedDate } = state;
  }
  const navigate = useNavigate();
  const [date, setDate] = useState<Dayjs | null>(selectedDate ? dayjs(selectedDate) : dayjs());
  const [selectMultiple, setSelectMultiple] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchUrl, setSearchUrl] = useState<string>(`/meals/?selected_date=${date?.format("YYYY-MM-DD")}`);
  const {patch, error: patchError} = usePatch()
  const { deletereq } = useDelete();
  const {
    data,
    error: fetchMealsError,
    loading: mealDataIsLoading,
    refetch,
  } = useFetch<Meal[]>(searchUrl);

  useEffect(
    function () {
      setSearchUrl(`/meals/?selected_date=${date?.format("YYYY-MM-DD")}`);
    },
    [date]
  );

  function handleSelectMeal(selectedMealId: number) {
    navigate(`/meals/${selectedMealId}`);
  }

  function handleAddMeal() {
    navigate("/meals/add", { state: { selectedDate: date?.format("YYYY-MM-DD") } });
  }

  function handleDeleteMeal(mealId: number) {
    deletereq(`/meals/${mealId}`);
    refetch();
  }

async function confirmShare() {
  let payload: any = []
  selectedIds.forEach((mealId) => payload.push({id: mealId, is_shared: true}));
  console.log(payload)
  patch(`/meals/update-many`, payload)
  const idsParam = selectedIds.join(",");
  toast.info(`Pass this link to your friend!: https://${window.location.host}/addshared?ids=${idsParam}`, {autoClose: false});
  console.log(selectedIds);
}

  return fetchMealsError ? (
    <Alert severity="error">Couldn't load meals data. Error: {fetchMealsError}</Alert>
  ) : mealDataIsLoading ? (
    <CircularProgress />
  ) : (
    <Grid container sx={{alignContent: "center", alignItems: "center", }}>
      <Grid size={11}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            value={date}
            onChange={function (newValue) {
              setDate(newValue);
            }}
            sx={{width: "80%"}}
            label="Select day"
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={1}>
        {selectMultiple ? <CheckCircleIcon onClick={confirmShare} />
          :<ShareIcon onClick={function() {setSelectMultiple((prevState) => !prevState)}}/>
        }
      </Grid>
      <Grid size={12}>
        <Button onClick={handleAddMeal}>Add meal</Button>
      </Grid>
      <Grid size={12}>
        <MealsList data={data} onDeleteMeal={handleDeleteMeal} onSelectMeal={handleSelectMeal} selectMultiple={selectMultiple} setSelectedIds={setSelectedIds} />
      </Grid>
    </Grid>
  );
}

import { useNavigate, useSearchParams } from "react-router";
import useFetch from "../hooks/useFetch";
import usePost from "../hooks/usePost";
import { useEffect, useState } from "react";
import { Alert, Button, CircularProgress, Grid } from "@mui/material";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function AddSharedMeal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get("ids");
  const idArray =
    idsParam
      ?.split(",")
      .map(Number)
      .filter((n) => !isNaN(n)) || [];

  // Build the query string for multiple ids: ?ids=1&ids=2&ids=3
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [confirmedAdd, setConfirmedAdd] = useState<boolean>(false);
  const [searchUrl, setSearchUrl] = useState(
    `/meals/?${idArray.map((id) => `ids=${id}`).join("&")}`
  );
  const { data, error: fetchError, loading: fetchLoading } = useFetch<Meal[]>(searchUrl);
  const { post, data: postData, error: postError, loading: postLoading} = usePost();

  function addSharedMeal() {
    if (data && selectedDate && !fetchError && !fetchLoading) {
      data.forEach((meal) => (meal.created_at = selectedDate.format("YYYY-MM-DD")));
      post("/meals/create-many", data);
      setConfirmedAdd(true);
    }
  }

  useEffect(() => {
    if (!postLoading && !postError && postData) {
      navigate("/meals");
    }
  }, [postData, postLoading]);

  if (fetchError || postError) {
    return <Alert severity="error">Error: {fetchError || postError}</Alert>;
  } else if (fetchLoading || postLoading) {
    return <CircularProgress/>
  } else if(!data || data.length == 0) {
    return <Alert severity="error">Couldn't get the data for shared meals. Please get a new share meal link.</Alert>;
  } else {
    return (
      <Grid container sx={{gap: "10px"}}>
        <Grid size={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              format="YYYY-MM-DD"
              value={selectedDate}
              onChange={function (newValue) {
                setSelectedDate(newValue);
              }}
              sx={{ width: "80%" }}
              label="Select day"
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={12}>
          <Button
            variant="contained"
            onClick={function () {
              addSharedMeal();
            }}
          >
            Add shared meal
          </Button>
        </Grid>
      </Grid>
    );
  }
}

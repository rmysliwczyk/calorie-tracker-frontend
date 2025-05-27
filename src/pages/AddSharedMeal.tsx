import { useNavigate, useSearchParams } from "react-router";
import useFetch from "../hooks/useFetch";
import usePost from "../hooks/usePost";
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function AddSharedMeal() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idsParam = searchParams.get('ids');
    const idArray = idsParam?.split(',').map(Number).filter(n => !isNaN(n)) || [];

    // Build the query string for multiple ids: ?ids=1&ids=2&ids=3
    const [selectedDate, setSelectedDate] = useState<Dayjs|null>(dayjs())
    const [confirmedAdd, setConfirmedAdd] = useState<boolean>(false);
    const [searchUrl, setSearchUrl] = useState(`/meals/?${idArray.map(id => `ids=${id}`).join("&")}`)
    const { data, error, loading } = useFetch<Meal[]>(searchUrl);
    const { post } = usePost();

    useEffect(() => {
        if(data && confirmedAdd == true && selectedDate) {
            data.forEach((meal) => meal.created_at = selectedDate.format("YYYY-MM-DD"))
            post("/meals/create-many", data)
            setConfirmedAdd(true)
            navigate("/meals")
        }
    }, [data, selectedDate]);

    if (confirmedAdd === false) {
        return(<>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            value={selectedDate}
            onChange={function (newValue) {
              setSelectedDate(newValue);
              setConfirmedAdd(true)
            }}
            sx={{width: "80%"}}
            label="Select day"
          />
        </LocalizationProvider>
        </>
        )
    }
    return null;
}
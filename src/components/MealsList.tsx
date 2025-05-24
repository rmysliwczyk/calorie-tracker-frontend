import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SearchInput from "./SearchInput";
import useFetch from "../hooks/useFetch";

import {
  Alert,
  Box,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Grid,
  ListItemText,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import BarcodeScanner from "./BarcodeScannerCustom";

type MealsListProps = {
  onSelectMeal(selectedId: number): void;
};

export default function MealsList(props: MealsListProps) {
  const currentDate = (new Date()).toISOString().split('T')[0];
  const navigate = useNavigate();
  const [searchUrl, setSearchUrl] = useState<string>(
    `/meals/${currentDate}`
  );
  const { data, error } = useFetch<Meal[]>(searchUrl);

  return (
    <Grid>
          <List>
            {data?.map(function (element) {
              return (
                <Box key={element.id}>
                  <ListItem
                    key={element.id}
                    onClick={function () {
                      if (element.id !== undefined) {
                        props.onSelectMeal(element.id);
                      }
                    }}
                  >
                    <ListItemText sx={{ textAlign: "center" }}>
                      <Typography variant="h5">{element.food_item?.name || element.food_collection?.name}</Typography>
                      <Typography>{element.calories} kcal</Typography>
                    </ListItemText>
                  </ListItem>
                  <Divider component="div" sx={{ margin: "auto", maxWidth: "450px" }} />
                </Box>
              );
            })}
          </List>
    </Grid>
  );
}

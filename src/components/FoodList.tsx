import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SearchInput from "./SearchInput";
import useFetch from "../hooks/useFetch";

import { Alert, Box, CircularProgress, ClickAwayListener, Divider, Grid, ListItemText, Modal, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import BarcodeScanner from "./BarcodeScannerCustom";

type FoodListProps = {
  onSelectProduct(selectedId: number): void,
  allowAdd: boolean
}

export default function FoodList(props: FoodListProps) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [searchUrl, setSearchUrl] = useState<string>(`/food/combined/?offset=0&limit=100&name=`);
  const { data, error, loading } = useFetch<FoodItem[]>(searchUrl);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  useEffect(
    function () {
      setSearchInProgress(true);
      const timeOut = setTimeout(async function () {
        setSearchUrl(`/food/combined/?offset=0&limit=100&name=${searchValue}`);
      }, 1000);

      return function () {
        clearTimeout(timeOut);
      };
    },
    [searchValue]
  );

  useEffect(
    function () {
      if (data) {
        setSearchInProgress(false);
      }
    },
    [data]
  );

  function handleSearchInputChange(enteredText: string) {
    setSearchValue(enteredText);
  }

  function handleScannerToggle() {
    setIsScannerOpen((prevState) => (prevState ? false : true));
  }

  function handleScanSuccess(decodedText: string) {
    setSearchUrl(`/food/combined/?offset=0&limit=100&barcode=${decodedText}`);
    setIsScannerOpen(false);
  }

  return (
    <Grid>
      <SearchInput
        placeholder="Enter food item name"
        inputValue={searchValue}
        onSearch={handleSearchInputChange}
        allowAdd={props.allowAdd}
        onAddNavigation={function () {
          navigate("/fooditems/add");
        }}
        onScanNavigation={handleScannerToggle}
      />
      {error ? (
        <Alert sx={{ mt: "10px" }} severity="error">
          {error}
        </Alert>
      ) : searchInProgress ? (
        <Box
          sx={{
            margin: "20px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List>
            {data?.map(function (element) {
              return (
                <Box key={element.id}>
                  <ListItem
                    key={element.id}
                    onClick={function () {
                      if (element.id !== undefined) {
                        props.onSelectProduct(element.id);
                      }
                    }}
                  >
                    <ListItemText sx={{ textAlign: "center" }}>
                      <Typography variant="h5">{element.name}</Typography>
                      <Typography>{element.calories} kcal/100g</Typography>
                    </ListItemText>
                  </ListItem>
                  <Divider component="div" sx={{ margin: "auto", maxWidth: "450px" }} />
                </Box>
              );
            })}
          </List>
          <Modal open={isScannerOpen}>
            <ClickAwayListener onClickAway={handleScannerToggle}>
              <Grid
                container
                component={Paper}
                sx={{
                  width: "100vw",
                  height: "80vh",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden"
                }}
              >
                <BarcodeScanner qrCodeSuccessCallback={handleScanSuccess} />
              </Grid>
            </ClickAwayListener>
          </Modal>
        </>
      )}
    </Grid>
  );
}

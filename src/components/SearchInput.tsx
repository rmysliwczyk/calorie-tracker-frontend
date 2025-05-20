import { Button, Grid, TextField } from "@mui/material";

export default function SearchInput({
  placeholder,
  inputValue,
  onSearch,
  onAddNavigation,
  onScanNavigation,
}: {
  placeholder: string;
  inputValue: string;
  onSearch: any;
  onAddNavigation: Function;
  onScanNavigation: Function;
}) {
  return (
    <Grid container>
      <Grid size={8}>
        <TextField
          type="text"
          id="search-input"
          placeholder={placeholder}
          value={inputValue}
          onInput={function (e) {
            onSearch((e.target as HTMLTextAreaElement).value);
          }}
        />
      </Grid>
      <Grid size={2}>
        <Button
          sx={{ height: "55px" }}
          onClick={function () {
            onAddNavigation();
          }}
        >
          Add
        </Button>
      </Grid>
      <Grid size={2}>
        <Button
          sx={{ height: "55px" }}
          onClick={function () {
            onScanNavigation();
          }}
        >
          Scan
        </Button>
      </Grid>
    </Grid>
  );
}

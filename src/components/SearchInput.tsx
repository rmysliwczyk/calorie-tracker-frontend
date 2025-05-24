import { Button, Grid, TextField } from "@mui/material";

type SearchInputProps = {
  placeholder: string,
  inputValue: string,
  onSearch(searchText: string): void,
  allowAdd: boolean,
  onAddNavigation(): void,
  onScanNavigation(): void
}

export default function SearchInput(props: SearchInputProps) {
  return (
    <Grid container>
      <Grid size={8}>
        <TextField
          type="text"
          id="search-input"
          placeholder={props.placeholder}
          value={props.inputValue}
          onInput={function (e) {
            props.onSearch((e.target as HTMLTextAreaElement).value);
          }}
        />
      </Grid>
      <Grid size={2}>
        <Button
          sx={{ height: "55px" }}
          onClick={function () {
            props.onAddNavigation();
          }}
        >
          Add
        </Button>
      </Grid>
      <Grid size={2}>
        <Button
          sx={{ height: "55px" }}
          onClick={function () {
            props.onScanNavigation();
          }}
        >
          Scan
        </Button>
      </Grid>
    </Grid>
  );
}

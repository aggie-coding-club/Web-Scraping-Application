import { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const DownloadAll = () => {
  const containerStyle = {
    display: "flex",
    gap: "10px",
  };

  const btnStyle = {
    maxWidth: "150px",
  };

  const formControlStyle = {
    minWidth: "100px",
  };
  const [downloadOption, setDownloadOption] = useState("csv");

  const handleChange = (event: SelectChangeEvent) => {
    setDownloadOption(event.target.value as string);
  };

  return (
    <div style={containerStyle}>
      <Button variant="contained" style={btnStyle}>
        Download All
      </Button>
      <FormControl variant="standard" style={formControlStyle}>
        <Select
          labelId="download-option-label"
          value={downloadOption}
          onChange={handleChange}
        >
          <MenuItem value={"csv"}>.csv</MenuItem>
          <MenuItem value={"json"}>.json</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export { DownloadAll };

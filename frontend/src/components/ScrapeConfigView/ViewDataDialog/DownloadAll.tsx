import { useState } from "react";
import { Button, FormControl, MenuItem } from "@mui/material";
import {
  ScrapeConfig,
  ScrapeConfigDataDownload,
  SelectorDataDownload,
} from "../../../models/scrapeConfig";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as api from "../../../network/apis";
import { DownloadOptions, download } from "../../../utils/download";

interface DownloadAllProps {
  scrapeConfig: ScrapeConfig;
}

const DownloadAll = ({ scrapeConfig }: DownloadAllProps) => {
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

  async function loadData() {
    const dataSelectors: SelectorDataDownload[] = await Promise.all(
      scrapeConfig.selectorsMetadata.map(async (selector) => {
        if (!selector.selectorId) {
          console.error("No selectorId found for selector:", selector.name);
          return {
            name: selector.name,
            selectorValue: selector.selectorValue,
            data: null,
          };
        }

        const selectorData = await api.getSelector(selector.selectorId);
        return {
          name: selector.name,
          selectorValue: selector.selectorValue,
          data: selectorData.data,
        };
      })
    );

    let data: ScrapeConfigDataDownload = {
      name: scrapeConfig.name,
      description: scrapeConfig.description,
      url: scrapeConfig.url,
      scrapeIntervalMinute: scrapeConfig.scrapeIntervalMinute,
      selectors: dataSelectors,
    };

    return data;
  }

  async function handleDownload() {
    let data = await loadData();
    console.log(downloadOption);
    if (downloadOption == "json") {
      download(data, DownloadOptions.JSON);
    } else if (downloadOption == "csv") {
      data.selectors.map((selector) => {
        console.log("yo");
        download(selector.data, DownloadOptions.CSV, selector.name);
      });
    }
  }

  return (
    <div style={containerStyle}>
      <Button variant="contained" style={btnStyle} onClick={handleDownload}>
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

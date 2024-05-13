import { useState } from "react";
import { Button, FormControl, MenuItem } from "@mui/material";
import {
  ScrapeConfig,
  ScrapeConfigDataDownload,
  SelectorDataDownload,
} from "../../../models/scrapeConfig";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as api from "../../../network/apis";
import {
  DownloadOptions,
  download,
  convertScrapeConfigDataDownloadToCSV,
} from "../../../utils/download";
import styles from "../../../styles/ViewDataDialog.module.css";

interface DownloadAllProps {
  scrapeConfig: ScrapeConfig;
}

const DownloadAll = ({ scrapeConfig }: DownloadAllProps) => {
  const [downloadOption, setDownloadOption] = useState<DownloadOptions>(
    DownloadOptions.CSV
  );

  const handleChange = (event: SelectChangeEvent) => {
    setDownloadOption(event.target.value as DownloadOptions);
  };

  async function loadData() {
    const dataSelectors: SelectorDataDownload[] = await Promise.all(
      scrapeConfig.selectorsMetadata.map(async (selector) => {
        if (!selector.selectorId) {
          console.error("No selectorId found for selector:", selector.name);
          return {
            name: selector.name,
            selectorValue: selector.selectorValue,
            data: [],
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
      dateDownloaded: new Date(),
      selectors: dataSelectors,
    };

    return data;
  }

  async function handleDownload() {
    let data = await loadData();

    switch (downloadOption) {
      case DownloadOptions.CSV:
        download(
          convertScrapeConfigDataDownloadToCSV(data),
          DownloadOptions.CSV
        );
        break;
      case DownloadOptions.JSON:
        download(JSON.stringify(data), DownloadOptions.JSON);
        break;
      default:
        console.error("[ERROR] Invalid download option selected");
    }
  }

  return (
    <div className={styles.downloadAllContainer}>
      <Button
        variant="contained"
        className={styles.downloadAllBtn}
        onClick={handleDownload}
      >
        Download All
      </Button>
      <FormControl variant="standard" className={styles.downloadAllFormControl}>
        <Select
          labelId="download-option-label"
          value={downloadOption}
          onChange={handleChange}
        >
          <MenuItem value={DownloadOptions.CSV}>.csv</MenuItem>
          <MenuItem value={DownloadOptions.JSON}>.json</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export { DownloadAll };

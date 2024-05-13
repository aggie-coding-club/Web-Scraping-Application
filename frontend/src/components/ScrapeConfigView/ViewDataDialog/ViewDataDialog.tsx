import { Button, Dialog } from "@mui/material";
import { ScrapeConfig, statusStates } from "../../../models/scrapeConfig";
import { SelectorTable } from "./SelectorTable";
import { DownloadAll } from "./DownloadAll";
import { formatDate } from "../../../utils/formatDate";
import { MyChip } from "../../../ui/MyChip";

import styles from "../../../styles/ViewDataDialog.module.css";

interface ViewDataDialogProps {
  scrapeConfig: ScrapeConfig;
  openViewDialog: boolean;
  setOpenViewDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewDataDialog = ({
  scrapeConfig,
  openViewDialog,
  setOpenViewDialog,
}: ViewDataDialogProps) => {
  const handleClose = () => {
    setOpenViewDialog(false);
  };

  if (!scrapeConfig) return <></>;

  return (
    <Dialog fullScreen open={openViewDialog} onClose={handleClose}>
      <div className={styles.container}>
        <h1>View: {scrapeConfig.name}</h1>
        <div className={styles.metadataContainer}>
          {scrapeConfig.description && (
            <p>
              <b>Description</b>: {scrapeConfig.description}
            </p>
          )}
          <div>
            <b>Status</b>:
            <MyChip label={scrapeConfig.status} status={scrapeConfig.status} />
          </div>
          <p>
            <b>URL</b>:{" "}
            <a
              href={scrapeConfig.url}
              className={styles.metadataLink}
              target="_blank"
            >
              {scrapeConfig.url}
            </a>
          </p>
          <p>
            <b>Last Scrape</b>: {formatDate(scrapeConfig.lastSuccessfulScrape)}
          </p>
          <p>
            <b>Interval</b>: {scrapeConfig.scrapeIntervalMinute} min
          </p>
        </div>
        <hr />
        <h3>Selectors:</h3>
        <DownloadAll scrapeConfig={scrapeConfig} />
        <SelectorTable selectorsMetadata={scrapeConfig.selectorsMetadata} />
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
      </div>
    </Dialog>
  );
};

export { ViewDataDialog };

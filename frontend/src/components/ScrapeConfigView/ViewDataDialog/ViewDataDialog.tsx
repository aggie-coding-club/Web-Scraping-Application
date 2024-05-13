import { Button, Dialog } from "@mui/material";
import { ScrapeConfig } from "../../../models/scrapeConfig";
import { SelectorTable } from "./SelectorTable";
import { DownloadAll } from "./DownloadAll";
import { formatDate } from "../../../utils/formatDate";

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
      <h1>View: {scrapeConfig.name}</h1>
      {scrapeConfig.description && (
        <p>
          <b>Description</b>: {scrapeConfig.description}
        </p>
      )}
      <p>
        <b>Status</b>: {scrapeConfig.status}
      </p>
      <p>
        <b>URL</b>: {scrapeConfig.url}
      </p>
      <p>
        <b>Last Scrape</b>: {formatDate(scrapeConfig.lastSuccessfulScrape)}
      </p>
      <p>
        <b>Interval</b>: {scrapeConfig.scrapeIntervalMinute} min
      </p>
      <h3>Selectors:</h3>
      <DownloadAll scrapeConfig={scrapeConfig} />
      <SelectorTable selectorsMetadata={scrapeConfig.selectorsMetadata} />
      <Button onClick={handleClose} variant="contained">
        Close
      </Button>
    </Dialog>
  );
};

export { ViewDataDialog };

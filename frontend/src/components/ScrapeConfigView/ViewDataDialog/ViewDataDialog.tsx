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
      <p>Description: {scrapeConfig.description}</p>
      <p>Status: {scrapeConfig.status}</p>
      <p>URL: {scrapeConfig.url}</p>
      <p>Last Scraped: {formatDate(scrapeConfig.lastSuccessfulScrape)}</p>
      <p>Interval: {scrapeConfig.scrapeIntervalMinute} min</p>
      <h3>Selectors:</h3>
      <DownloadAll />
      <SelectorTable selectorsMetadata={scrapeConfig.selectorsMetadata} />
      <Button onClick={handleClose} variant="contained">
        Close
      </Button>
    </Dialog>
  );
};

export { ViewDataDialog };

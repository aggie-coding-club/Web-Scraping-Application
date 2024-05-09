import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { Button, Dialog } from "@mui/material";
import { useState } from "react";
import { ScrapeConfig } from "../../../models/scrapeConfig";
import { SelectorInput } from "../../../models/scrapeConfig";

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

  return (
    <Dialog fullScreen open={openViewDialog} onClose={handleClose}>
      <h1>View: {scrapeConfig.name}</h1>
      <p>Description: {scrapeConfig.description}</p>
      <p>Status: {scrapeConfig.status}</p>
      <p>URL: {scrapeConfig.url}</p>
      {/* FIXME: confirm that updatedAt DOES mean last scraped */}
      <p>Last Scraped: {scrapeConfig.updatedAt}</p>{" "}
      <p>Interval: {scrapeConfig.scrapeIntervalMinute}</p>
      <h3>Selectors:</h3>
      <div>
        {scrapeConfig.selectorsMetadata.map((selector) => (
          <div>
            {selector.name} - {selector.selectorValue}
          </div>
        ))}
      </div>
      <Button onClick={() => console.log(scrapeConfig)}>click me</Button>
    </Dialog>
  );
};

export { ViewDataDialog };

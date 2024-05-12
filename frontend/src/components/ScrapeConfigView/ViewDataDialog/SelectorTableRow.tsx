import { Fragment, useState } from "react";
import {
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GetAppIcon from "@mui/icons-material/GetApp";
import {
  SelectorData,
  SelectorInput,
  SelectorDataDownload,
} from "../../../models/scrapeConfig";
import { SelectorDataTable } from "./SelectorDataTable";
import {
  DownloadOptions,
  convertSelectorDataDownloadToCSV,
  download,
} from "../../../utils/download";
import * as api from "../../../network/apis";

interface RowProps {
  selector: SelectorInput;
}

const SelectorTableRow = ({ selector }: RowProps) => {
  const [openDataTable, setOpenDataTable] = useState<boolean>(false);
  const [selectorData, setSelectorData] = useState<SelectorData | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDownloadMenu = Boolean(anchorEl);

  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDownloadClose = () => {
    setAnchorEl(null);
  };

  async function loadData() {
    if (!selector.selectorId) {
      console.log("[ERROR] SelectorId undefined");
      return [];
    }

    let data: SelectorData = await api.getSelector(selector.selectorId);
    setSelectorData(data);
    return data.data;
  }

  async function handleDataTableOpen() {
    if (!openDataTable && selectorData == undefined) {
      loadData();
    }

    setOpenDataTable(!openDataTable);
  }

  async function handleDownload(option: DownloadOptions) {
    let data: SelectorDataDownload = {
      name: selector.name,
      selectorValue: selector.selectorValue,
      dateDownloaded: new Date(),
      data: selectorData ? selectorData.data : await loadData(),
    };

    if (!data.data) {
      console.log("[ERROR] No data to download");
      return;
    }

    let downloadData;
    switch (option) {
      case DownloadOptions.CSV:
        downloadData = convertSelectorDataDownloadToCSV(data);
        break;
      case DownloadOptions.JSON:
        downloadData = JSON.stringify(data);
        break;
      default:
        console.error("Invalid Download option");
        return;
    }

    download(
      downloadData,
      option,
      `${selector.name}|${selector.selectorValue}`
    );
  }

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleDataTableOpen}
          >
            {openDataTable ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {selector.name}
        </TableCell>
        <TableCell>{selector.selectorValue}</TableCell>
        <TableCell align="center">
          <IconButton color="primary" onClick={handleDownloadClick}>
            <GetAppIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openDownloadMenu}
            onClose={handleDownloadClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleDownload(DownloadOptions.JSON)}>
              Download .json
            </MenuItem>
            <MenuItem onClick={() => handleDownload(DownloadOptions.CSV)}>
              Download .csv
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openDataTable} timeout="auto" unmountOnExit>
            {openDataTable && <SelectorDataTable selectorData={selectorData} />}
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export { SelectorTableRow };

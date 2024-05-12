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
import * as api from "../../../network/apis";

interface RowProps {
  selector: SelectorInput;
}

enum DownloadOption {
  CSV = 1,
  JSON = 2,
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

  async function download(option: DownloadOption) {
    let data: SelectorDataDownload = {
      name: selector.name,
      selectorValue: selector.selectorValue,
      data: selectorData ? selectorData.data : await loadData(),
    };

    if (!data.data) {
      console.log("[ERROR] No data to download");
      return;
    }

    let downloadData;
    let downloadType = { type: "" };
    let extension = "";
    if (option == DownloadOption.CSV) {
      downloadData = convertToCsv(data);
      downloadType.type = "text/csv";
      extension = "csv";
    } else if (option == DownloadOption.JSON) {
      downloadData = JSON.stringify(data);
      downloadType.type = "application/json";
      extension = "json";
    }

    if (!downloadData) {
      return;
    }

    const blob = new Blob([downloadData], downloadType);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name}_${data.selectorValue}.${extension}`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    handleDownloadClose();
  }

  // Function to convert JSON data to CSV format
  function convertToCsv(data: SelectorDataDownload) {
    // Assuming data is an array of objects with similar structure
    if (!data.data) {
      console.error("[ERROR] no data to convert to csv");
      return;
    }

    const headers = Object.keys(data.data[0]).join(",");
    const rows = data.data
      .map((obj) => Object.values(obj).join(","))
      .join("\n");
    return `${headers}\n${rows}`;
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
            <MenuItem onClick={() => download(DownloadOption.JSON)}>
              Download .json
            </MenuItem>
            <MenuItem onClick={() => download(DownloadOption.CSV)}>
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

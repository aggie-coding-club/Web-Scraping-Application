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
import { SelectorData, SelectorInput } from "../../../models/scrapeConfig";
import { SelectorDataTable } from "./SelectorDataTable";
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
      return null;
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

  async function downloadCsv() {
    let data = {
      name: selector.name,
      selectorValue: selector.selectorValue,
      data: selectorData ? selectorData.data : await loadData(),
    };

    if (!data.data) {
      console.log("[ERROR] No data to download");
      return;
    }

    // Convert data to CSV format
    const csv = convertToCsv(data);

    // Create a Blob object representing the data as a CSV file
    const blob = new Blob([csv], { type: "text/csv" });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name}_${data.selectorValue}.csv`;

    // Append the anchor to the document body
    document.body.appendChild(a);

    // Click the anchor to trigger the download
    a.click();

    // Remove the anchor from the document body
    document.body.removeChild(a);

    // Release the URL object
    URL.revokeObjectURL(url);

    // handle any other close event
    handleDownloadClose();
  }

  // Function to convert JSON data to CSV format
  function convertToCsv(data: any) {
    // Assuming data is an array of objects with similar structure
    const headers = Object.keys(data.data[0]).join(",");
    const rows = data.data
      .map((obj: any) => Object.values(obj).join(","))
      .join("\n");
    return `${headers}\n${rows}`;
  }

  async function downloadJson() {
    let data = {
      name: selector.name,
      selectorValue: selector.selectorValue,
      data: selectorData ? selectorData.data : await loadData(),
    };

    if (!data.data) {
      console.log("[ERROR] No data to download");
      return;
    }

    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name}/${data.selectorValue}.json`;
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    handleDownloadClose();
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
            <MenuItem onClick={downloadJson}>Download .json</MenuItem>
            <MenuItem onClick={downloadCsv}>Download .csv</MenuItem>
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

import { Fragment, useState } from "react";
import { Collapse, IconButton, TableCell, TableRow } from "@mui/material";
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
  const [open, setOpen] = useState(false);
  const [selectorData, setSelectorData] = useState<SelectorData | null>(null);

  async function loadData() {
    if (!selector.selectorId) {
      console.log("[ERROR] SelectorId undefined");
      return null;
    }

    let data = await api.getSelector(selector.selectorId);
    setSelectorData(data);
    return data;
  }

  async function handleOpen() {
    if (!open && selectorData == undefined) {
      loadData();
    }

    setOpen(!open);
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
  }

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {selector.name}
        </TableCell>
        <TableCell>{selector.selectorValue}</TableCell>
        <TableCell align="center">
          <IconButton color="primary" onClick={downloadJson}>
            <GetAppIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {open && <SelectorDataTable selectorData={selectorData} />}
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export { SelectorTableRow };

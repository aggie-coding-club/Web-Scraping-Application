import { Fragment, useState } from "react";
import { Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GetAppIcon from "@mui/icons-material/GetApp";
import { SelectorInput } from "../../../models/scrapeConfig";
import { SelectorDataTable } from "./SelectorDataTable";
import * as api from "../../../network/apis";

interface RowProps {
  selector: SelectorInput;
}

const SelectorTableRow = ({ selector }: RowProps) => {
  const [open, setOpen] = useState(false);

  async function downloadJson() {
    if (!selector.selectorId) {
      console.log("[ERROR] SelectorId undefined");
      return;
    }

    const data = await api.getSelector(selector.selectorId);
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
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
            {open && <SelectorDataTable selector={selector} />}
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export { SelectorTableRow };

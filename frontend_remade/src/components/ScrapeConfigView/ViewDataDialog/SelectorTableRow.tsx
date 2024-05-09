import * as React from "react";
import { Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { SelectorInput } from "../../../models/scrapeConfig";
import { SelectorDataTable } from "./SelectorDataTable";

interface RowProps {
  selector: SelectorInput;
}

const SelectorTableRow = ({ selector }: RowProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
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
        <TableCell align="right">{selector.selectorValue}</TableCell>
        <TableCell align="right">Download</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <SelectorDataTable />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export { SelectorTableRow };

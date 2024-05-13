import { SelectorInput } from "../../../models/scrapeConfig";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";
import { SelectorTableRow } from "./SelectorTableRow";

interface SelectorTableRowProps {
  selectorsMetadata: SelectorInput[];
}

const SelectorTable = ({ selectorsMetadata }: SelectorTableRowProps) => {
  if (!selectorsMetadata) {
    return <h1>No metadata</h1>;
  }

  const tableContainerStyle = {
    maxWidth: 650,
  };

  const tableHeaderStyle = {
    backgroundColor: "#F5F5F5",
  };

  return (
    <TableContainer component={Paper} sx={tableContainerStyle}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow sx={tableHeaderStyle}>
            <TableCell />
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell>
              <b>Selector</b>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {selectorsMetadata.map((selector) => (
            <SelectorTableRow key={selector.name} selector={selector} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { SelectorTable };

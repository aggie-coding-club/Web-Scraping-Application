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
import styles from "../../../styles/ViewDataDialog.module.css";

interface SelectorTableRowProps {
  selectorsMetadata: SelectorInput[];
}

const SelectorTable = ({ selectorsMetadata }: SelectorTableRowProps) => {
  if (!selectorsMetadata) {
    return <h1>No metadata</h1>;
  }

  return (
    <TableContainer component={Paper} className={styles.selectorTableContainer}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow className={styles.tableHeader}>
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

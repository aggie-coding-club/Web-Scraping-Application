import { Fragment } from "react";
import { SelectorData } from "../../../models/scrapeConfig";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";
import styles from "../../../styles/ViewDataDialog.module.css";

interface SelectorDataTableProps {
  selectorData: SelectorData | null;
}

const SelectorDataTable = ({ selectorData }: SelectorDataTableProps) => {
  const cstOptions = {
    timeZone: "America/Chicago", // CST timezone
  };

  if (!selectorData) {
    return <p>Loading</p>;
  }

  return (
    <div className={styles.selectorDataTableContainer}>
      <TableContainer component={Paper} className={styles.selectorDataTable}>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow className={styles.tableHeader}>
              <TableCell align="left">Timestamp (CST)</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectorData.data.map((dat) => {
              let myDate = new Date(dat.timestamp).toLocaleString(
                "en-US",
                cstOptions
              );
              return (
                <Fragment
                  key={dat.timestamp.toLocaleString("en-US", cstOptions)}
                >
                  <TableRow>
                    <TableCell>{myDate}</TableCell>
                    <TableCell>{dat.content}</TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export { SelectorDataTable };

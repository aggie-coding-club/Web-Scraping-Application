import { useState, useEffect, Fragment } from "react";
import { SelectorData, SelectorInput } from "../../../models/scrapeConfig";
import * as api from "../../../network/apis";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";

interface SelectorDataTableProps {
  selectorData: SelectorData | undefined;
}

const SelectorDataTable = ({ selectorData }: SelectorDataTableProps) => {
  const cstOptions = {
    timeZone: "America/Chicago", // CST timezone
  };

  const tableContainerStyle = {
    maxWidth: 600,
  };

  const tableHeaderStyle = {
    backgroundColor: "#F5F5F5",
  };

  if (!selectorData) {
    return <p>Loading</p>;
  }

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyle}>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow sx={tableHeaderStyle}>
              <TableCell align="left">Timestamp (CST)</TableCell>
              <TableCell>Value</TableCell>
              <TableCell />
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
    </>
  );
};

export { SelectorDataTable };

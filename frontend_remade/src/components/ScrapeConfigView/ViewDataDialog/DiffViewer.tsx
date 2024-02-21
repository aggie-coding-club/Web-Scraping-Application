import { createPatch } from "diff";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import { useState } from "react";
import "../../../styles/Diffviewer.css";
import { OutputFormatType } from "diff2html/lib/types";
interface DiffViewerProps {
  oldText: string;
  newText: string;
}

function parseEscapeSequences(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\\/g, "\\")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"');
}

const DiffViewer = ({ oldText, newText }: DiffViewerProps) => {
  const [outputFormat, setOutputFormat] =
    useState<OutputFormatType>("line-by-line");
  const [isParseEscapeSequences, setIsParseEscapeSequences] =
    useState<boolean>(false);
  const differences = isParseEscapeSequences
    ? createPatch(
        "File",
        parseEscapeSequences(oldText),
        parseEscapeSequences(newText)
      )
    : createPatch("File", oldText, newText);

  const html = Diff2Html.html(differences, {
    drawFileList: true,
    matching: "lines",
    outputFormat,
    renderNothingWhenEmpty: false,
  });

  return (
    <>
      Output Format:
      <select
        className="form-select form-select-sm"
        aria-label=".form-select-sm example"
        style={{ marginTop: "10px", marginBottom: "20px" }}
        onChange={(event) => {
          setOutputFormat(event.target.value as OutputFormatType);
        }}
      >
        <option selected value="line-by-line">
          Line-by-line
        </option>
        <option value="side-by-side">Side-by-side</option>
      </select>
      Parse Escape Sequences:
      <select
        className="form-select form-select-sm"
        aria-label=".form-select-sm example"
        style={{ marginTop: "10px", marginBottom: "20px" }}
        onChange={(event) => {
          if (event.target.value === "true") {
            setIsParseEscapeSequences(true);
          } else {
            setIsParseEscapeSequences(false);
          }
        }}
      >
        <option selected value="false">
          False
        </option>
        <option value="true">True</option>
      </select>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
};

export default DiffViewer;

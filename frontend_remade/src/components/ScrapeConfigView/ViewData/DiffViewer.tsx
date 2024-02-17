import { createPatch } from "diff";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import { useState } from "react";

interface DiffViewerProps {
    oldText: string;
    newText: string;
}

const DiffViewer = ({ oldText, newText }: DiffViewerProps) => {
    const [outputFormat, setOutputFormat] = useState<any>("line-by-line");
    const differences = createPatch("File", oldText, newText);

    const html = Diff2Html.html(differences, {
        drawFileList: true,
        matching: "lines",
        outputFormat,
        renderNothingWhenEmpty: false,
    });

    return (
        <>
            <select
                className="form-select form-select-sm"
                aria-label=".form-select-sm example"
                style={{ marginBottom: "20px" }}
                onChange={(event) => {
                    setOutputFormat(event.target.value);
                }}
            >
                <option selected value="line-by-line">
                    Line-by-line
                </option>
                <option value="side-by-side">Side-by-side</option>
            </select>

            <div dangerouslySetInnerHTML={{ __html: html }} />
        </>
    );
};

export default DiffViewer;

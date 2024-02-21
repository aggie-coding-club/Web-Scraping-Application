import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { Button } from "@mui/material";
import { useState } from "react";
import { Form, Modal, Tab, Tabs } from "react-bootstrap";
import { ScrapeConfig } from "../../../models/scrapeConfig";
import DataArrayTable from "./DataArrayTable";
import DataTable from "./DataTable";
import DiffViewer from "./DiffViewer";
import SelectorsTable from "./SelectorsTable";

interface ViewDataDialogProps {
  scrapeConfig: ScrapeConfig;
  dataToView?: any[];
  onDismiss: () => void;
  scrapeParametersArray: any[];
}

const ViewDataDialog = ({
  dataToView,
  onDismiss,
  scrapeParametersArray,
}: ViewDataDialogProps) => {
  if (dataToView === undefined) {
    dataToView = [];
  }

  const [index, setIndex] = useState<number | null>(null);
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");

  return (
    <Modal show onHide={onDismiss} fullscreen={true}>
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <Tabs id="controlled-tab-example" className="mb-3">
          <Tab eventKey="table" title="Table Format">
            <Form.Label style={{ marginBottom: "20px" }}>
              Selectors Table
            </Form.Label>
            <SelectorsTable dataSource={scrapeParametersArray} />
            {index !== null && (
              <>
                <Form.Label style={{ marginBottom: "20px" }}>
                  {new Date(dataToView[index].timestamp).toLocaleString()}{" "}
                  Scraped Data
                </Form.Label>
                <DataTable dataSource={dataToView[index].selectors} />
              </>
            )}
            <Form.Label style={{ marginBottom: "20px" }}>Data Table</Form.Label>
            <DataArrayTable dataSource={dataToView} setIndex={setIndex} />
          </Tab>
          <Tab eventKey="json" title="JSON Format">
            <Form.Label style={{ marginBottom: "20px" }}>
              Selectors JSON
            </Form.Label>
            <Form.Control
              as={TextareaAutosize}
              style={{ marginBottom: "30px" }}
              readOnly
              value={JSON.stringify(scrapeParametersArray, null, 2)}
            />
            <Form.Label style={{ marginBottom: "20px" }}>Data JSON</Form.Label>
            <Form.Control
              as={TextareaAutosize}
              style={{ marginBottom: "30px" }}
              readOnly
              value={JSON.stringify(dataToView, null, 2)}
            />
          </Tab>
          <Tab eventKey="compare" title="Text Compare">
            <Form.Label style={{ marginBottom: "20px" }}>Old Text</Form.Label>
            <Form.Control
              as={TextareaAutosize}
              style={{ marginBottom: "30px" }}
              onChange={(event) => setOldText(event.target.value)}
            />
            <Form.Label style={{ marginBottom: "20px" }}>New Text</Form.Label>
            <Form.Control
              as={TextareaAutosize}
              style={{ marginBottom: "30px" }}
              onChange={(event) => setNewText(event.target.value)}
            />
            <DiffViewer oldText={oldText} newText={newText} />
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outlined" onClick={onDismiss}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDataDialog;

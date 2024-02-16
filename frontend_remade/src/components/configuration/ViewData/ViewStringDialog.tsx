import Table, { ColumnsType } from "antd/es/table";
import { useRef, useState } from "react";
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import DiffViewer from "./DiffViewer";

interface ViewStringDiaglogProps {
    dataToView?: any;
    stringToView?: string;
    onDismiss: () => void;
    scrapeParametersArray: any[];
}

const ViewStringDialog = ({ dataToView, stringToView, onDismiss, scrapeParametersArray }: ViewStringDiaglogProps) => {
    const parameterColumns: ColumnsType<any> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Selector",
            dataIndex: "value",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
    ];

    const dataColumns: ColumnsType<any> = [
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
        },
        {
            title: "Data",
            key: "select",
            render: () => (
                <>
                    <a className="text-secondary" href="#">
                        Select
                    </a>
                </>
            ),
        },
    ];

    const textareaScrapeParamsRef = useRef<HTMLTextAreaElement>(null);
    const textareaScrapedDataRef = useRef<HTMLTextAreaElement>(null);
    const textareaOldTextRef = useRef<HTMLTextAreaElement>(null);
    const textareaNewTextRef = useRef<HTMLTextAreaElement>(null);

    const [oldText, setOldText] = useState("");
    const [newText, setNewText] = useState("");

    const adjustHeight = (textareaRef: any) => {
        const textarea = textareaRef.current;
        if (textarea) {
            setTimeout(() => {
                textarea.style.height = "auto";
                textarea.style.height = `${textarea.scrollHeight}px`;
            }, 0);
        }
    };

    const handleSelect = (k: any) => {
        if (k === "json") {
            adjustHeight(textareaScrapeParamsRef);
            adjustHeight(textareaScrapedDataRef);
        }
    };

    return (
        <Modal show onHide={onDismiss} fullscreen={true}>
            <Modal.Body style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
                <Tabs id="controlled-tab-example" className="mb-3" onSelect={handleSelect}>
                    <Tab eventKey="table" title="Table Format">
                        <Form.Label style={{ marginBottom: "20px" }}>Selectors Table</Form.Label>
                        <Table dataSource={scrapeParametersArray} columns={parameterColumns} />
                        <Form.Label style={{ marginBottom: "20px" }}>Data Table</Form.Label>
                        <Table dataSource={dataToView} columns={dataColumns} />
                    </Tab>
                    <Tab eventKey="json" title="JSON Format">
                        <Form.Label style={{ marginBottom: "20px" }}>Selectors JSON</Form.Label>
                        <Form.Control
                            as="textarea"
                            ref={textareaScrapeParamsRef}
                            style={{ overflow: "hidden", marginBottom: "30px" }}
                            readOnly
                            value={JSON.stringify(scrapeParametersArray, null, 2)}
                        />
                        <Form.Label style={{ marginBottom: "20px" }}>Data JSON</Form.Label>
                        <Form.Control
                            as="textarea"
                            ref={textareaScrapedDataRef}
                            style={{ overflow: "hidden", marginBottom: "30px" }}
                            readOnly
                            value={stringToView}
                        />
                    </Tab>
                    <Tab eventKey="compare" title="Text Compare">
                        <Form.Label style={{ marginBottom: "20px" }}>Old Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            ref={textareaOldTextRef}
                            style={{ overflow: "hidden", marginBottom: "30px" }}
                            onChange={(event) => {
                                setOldText(event.target.value);
                                adjustHeight(textareaOldTextRef);
                            }}
                        />
                        <Form.Label style={{ marginBottom: "20px" }}>New Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            ref={textareaNewTextRef}
                            style={{ overflow: "hidden", marginBottom: "30px" }}
                            onChange={(event) => {
                                setNewText(event.target.value);
                                adjustHeight(textareaNewTextRef);
                            }}
                        />
                        <DiffViewer oldText={oldText} newText={newText} />
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onDismiss}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewStringDialog;

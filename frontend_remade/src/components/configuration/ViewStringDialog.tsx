import { Modal, Form, Button } from "react-bootstrap";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Tab, Tabs } from "react-bootstrap";

interface ViewStringDiaglogProps {
    dataToView?: any;
    stringToView?: string;
    onDismiss: () => void;
    scrapeParametersArray: any[];
}

const ViewStringDialog = ({ dataToView, stringToView, onDismiss, scrapeParametersArray }: ViewStringDiaglogProps) => {
    const [textareaHeight, setTextareaHeight] = useState("0px");

    const parameterColumns: ColumnsType<any> = [
        {
            title: "Parameter Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Tag",
            dataIndex: "tag",
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

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            setTimeout(() => {
                textarea.style.height = "auto";
                setTextareaHeight(`${textarea.scrollHeight}px`);
            }, 0);
        }
    };

    const handleSelect = (k: any) => {
        console.log(k);
        if (k === "data") {
            adjustHeight();
        }
    };

    return (
        <Modal show onHide={onDismiss} fullscreen={true}>
            <Modal.Body style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
                <Tabs id="controlled-tab-example" className="mb-3" onSelect={handleSelect}>
                    <Tab eventKey="parameters" title="Parameters Table">
                        {/* <textarea ref={textareaRef} style={{ height: "0px" }} readOnly value={stringToView}>
                            {stringToView}
                        </textarea> */}
                        {/* <Form.Control as="textarea" ref={textareaRef} style={{ overflow: "hidden" }} readOnly value={stringToView} /> */}

                        <Form.Label style={{ marginBottom: "20px" }}>Parameters Table</Form.Label>
                        <Table dataSource={scrapeParametersArray} columns={parameterColumns} />
                        <Form.Label style={{ marginBottom: "20px" }}>Data Table</Form.Label>
                        <Table dataSource={dataToView} columns={dataColumns} />
                    </Tab>
                    <Tab eventKey="data" title="Data Table">
                        <Form.Control
                            as="textarea"
                            ref={textareaRef}
                            style={{ overflow: "hidden", height: textareaHeight }}
                            readOnly
                            value={stringToView}
                        />

                        {/* <Form.Control as="textarea" ref={textareaRef} style={{ height: "0px" }} readOnly value={stringToView} /> */}
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

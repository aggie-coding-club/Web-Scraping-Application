import { Modal, Form, Button } from "react-bootstrap";

interface ViewStringDiaglogProps {
    stringToView?: string;
    onDismiss: () => void;
}

const ViewStringDialog = ({ stringToView, onDismiss }: ViewStringDiaglogProps) => {
    return (
        <Modal show onHide={onDismiss} fullscreen={true}>
            <Modal.Body style={{ display: "flex", flexDirection: "column", padding: "20px", height: "calc(100vh - 60px)" }}>
                {/* Adjust padding and subtracted height (60px) as needed */}
                <Form.Label style={{ marginBottom: "20px" }}>Scraped JSON</Form.Label>
                <Form.Group className="mb-3" style={{ flex: 1, overflowY: "auto" }}>
                    <Form.Control as="textarea" style={{ height: "100%", resize: "none" }} readOnly defaultValue={stringToView} />
                </Form.Group>
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

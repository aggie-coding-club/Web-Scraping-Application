import { Modal, Form, Button } from "react-bootstrap";

interface ViewStringDiaglogProps {
    stringToView?: string;
    onDismiss: () => void;
}

const ViewStringDialog = ({ stringToView, onDismiss }: ViewStringDiaglogProps) => {
    return (
        <Modal show onHide={onDismiss} fullscreen={true}>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label style={{ marginBottom: "2%" }}>Scraped JSON</Form.Label>
                    <Form.Control as="textarea" style={{ height: "75vh" }} readOnly defaultValue={stringToView} />
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

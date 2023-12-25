import { Modal, Form, Button } from "react-bootstrap";

interface ViewStringDiaglogProps {
    stringToView?: string;
    onDismiss: () => void;
}

const ViewStringDialog = ({ stringToView, onDismiss }: ViewStringDiaglogProps) => {
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>View Object</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Object JSON</Form.Label>
                    <Form.Control as="textarea" rows={10} readOnly defaultValue={stringToView} />
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

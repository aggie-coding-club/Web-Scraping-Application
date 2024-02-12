import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ObjInput } from "../../models/objInput";
import { Obj } from "../../models/object";
import * as ObjApi from "../../network/objs_api";
import { fetchHtmlContent } from "../../network/objs_api";
import EditableTable from "./EditableTable";
import TextInputField from "../form/TextInputField";

interface AddEditObjDialogProps {
    objToEdit?: Obj;
    onDismiss: () => void;
    onObjSaved: (obj: Obj) => void;
}

const AddEditObjDialog = ({ objToEdit, onDismiss, onObjSaved }: AddEditObjDialogProps) => {
    const [iframeSrc, setIframeSrc] = useState("");
    const [selector, setSelector] = useState<any>("");
    const [scrapeParametersArray, setScrapeParametersArray] = useState<any[]>(
        objToEdit?.scrapeParameters
            ? [...objToEdit.scrapeParameters, { key: 0, name: "", tag: "", description: "" }]
            : [{ key: 0, name: "", tag: "", description: "" }]
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ObjInput>({
        defaultValues: {
            name: objToEdit?.name || "",
            description: objToEdit?.description || "",
            url: objToEdit?.url || "",
            scrapeParameters: scrapeParametersArray.slice(0, -1),
            scrapeIntervalMinute: objToEdit?.scrapeIntervalMinute || 1,
        },
    });

    const url = watch("url");

    useEffect(() => {
        if (url) {
            fetchHtmlContent(url)
                .then((htmlContent) => {
                    setIframeSrc(htmlContent);
                })
                .catch((error) => console.error("Error fetching HTML:", error));
        }
    }, [url]);

    useEffect(() => {
        const receiveMessage = (event: any) => {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data.selector) {
                setSelector(event.data.selector);
            }
        };

        window.addEventListener("message", receiveMessage);
        return () => window.removeEventListener("message", receiveMessage);
    }, []);

    async function onSubmit(input: ObjInput) {
        const inputWithScrapeParameters = { ...input, scrapeParameters: scrapeParametersArray.slice(0, -1) };
        try {
            const objResponse = objToEdit
                ? await ObjApi.updateObj(objToEdit._id, inputWithScrapeParameters)
                : await ObjApi.createObj(inputWithScrapeParameters);
            onObjSaved(objResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>{objToEdit ? "Edit Configuration" : "Create Configuration"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: "flex", flexDirection: "row", height: "80vh" }}>
                    <div style={{ flex: 1, paddingRight: "20px" }}>
                        <iframe srcDoc={iframeSrc} style={{ width: "100%", height: "100%" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Form id="addEditObjForm" onSubmit={handleSubmit(onSubmit)}>
                            <TextInputField
                                name="name"
                                label="Configuration Name"
                                type="text"
                                placeholder="Name"
                                register={register}
                                registerOptions={{ required: "Required" }}
                                // error={errors.name}
                            />
                            <TextInputField
                                name="description"
                                label="Description"
                                type="text"
                                placeholder="Description"
                                register={register}
                                registerOptions={{ required: "Required" }}
                                // error={errors.description}
                            />
                            <TextInputField
                                name="url"
                                label="Website URL"
                                type="text"
                                placeholder="URL"
                                register={register}
                                registerOptions={{ required: "Required" }}
                                error={errors.url}
                            />
                            <Form.Group className="mb-3">
                                <Form.Label>Captured Selector</Form.Label>
                                <Form.Control placeholder=".example" value={selector} readOnly={true} />
                            </Form.Group>
                            <TextInputField
                                name="scrapeIntervalMinute"
                                label="Scrape Interval (Minutes)"
                                type="number"
                                placeholder="Enter interval in minutes"
                                register={register}
                                registerOptions={{ required: "Required" }}
                                error={errors.scrapeIntervalMinute}
                            />
                            <EditableTable scrapeParametersArray={scrapeParametersArray} setScrapeParametersArray={setScrapeParametersArray} />
                            <Button
                                type="submit"
                                form="addEditObjForm"
                                disabled={isSubmitting}
                                style={{
                                    backgroundColor: "#164863",
                                    transition: "background-color 0.3s",
                                    borderColor: "#427d9d",
                                    borderWidth: "1px",
                                    marginBottom: "20px",
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.backgroundColor = "#9bbec8";
                                    e.currentTarget.style.borderColor = "#9bbec8";
                                    e.currentTarget.style.borderWidth = "2px";
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.backgroundColor = "#427d9d";
                                    e.currentTarget.style.borderWidth = "1px";
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#427d9d";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#164863";
                                    e.currentTarget.style.borderWidth = "1px";
                                }}
                            >
                                Save
                            </Button>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AddEditObjDialog;

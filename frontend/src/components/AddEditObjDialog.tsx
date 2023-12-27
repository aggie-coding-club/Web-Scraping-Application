import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Obj } from "../models/object";
import { ObjInput } from "../models/objInput";
import * as ObjApi from "../network/objs_api";
import TextInputField from "./form/TextInputField";
import { fetchHtmlContent } from '../network/objs_api';

interface AddEditObjDialogProps {
    objToEdit?: Obj;
    onDismiss: () => void;
    onObjSaved: (obj: Obj) => void;
}

const AddEditObjDialog = ({ objToEdit, onDismiss, onObjSaved }: AddEditObjDialogProps) => {
    const [iframeSrc, setIframeSrc] = useState('');
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ObjInput>({
        defaultValues: {
            url: objToEdit?.url || "",
            scrapeParameters: JSON.stringify(objToEdit?.scrapeParameters, null, 2) || "",
            scrapeIntervalMinute: objToEdit?.scrapeIntervalMinute || 1,
        },
    });

    // Watch for URL changes
    const url = watch("url");

    // Function to fetch HTML content and set as iframe source
    // const fetchAndSetHtml = async (url: string) => {
    //     try {
    //         const response = await fetch('/scrape/fetchHtml', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ url }),
    //         });
    //         const htmlContent = await response.text();
    //         setIframeSrc(htmlContent);
    //     } catch (error) {
    //         console.error("Error fetching HTML: ", error);
    //     }
    // };

    // Update iframe source when the URL changes
    useEffect(() => {
        if (url) {
            fetchHtmlContent(url)
                .then(htmlContent => {
                    setIframeSrc(htmlContent);
                })
                .catch(error => console.error('Error fetching HTML:', error));
        }
    }, [url]);

    async function onSubmit(input: ObjInput) {
        try {
            const objResponse = objToEdit ? await ObjApi.updateObj(objToEdit._id, input) : await ObjApi.createObj(input);
            onObjSaved(objResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss} size="xl"> {/* Change size to "xl" for extra large modal */}
            <Modal.Header closeButton>
                <Modal.Title>{objToEdit ? "Edit Object" : "Add Object"}</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
                <div style={{ display: "flex", flexDirection: "row", height: "80vh" }}> {/* Adjusted height */}
                    <div style={{ flex: 1, paddingRight: "20px" }}> {/* Adjusted for flexible sizing */}
                        <iframe 
                            srcDoc={iframeSrc} 
                            style={{ width: "100%", height: "100%", transform: "scale(1)", transformOrigin: "0 0" }} 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Form id="addEditObjForm" onSubmit={handleSubmit(onSubmit)}>
                            <TextInputField
                                name="url"
                                label="Website URL"
                                type="text"
                                placeholder="URL"
                                register={register}
                                registerOptions={{ required: "Required" }}
                                error={errors.url}
                            />

                            <TextInputField
                                name="scrapeParameters"
                                label="Scrape Parameters"
                                as="textarea"
                                rows={4}
                                placeholder="Text"
                                register={register}
                                registerOptions={{ required: "Required" }}
                                error={errors.scrapeParameters}
                            />

                            <TextInputField
                                name="scrapeIntervalMinute"
                                label="Scrape Interval (Minutes)"
                                type="number"
                                placeholder="Enter interval in minutes"
                                register={register}
                                registerOptions={{ required: "Required" }}
                                error={errors.scrapeIntervalMinute}
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    backgroundColor: "#164863",
                                    transition: "background-color 0.3s",
                                    borderColor: "#427d9d",
                                    borderWidth: "1px",
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

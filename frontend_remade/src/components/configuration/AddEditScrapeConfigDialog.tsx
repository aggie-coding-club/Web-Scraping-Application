import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ScrapeConfig } from "../../models/scrapeConfig";
import { Obj } from "../../models/object";
import * as ObjApi from "../../network/objs_api";
import { fetchHtmlContent } from "../../network/objs_api";
import EditableTable from "./EditableTable";
import TextInputField from "../form/TextInputField";

interface AddEditScrapeConfigProps {
    scrapeConfig?: Obj;
    onDismiss: () => void;
    onScrapeConfigSaved: (scrapeConfig: Obj) => void;
}

const AddEditObjDialog = ({ scrapeConfig, onDismiss, onScrapeConfigSaved }: AddEditScrapeConfigProps) => {
    const [iframeSrc, setIframeSrc] = useState("");
    const [selector, setSelector] = useState<any>("");
    const [scrapeParametersArray, setScrapeParametersArray] = useState<any[]>(
        scrapeConfig?.scrapeParameters
            ? [...scrapeConfig.scrapeParameters, { key: 0, name: "", value: "", description: "" }]
            : [{ key: 0, name: "", value: "", description: "" }]
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ScrapeConfig>({
        defaultValues: {
            name: scrapeConfig?.name || "",
            description: scrapeConfig?.description || "",
            url: scrapeConfig?.url || "",
            scrapeParameters: scrapeParametersArray.slice(0, -1),
            scrapeIntervalMinute: scrapeConfig?.scrapeIntervalMinute || 60,
            emailNotification: "none",
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

    async function onSubmit(input: ScrapeConfig) {
        const inputWithScrapeParameters = { ...input, scrapeParameters: scrapeParametersArray.slice(0, -1) };
        try {
            const scrapeConfigResponse = scrapeConfig
                ? await ObjApi.updateObj(scrapeConfig._id, inputWithScrapeParameters)
                : await ObjApi.createObj(inputWithScrapeParameters);
            onScrapeConfigSaved(scrapeConfigResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss} fullscreen={true}>
            <Modal.Header closeButton>
                <Modal.Title>{scrapeConfig ? "Edit Configuration" : "Create Configuration"}</Modal.Title>
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
                                error={errors.name}
                            />
                            <TextInputField
                                name="description"
                                label="Description"
                                type="text"
                                placeholder="Description"
                                register={register}
                                registerOptions={{ required: "Required" }}
                                error={errors.description}
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
                            <Form.Group className="mb-3">
                                <Form.Label>Email Notifcation</Form.Label>
                                <Form.Select {...register("emailNotification")} aria-label="Email Notification Select">
                                    <option value="none">None</option>
                                    <option value="update_on_changes">Notify only on changes</option>
                                    <option value="update_on_scrape">Notify upon successful scrape</option>
                                </Form.Select>
                            </Form.Group>
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

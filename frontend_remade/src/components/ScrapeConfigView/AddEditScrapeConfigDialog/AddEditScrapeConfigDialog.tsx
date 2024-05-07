import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  SelectorTable,
  ScrapeConfig,
  ScrapeConfigInput,
} from "../../../models/scrapeConfig";
import * as Apis from "../../../network/apis";
import { fetchHtmlContent } from "../../../network/apis";
import { SelectorEditableTable } from "./SelectorEditableTable";
import { TextInputField } from "./TextInputField";
import { v4 as uuidv4 } from "uuid";

interface AddEditScrapeConfigProps {
  scrapeConfig?: ScrapeConfig;
  onDismiss: () => void;
  onScrapeConfigSaved: (scrapeConfig: ScrapeConfig) => void;
}

const AddEditScrapeConfigDialog = ({
  scrapeConfig,
  onDismiss,
  onScrapeConfigSaved,
}: AddEditScrapeConfigProps) => {
  const initializeSelectorsArray = (): SelectorTable[] => {
    let initialArr: SelectorTable[] = [];

    if (scrapeConfig?.selectorsMetadata) {
      for (const selector of scrapeConfig.selectorsMetadata) {
        initialArr.push({ ...selector, key: uuidv4() });
      }
    }

    initialArr.push({ key: uuidv4(), name: "", selectorValue: "", edit: true });

    return initialArr;
  };

  // ------ States -------
  const [iframeSrc, setIframeSrc] = useState("");
  const [selectorsArray, setSelectorsArray] = useState<SelectorTable[]>(
    initializeSelectorsArray()
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ScrapeConfigInput>({
    defaultValues: {
      name: scrapeConfig?.name || "",
      description: scrapeConfig?.description || "",
      url: scrapeConfig?.url || "",
      selectorsMetadata: selectorsArray.slice(0, -1),
      scrapeIntervalMinute: scrapeConfig?.scrapeIntervalMinute || 60,
      emailNotification: "none",
    },
  });

  const url = watch("url");

  // runs on change to url
  useEffect(() => {
    if (url) {
      fetchHtmlContent(url)
        .then((htmlContent) => {
          setIframeSrc(htmlContent);
        })
        .catch((error) => console.error("Error fetching HTML:", error));
    }
  }, [url]);

  async function onSubmit(input: ScrapeConfigInput) {
    const scrapeConfigPackage: ScrapeConfigInput = {
      ...input,
      selectorsMetadata: selectorsArray
        .slice(0, -1)
        .map(({ name, selectorValue }) => ({ name, selectorValue })),
    };

    console.log(scrapeConfigPackage);

    try {
      const scrapeConfigResponse = scrapeConfig
        ? await Apis.updateScrapeConfig(scrapeConfig._id, scrapeConfigPackage)
        : await Apis.createScrapeConfig(scrapeConfigPackage);

      console.log(scrapeConfigResponse);
      onScrapeConfigSaved(scrapeConfigResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "18px" }}>
          {scrapeConfig ? "Edit Configuration" : "Create Configuration"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "80vh",
          }}
        >
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <iframe
              srcDoc={iframeSrc}
              style={{ width: "100%", height: "100%" }}
            />
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
                registerOptions={{}}
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
                <Form.Label>Email Notification</Form.Label>
                <Form.Select
                  {...register("emailNotification")}
                  aria-label="Email Notification Select"
                >
                  <option value="none">None</option>
                  <option value="update_on_changes">
                    Notify only on changes
                  </option>
                  <option value="update_on_scrape">
                    Notify upon successful scrape
                  </option>
                </Form.Select>
              </Form.Group>
              <SelectorEditableTable
                selectorsArray={selectorsArray}
                setSelectorsArray={setSelectorsArray}
              />
              <Button
                style={{ margin: "20px 0" }}
                disabled={isSubmitting}
                variant="contained"
                type="submit"
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

export { AddEditScrapeConfigDialog };

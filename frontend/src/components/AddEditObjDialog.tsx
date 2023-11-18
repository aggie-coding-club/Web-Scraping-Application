import { Modal, Form, Button } from "react-bootstrap";
import { Obj } from "../models/object";
import { useForm } from "react-hook-form";
import { ObjInput } from "../network/objs_api";
import * as ObjApi from "../network/objs_api";
import TextInputField from "./form/TextInputField";

interface AddEditObjDialogProps {
  objToEdit?: Obj;
  onDismiss: () => void;
  onObjSaved: (obj: Obj) => void;
}

const AddEditObjDialog = ({
  objToEdit,
  onDismiss,
  onObjSaved,
}: AddEditObjDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ObjInput>({
    defaultValues: {
      title: objToEdit?.title || "",
      text: objToEdit?.text || "",
    },
  });

  async function onSubmit(input: ObjInput) {
    try {
      let objResponse: Obj;
      if (objToEdit) {
        objResponse = await ObjApi.updateObj(objToEdit._id, input);
      } else {
        objResponse = await ObjApi.createObj(input);
      }
      onObjSaved(objResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{objToEdit ? "Edit Obj" : "Add Obj"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="addEditObjForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Title"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />

          <TextInputField
            name="text"
            label="Text"
            as="textarea"
            rows={5}
            placeholder="Text"
            register={register}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button type="submit" form="addEditObjForm" disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditObjDialog;

import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/objs_api";
import * as ObjsApi from "../network/objs_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { useState } from "react";
import { ConflictError } from "../errors/http_errors";

interface SignUpModalProps {
  onDismiss: () => void;
  onSignUpSuccessful: (user: User) => void;
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const newUser = await ObjsApi.signUp(credentials);
      onSignUpSuccessful(newUser);
    } catch (error) {
      if (error instanceof ConflictError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.error(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            type="text"
            placeholder="Username"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.username}
          />
          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.email}
          />
          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styleUtils.width100}
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
            }}>
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;

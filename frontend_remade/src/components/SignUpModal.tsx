import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../models/signUpCredentials";
import * as ObjsApi from "../network/objs_api";
import { Alert, Form, Modal } from "react-bootstrap";
import TextInputField from "./ScrapeConfigView/AddEditScrapeConfigDialog/TextInputField";
import { useState } from "react";
import { ConflictError } from "../errors/http_errors";
import { Button } from "@mui/material";

interface SignUpModalProps {
  onDismiss: () => void;
  onSignUpSuccessful: (user: User) => void;
}

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
};

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
          <div style={buttonContainerStyle}>
            <Button disabled={isSubmitting} type="submit" variant="contained">
              Sign up
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;

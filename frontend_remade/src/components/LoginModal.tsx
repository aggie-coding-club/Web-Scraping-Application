import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Form, Modal } from "react-bootstrap";
import { User } from "../models/user";
import { LoginCredentials } from "../models/loginCredentials";
import * as ObjsApi from "../network/objs_api";
import TextInputField from "./ScrapeConfigView/AddEditScrapeConfigDialog/TextInputField";
import { UnauthorizedError } from "../errors/http_errors";
import Button from "@mui/material/Button";

interface LoginModalProps {
  onDismiss: () => void;
  onLoginSuccessful: (user: User) => void;
}

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
};

const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const user = await ObjsApi.login(credentials);
      onLoginSuccessful(user);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
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
        <Modal.Title>Log In</Modal.Title>
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
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />
          <div style={buttonContainerStyle}>
            <Button disabled={isSubmitting} variant="contained" type="submit">
              Log In
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;

import { Button } from "@mui/material";
import { useState } from "react";
import { Alert, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { UnauthorizedError } from "../errors/http_errors";
import { LoginCredentials } from "../models/loginCredentials";
import { User } from "../models/user";
import * as api from "../network/apis";
import { TextInputField } from "./ScrapeConfigView/AddEditScrapeConfigDialog/TextInputField";
import styleUtils from "../styles/utils.module.css";
import googleLogo from "../assets/google.svg";
import { supabase } from "../providers/supabaseClient";

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

  // Handle MongoDB based login
  async function onSubmit(credentials: LoginCredentials) {
    try {
      const user = await api.login(credentials);
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

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      setErrorText(error.message);
    } else {
      // You might want to handle the successful Google login here
      // For example, you could close the modal and/or refresh user data
      // This may involve fetching user data from your backend using the Supabase session info, if you're linking Supabase auth with your MongoDB users
    }
  };

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
          {/* Add a button for Google OAuth login */}
          <Button
            className={`${styleUtils.width100} mt-3 ${styleUtils.googlesignupbtn}`}
            onClick={handleGoogleLogin}
          >
            <img src={googleLogo} alt="Google" />
            Log In with Google
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export { LoginModal };

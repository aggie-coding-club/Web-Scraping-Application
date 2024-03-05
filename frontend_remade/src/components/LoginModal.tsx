import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Form, Modal } from "react-bootstrap";
import { User } from "../models/user";
import { LoginCredentials } from "../models/loginCredentials";
import * as ObjsApi from "../network/objs_api";
import TextInputField from "./ScrapeConfigView/AddEditScrapeConfigDialog/TextInputField";
import { UnauthorizedError } from "../errors/http_errors";
import MyButton from "./ui/MyButton";
import { supabase } from "../providers/supabaseClient";
import googleLogo from "../assets/google.svg";
import styleUtils from "../styles/utils.module.css";
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

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
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
          <MyButton className={styleUtils.width100} disabled={isSubmitting} type="submit">
            Log In
          </MyButton>
          {/* Add a button for Google OAuth login */}
          <MyButton className={`${styleUtils.width100} mt-3 ${styleUtils.googlesignupbtn}`} onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google" />
            Log In with Google
          </MyButton>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;

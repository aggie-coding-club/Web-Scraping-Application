import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { User } from "../models/user";
import { LoginCredentials } from "../models/loginCredentials";
import * as ObjsApi from "../network/objs_api";
import TextInputField from "./ScrapeConfigView/AddEditScrapeConfigDialog/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { UnauthorizedError } from "../errors/http_errors";

interface LoginModalProps {
    onDismiss: () => void;
    onLoginSuccessful: (user: User) => void;
}

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
                        }}
                    >
                        Log In
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;

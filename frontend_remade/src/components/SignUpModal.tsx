import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Form, Modal } from "react-bootstrap";
import { User } from "../models/user";
import { SignUpCredentials } from "../models/signUpCredentials";
import * as ObjsApi from "../network/objs_api";
import TextInputField from "./ScrapeConfigView/AddEditScrapeConfigDialog/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { ConflictError } from "../errors/http_errors";
import MyButton from "./ui/MyButton";
import { supabase } from "../providers/supabaseClient";
// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';
import googleLogo from "../assets/google.svg";
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
        setErrorText("Username or email already exists.");
      } else {
        setErrorText("An unexpected error occurred.");
        console.error(error);
      }
    }
  }

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  
    if (error) {
      setErrorText( error.message);
      console.log("Google Login Error");
      return;
    }
  
    // After a successful sign-in, retrieve the user details
    const { data: userData, error: userError } = await supabase.auth.getUser();
  
    if (userError) {
      setErrorText(userError.message);
      return;
    }
  
    // Ensure we have the user and their email is defined
    if (userData.user && userData.user.email) {
      // Extract user details
      // const userDetails = {
      //   email: userData.user.email,
      //   // Use 'full_name' from user_metadata if available
      //   fullName: userData.user.user_metadata.full_name,
      // };
  
      // Construct credentials for signing up or linking account
      // const credentials: SignUpCredentials = {
      //   username: userDetails.fullName || "DefaultUsername", // Fallback username if full name is not available
      //   email: userDetails.email,
      //   password: 'testing', // Password is not needed for OAuth users
      // };
  
      // Call your API to handle the sign-up / link account process
      try {
        // const newUser = await ObjsApi.signUp(credentials);
        // onSignUpSuccessful(newUser);
        // console.log(userData);
        console.log("Here");
      } catch (error) {
        if (error instanceof ConflictError) {
          setErrorText("Username or email already exists.");
        } else {
          setErrorText("An unexpected error occurred.");
          console.error(error);
        }
      }
    } else {
      setErrorText("Failed to retrieve user details from Google.");
    }
  };
  
  // FOR NORMAL LOGIN W/ SUPABASE IN CASE FULL SWITCH
  // useEffect(() => {
  //   const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (event === 'SIGNED_IN') {
  //       // Get user details from the session
  //       if( session){
  //       const { user } = session;
  //       console.log(user);
  //       const userDetails = {
  //         email: user.email,
  //         fullName: user.user_metadata.full_name || "DefaultUsername",
  //       };

  //       // Construct credentials to sign up in MongoDB
  //       const credentials = {
  //         username: userDetails.fullName || "DefaultUsername",
  //         email: userDetails.email ?? 'testingemail', // Provide a default value for email
  //         password: 'testing', // You might not need a password for OAuth users
  //       };

  //       try {
  //         // Call your API to handle the sign-up / link account process in MongoDB
  //         const newUser = await ObjsApi.signUp(credentials);
  //         onSignUpSuccessful(newUser);
  //       } catch (error) {
  //         // Handle any errors, such as conflicts or unexpected issues
  //         console.error(error);
  //       }
  //     }
  //     }
  //   });

  //   // Clean up the event listener when the component unmounts
  //   return () => authListener.subscription.unsubscribe();
  // }, [onSignUpSuccessful]);


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
            registerOptions={{ required: "Username is required" }}
            error={errors.username}
          />
          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            register={register}
            registerOptions={{ required: "Email is required" }}
            error={errors.email}
          />
          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            registerOptions={{ required: "Password is required" }}
            error={errors.password}
          />
          <MyButton disabled={isSubmitting} className={styleUtils.width100} onClick={handleSubmit(onSubmit)}>
            Sign Up
          </MyButton>
          <MyButton className={`${styleUtils.width100} mt-3 ${styleUtils.googlesignupbtn}`} onClick={handleGoogleSignUp}>
           <img src={googleLogo} alt="Google" />
            Sign Up with Google
          </MyButton>
        </Form>
        {/* // FOR NORMAL LOGIN W/ SUPABASE IN CASE FULL SWITCH */}
          {/* <Auth
          supabaseClient={supabase}
          providers={['google']}
          socialLayout="horizontal"
          // theme="dark"
          appearance={{ theme: ThemeSupa }}
        /> */}
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;

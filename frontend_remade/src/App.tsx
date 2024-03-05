import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { supabase } from "./providers/supabaseClient";
import * as ObjsApi from "./network/objs_api";

import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar/NavBar";
import SignUpModal from "./components/SignUpModal";
import { Sidebar } from "./components/Sidebar";

import ObjsPage from "./pages/ObjsPage";
import ExamplePage from "./pages/ExamplePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import OAuthCallback from './components/OAuthCallback';

import UserContext from "./providers/UserProvider";
import styles from "./styles/App.module.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e5085",
    },
    secondary: {
      main: "#5784e6",
    },
    warning: {
      main: "#ca110b",
    },
    success: {
      main: "#53BA4A",
    },
  },
  typography: {
    fontFamily: ["Inter"].join(","),
    button: {
      textTransform: "none",
    },
  },
});

function App() {
  const { setLoggedInUser } = useContext(UserContext);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("65px");

  const stylesContentWrapper = {
    marginLeft: sidebarWidth,
    transition: "margin-left 0.3s ease-in-out",
  };

  useEffect(() => {
    const newWidth = sidebarExpanded ? "300px" : "65px";
    setSidebarWidth(newWidth);
  }, [sidebarExpanded]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Get user details from the session
        if( session){
        const { user } = session;
        // console.log("Signed In", user); // Show the user for the session
        const userDetails = {
          email: user.email,
          fullName: `${user.user_metadata.full_name}_${user.user_metadata.provider_id}` || "DefaultUsername",
        };

        // Construct credentials to sign up in MongoDB
        const credentials = {
          username: userDetails.fullName || "DefaultUsername",
          email: userDetails.email ?? 'testingemail', // Provide a default value for email
          password: 'shashankmt', // You might not need a password for OAuth users
        };

        try {
          // Call your API to handle the sign-up / link account process in MongoDB
          const user = await ObjsApi.signUp(credentials);
          // console.log(user, "has signed up"); // SHow the user that signed up
          setLoggedInUser(user);
        } catch (error) {
            // If the sign up fails, check if it's because the user already exists
            if ((error as Error).message.includes('Username already in use.')) {
              // If the user already exists, try to log them in
              try {
                const credentialsForLogin = {
                  username: credentials.username,
                  password: credentials.password,
                };
                const user = await ObjsApi.login(credentialsForLogin);
                // console.log(user, "has logged in"); //Show User logged in
                setLoggedInUser(user);
              } catch (loginError) {
                // Handle any errors that occur during login
                console.error(loginError);
              }
            }else{
              console.error(error);
            }
        }
      }
      }
    });

    // Clean up the event listener when the component unmounts
    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className={styles.appContainer}>
          <Sidebar onToggle={setSidebarExpanded} />
          <NavBar
            onLoginClicked={() => setShowLoginModal(true)}
            onSignUpClicked={() => setShowSignUpModal(true)}
            onLogoutSuccessful={() => setLoggedInUser(null)}
            sidebarExpanded={sidebarExpanded}
          />
          <div className={styles.contentWrapper} style={stylesContentWrapper}>
            <div className={styles.mainContent}>
              <Routes>
                <Route path="/" element={<ObjsPage />} />
                <Route path="/example" element={<ExamplePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/*" element={<NotFoundPage />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />
            </Routes>
            </div>
          </div>
          {showSignUpModal && (
            <SignUpModal
              onDismiss={() => setShowSignUpModal(false)}
              onSignUpSuccessful={(user) => {
                setLoggedInUser(user);
                setShowSignUpModal(false);
              }}
            />
          )}
          {showLoginModal && (
            <LoginModal
              onDismiss={() => setShowLoginModal(false)}
              onLoginSuccessful={(user) => {
                setLoggedInUser(user);
                setShowLoginModal(false);
              }}
            />
          )}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

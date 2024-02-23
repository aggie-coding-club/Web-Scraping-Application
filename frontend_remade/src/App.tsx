import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

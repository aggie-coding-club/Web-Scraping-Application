import { useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as ObjsApi from "./network/objs_api";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ObjsPage from "./pages/ObjsPage";
import ExamplePage from "./pages/ExamplePage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css";
import { Sidebar } from "./components/Sidebar";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("65px");

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await ObjsApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const newWidth = sidebarExpanded ? "300px" : "65px";
    setSidebarWidth(newWidth);
  }, [sidebarExpanded]);

  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <Sidebar onToggle={setSidebarExpanded} />
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={() => setShowLoginModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => setLoggedInUser(null)}
          sidebarExpanded={sidebarExpanded}
        />

        <div
          className={styles.contentWrapper}
          style={{
            marginLeft: sidebarWidth,
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          <div className={styles.mainContent}>
            <Routes>
              <Route
                path="/"
                element={<ObjsPage loggedInUser={loggedInUser} />}
              />
              <Route path="/example" element={<ExamplePage />} />
              <Route path="/*" element={<NotFoundPage />} />
              {/* Add other routes as needed */}
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
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SignUpModal from "./components/SignUpModal";
import { Sidebar } from "./components/Sidebar";

import ObjsPage from "./pages/ObjsPage";
import ExamplePage from "./pages/ExamplePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

import { User } from "./models/user";
import { UserProvider } from "./providers/UserProvider";
import styles from "./styles/App.module.css";

function App() {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
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
        <UserProvider>
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
                    <div className={styles.contentWrapper} style={stylesContentWrapper}>
                        <div className={styles.mainContent}>
                            <Routes>
                                <Route path="/" element={<ObjsPage loggedInUser={loggedInUser} />} />
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
                    <Footer />
                </div>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;

import { useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useContext } from "react";
import UserContext from "../providers/UserProvider";

interface NavBarProps {
    onSignUpClicked: () => void;
    onLoginClicked: () => void;
    onLogoutSuccessful: () => void;
    sidebarExpanded: boolean;
}

const NavBar = ({ onSignUpClicked, onLoginClicked, onLogoutSuccessful, sidebarExpanded }: NavBarProps) => {
    const { loggedInUser } = useContext(UserContext);

    const navbarStyle = {
        marginLeft: sidebarExpanded ? "300px" : "0",
        transition: "margin-left 0.3s ease-in-out",
    };

    // useEffect hook to handle the scroll event
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector(".navbar.bg-primary");
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add("scrolled");
                } else {
                    navbar.classList.remove("scrolled");
                }
            }
        };

        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top" style={navbarStyle}>
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <p className="text-dark">Extractio - V2.0.1 - Desktop Only</p>
                </Navbar.Brand>
                {/* TODO: Fix color of text changing slightly while transition from sidebar opening/closing is running */}
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        {loggedInUser ? (
                            <NavBarLoggedInView onLogoutSuccessful={onLogoutSuccessful} />
                        ) : (
                            <NavBarLoggedOutView onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked} />
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;

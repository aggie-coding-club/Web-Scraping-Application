import React, { useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

interface NavBarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
  sidebarExpanded: boolean;
}

const NavBar = ({
  loggedInUser,
  onSignUpClicked,
  onLoginClicked,
  onLogoutSuccessful,
  sidebarExpanded,
}: NavBarProps) => {
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
    <Navbar
      bg="primary"
      variant="dark"
      expand="sm"
      sticky="top"
      style={navbarStyle}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Web Scraping Application
        </Navbar.Brand>
        {/* TODO: Fix color of text changing slightly while transition from sidebar opening/closing is running */}
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            {loggedInUser ? (
              <NavBarLoggedInView
                user={loggedInUser}
                onLogoutSuccessful={onLogoutSuccessful}
              />
            ) : (
              <NavBarLoggedOutView
                onLoginClicked={onLoginClicked}
                onSignUpClicked={onSignUpClicked}
              />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

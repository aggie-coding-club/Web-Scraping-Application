import React from 'react';
import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";
import '../styles/Navbar.css'

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
    marginLeft: sidebarExpanded ? '300px' : '0',
    transition: 'margin-left 0.3s ease-in-out'
  };

  return (
    <Navbar bg="primary" variant="dark" expand="sm" sticky="top" style={navbarStyle}>
      <Container>
        <Navbar.Brand as={Link} to="/" >Web Scraping Application</Navbar.Brand> {/* TODO: fix color of text changing slightly while transition from sidebar openening/closing is running */}
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

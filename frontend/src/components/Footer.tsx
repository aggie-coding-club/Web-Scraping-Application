import { Container, Nav, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <div>
      <Navbar bg="black" variant="dark" fixed="bottom">
        <Container>
          <Navbar.Brand href="/">Web Scraping Application</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/contact">Contact Us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default Footer;

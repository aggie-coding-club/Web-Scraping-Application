import "../../styles/Navbar.css";
import "../../styles/utils.module.css";
import Button from "@mui/material/Button";

interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}

const buttonStyle = {
  margin: "0 5px",
  width: "100px",
};

const NavBarLoggedOutView = ({
  onSignUpClicked,
  onLoginClicked,
}: NavBarLoggedOutViewProps) => {
  return (
    <>
      <Button onClick={onSignUpClicked} variant="contained" style={buttonStyle}>
        Sign up
      </Button>
      <Button
        onClick={onLoginClicked}
        variant="outlined"
        className="marginWidth5"
        style={buttonStyle}
      >
        Log In
      </Button>
    </>
  );
};

export default NavBarLoggedOutView;

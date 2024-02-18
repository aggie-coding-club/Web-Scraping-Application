import "../../styles/Navbar.css";
import "../../styles/utils.module.css";
import MyButton from "../ui/MyButton";

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
            <MyButton
                onClick={onSignUpClicked}
                variant="secondary"
                style={buttonStyle}
            >
                Sign up
            </MyButton>
            <MyButton
                onClick={onLoginClicked}
                variant="secondary"
                className="marginWidth5"
                style={buttonStyle}
            >
                Log In
            </MyButton>
        </>
    );
};

export default NavBarLoggedOutView;

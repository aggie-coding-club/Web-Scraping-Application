import { Button, Navbar } from "react-bootstrap";
import * as ObjsApi from "../network/objs_api";
import "../styles/Navbar.css";
import { useUserContext } from "../providers/UserProvider";

interface NavBarLoggedInViewProps {
    onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({ onLogoutSuccessful }: NavBarLoggedInViewProps) => {
    const { loggedInUser } = useUserContext();

    async function logout() {
        try {
            await ObjsApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <>
            <Navbar.Text className="navbar-username me-2">{loggedInUser.username}</Navbar.Text>
            <Button onClick={logout}>Log Out</Button>
        </>
    );
};

export default NavBarLoggedInView;

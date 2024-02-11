import { Button } from "react-bootstrap";
import * as ObjsApi from "../../network/objs_api";
import "../../styles/Navbar.css";

interface NavBarLoggedInViewProps {
    onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({ onLogoutSuccessful }: NavBarLoggedInViewProps) => {
    async function logout() {
        try {
            await ObjsApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return <Button onClick={logout}>Log Out</Button>;
};

export default NavBarLoggedInView;

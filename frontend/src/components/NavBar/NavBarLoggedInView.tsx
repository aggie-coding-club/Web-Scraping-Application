import * as api from "../../network/apis";
import "../../styles/Navbar.css";
import Button from "@mui/material/Button";

interface NavBarLoggedInViewProps {
  onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
  onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
  async function logout() {
    try {
      await api.logout();
      onLogoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Button onClick={logout} variant="outlined">
      Log Out
    </Button>
  );
};

export { NavBarLoggedInView };

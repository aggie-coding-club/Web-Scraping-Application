import * as ObjsApi from "../../network/objs_api";
import "../../styles/Navbar.css";
import MyButton from "../ui/MyButton";

interface NavBarLoggedInViewProps {
  onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
  onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
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
    <MyButton onClick={logout} variant="secondary">
      Log Out
    </MyButton>
  );
};

export default NavBarLoggedInView;

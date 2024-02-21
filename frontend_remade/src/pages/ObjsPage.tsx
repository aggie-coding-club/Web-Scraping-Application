import { Container } from "react-bootstrap";
import ScrapeConfigPage from "../components/ScrapeConfigView/ScrapeConfigPage";
import styles from "../styles/ObjsPage.module.css";
import UserContext from "../providers/UserProvider";
import { useContext } from "react";
import Home from "../components/Home";

interface ObjsPageProps {}

const ObjsPage = ({}: ObjsPageProps) => {
  const { loggedInUser } = useContext(UserContext);

  return (
    <Container className={styles.objsPage}>
      {loggedInUser ? <ScrapeConfigPage /> : <Home />}
    </Container>
  );
};

export default ObjsPage;

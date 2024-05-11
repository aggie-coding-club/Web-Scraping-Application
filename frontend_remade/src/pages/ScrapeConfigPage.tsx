import { useContext } from "react";
import { Container } from "react-bootstrap";
import { Home } from "../components/Home";
import { ScrapeConfigView } from "../components/ScrapeConfigView/ScrapeConfigView";
import { UserContext } from "../providers/UserProvider";
import styles from "../styles/ScrapeConfigPages.module.css";

interface ObjsPageProps {}

const ScrapeConfigPage = ({}: ObjsPageProps) => {
  const { loggedInUser } = useContext(UserContext);

  return (
    <Container className={styles.objsPage}>
      {loggedInUser ? <ScrapeConfigView /> : <Home />}
    </Container>
  );
};

export { ScrapeConfigPage };

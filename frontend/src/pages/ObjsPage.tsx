import { Container } from "react-bootstrap";
import ObjsPageLoggedInView from "../components/ObjsPageLoggedInView";
import ObjsPageLoggedOutView from "../components/ObjsPageLoggedOutView";
import { User } from "../models/user";
import styles from "../styles/ObjsPage.module.css";

interface ObjsPageProps {
  loggedInUser: User | null;
}

const ObjsPage = ({ loggedInUser }: ObjsPageProps) => {
  return (
    <Container className={styles.objsPage}>
      <>{loggedInUser ? <ObjsPageLoggedInView /> : <ObjsPageLoggedOutView />}</>
    </Container>
  );
};

export default ObjsPage;

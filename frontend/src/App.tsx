import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap"
import { Obj as ObjModel } from "./models/object";
import Obj from "./components/Obj";
import styles from "./styles/ObjsPage.module.css"

function App() {
  const [objs, setObjs] = useState<ObjModel[]>([]);

  useEffect(() => {
    async function loadObjs() {
      try {
        const response = await fetch("/api/notes", {
          method: "GET",
        }); // Proxy setup for localhost:5000, for local testing only
        const objs = await response.json();
        setObjs(objs);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadObjs();
  }, []);

  return (
    <Container>
      <Row xs={1} md={2} xl={3} className="g-4">
      {objs.map((obj) => (
        <Col key={obj._id}>
          <Obj obj={obj} className={styles.obj}/>
        </Col>
      ))}
      </Row>
    </Container>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { Obj as ObjsModel } from "../models/object";
import * as ObjsApi from "../network/apis";
import styles from "../styles/ObjsPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditObjDialog from "./AddEditObjDialog";
import Obj from "./Obj";

const ObjsPageLoggedInView = () => {
  const [objs, setObjs] = useState<ObjsModel[]>([]);
  const [objsLoading, setObjsLoading] = useState(true);
  const [showObjsLoadingError, setShowObjsLoadingError] = useState(false);

  const [showAddObjDialog, setShowAddObjDialog] = useState(false);
  const [objToEdit, setObjToEdit] = useState<ObjsModel | null>(null);

  useEffect(() => {
    async function loadObjs() {
      try {
        setShowObjsLoadingError(false);
        setObjsLoading(true);
        const objs = await ObjsApi.fetchObjs();
        setObjs(objs);
      } catch (error) {
        console.error(error);
        setShowObjsLoadingError(true);
      } finally {
        setObjsLoading(false);
      }
    }
    loadObjs();
  }, []);

  async function deleteObj(obj: ObjsModel) {
    try {
      await ObjsApi.deleteObj(obj._id);
      setObjs(objs.filter((existingObj) => existingObj._id !== obj._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const objsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.objsGrid}`}>
      {objs.map((obj) => (
        <Col key={obj._id}>
          <Obj
            obj={obj}
            className={styles.obj}
            onObjClicked={setObjToEdit}
            onDeleteObjClicked={deleteObj}
          />
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      <Button
        className={`m-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddObjDialog(true)}
        style={{
          backgroundColor: "#164863",
          transition: "background-color 0.3s",
          borderColor: "#427d9d",
          borderWidth: "1px",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.backgroundColor = "#9bbec8";
          e.currentTarget.style.borderColor = "#9bbec8";
          e.currentTarget.style.borderWidth = "2px";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.backgroundColor = "#427d9d";
          e.currentTarget.style.borderWidth = "1px";
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#427d9d";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#164863";
          e.currentTarget.style.borderWidth = "1px";
        }}
      >
        <AddIcon />
        Add new obj
      </Button>
      {objsLoading && <Spinner animation="border" variant="primary" />}
      {showObjsLoadingError && (
        <p>Something went wrong. Please refresh the page.</p>
      )}
      {!objsLoading && !showObjsLoadingError && (
        <>{objs.length > 0 ? objsGrid : <p>You don't have any objs yet</p>}</>
      )}
      {showAddObjDialog && (
        <AddEditObjDialog
          onDismiss={() => setShowAddObjDialog(false)}
          onObjSaved={(newObj) => {
            setObjs([...objs, newObj]);
            setShowAddObjDialog(false);
          }}
        />
      )}
      {objToEdit && (
        <AddEditObjDialog
          objToEdit={objToEdit}
          onDismiss={() => setObjToEdit(null)}
          onObjSaved={(updatedObj) => {
            setObjs(
              objs.map((existingObj) =>
                existingObj._id === updatedObj._id ? updatedObj : existingObj
              )
            );
            setObjToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default ObjsPageLoggedInView;

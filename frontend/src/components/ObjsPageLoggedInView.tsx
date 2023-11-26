import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Obj, Obj as ObjsModel } from "../models/object";
import * as ObjsApi from "../network/objs_api";
import styles from "../styles/ObjsPage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddEditObjDialog from "./AddEditObjDialog";

import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

const ObjsPageLoggedInView = () => {
    const [objs, setObjs] = useState<ObjsModel[]>([]);
    const [objsLoading, setObjsLoading] = useState(true);
    const [showObjsLoadingError, setShowObjsLoadingError] = useState(false);

    const [showAddObjDialog, setShowAddObjDialog] = useState(false);
    const [objToEdit, setObjToEdit] = useState<ObjsModel | null>(null);

    useEffect(() => {
        console.log(objs);
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
        console.log(objs);
        try {
            await ObjsApi.deleteObj(obj._id);
            setObjs(objs.filter((existingObj) => existingObj._id !== obj._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    // const objsGrid = (
    //     <Row xs={1} md={2} xl={3} className={`g-4 ${styles.objsGrid}`}>
    //         {objs.map((obj) => (
    //             <Col key={obj._id}>
    //                 <Obj obj={obj} className={styles.obj} onObjClicked={setObjToEdit} onDeleteObjClicked={deleteObj} />
    //             </Col>
    //         ))}
    //     </Row>
    // );

    const columns: ColumnsType<Obj> = [
        {
            title: "Website",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Text",
            dataIndex: "text",
            key: "text",
        },
        {
            title: "Action",
            key: "action",
            render: () => <a href="#">Edit</a>,
        },
        {
            title: "Action",
            key: "action",
            render: () => <a href="#">Delete</a>,
        },
    ];

    return (
        <>
            <Button
                className={`m-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                onClick={() => setShowAddObjDialog(true)}
            >
                <FaPlus />
                Add New Object
            </Button>
            {objsLoading && <Spinner animation="border" variant="primary" />}
            {showObjsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {/* {!objsLoading && !showObjsLoadingError && <>{objs.length > 0 ? objsGrid : <p>You don't have any objs yet</p>}</>} */}
            {!objsLoading && !showObjsLoadingError && <Table columns={columns} dataSource={objs} />}
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
                        setObjs(objs.map((existingObj) => (existingObj._id === updatedObj._id ? updatedObj : existingObj)));
                        setObjToEdit(null);
                    }}
                />
            )}
        </>
    );
};

export default ObjsPageLoggedInView;

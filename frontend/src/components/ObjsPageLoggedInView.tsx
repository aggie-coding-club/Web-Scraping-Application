import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Obj, Obj as ObjsModel } from "../models/object";
import * as ObjsApi from "../network/objs_api";
import styleUtils from "../styles/utils.module.css";
import AddEditObjDialog from "./AddEditObjDialog";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

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

    console.log(objs);

    const columns: ColumnsType<Obj> = [
        {
            title: "Website URL",
            dataIndex: "url",
            key: "url",
        },
        {
            title: "Scrape Parameters",
            dataIndex: "scrapeParameters",
            render: (scrapeParameters) => <pre>{JSON.stringify(scrapeParameters, null, 2)}</pre>,
        },
        {
            title: "Interval (min)",
            dataIndex: "scrapeIntervalMinute",
            key: "scrapeIntervalMinute",
            align: "center",
        },
        // {
        //     title: "Text",
        //     dataIndex: "text",
        //     key: "text",
        // },
        {
            title: "View",
            key: "view",
            render: (_, record) => (
                <>
                    <a className="text-secondary" href="#" onClick={() => ObjsApi.getObjScrapedData(record._id)}>
                        View
                    </a>
                </>
            ),
        },
        {
            title: "Edit",
            key: "edit",
            render: (_, record) => (
                <>
                    <a className="text-secondary" href="#" onClick={() => setObjToEdit(record)}>
                        Edit
                    </a>
                </>
            ),
        },
        {
            title: "Delete",
            key: "delete",
            render: (_, record) => (
                <a className="text-danger" href="#" onClick={() => deleteObj(record)}>
                    Delete
                </a>
            ),
        },
    ];

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
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#427d9d";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#164863";
                    e.currentTarget.style.borderWidth = "1px";
                }}
            >
                <FaPlus />
                Add New Object
            </Button>
            {objsLoading && <Spinner animation="border" variant="primary" />}
            {showObjsLoadingError && <p className="text-danger">Something went wrong. Please refresh the page.</p>}
            {!objsLoading && !showObjsLoadingError && <Table columns={columns} dataSource={objs} rowKey={(objs) => objs._id} />}
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
                        setShowAddObjDialog(false);
                    }}
                />
            )}
        </>
    );
};

export default ObjsPageLoggedInView;

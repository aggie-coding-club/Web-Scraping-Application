import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Obj, Obj as ObjsModel } from "../../models/object";
import * as ObjsApi from "../../network/objs_api";
import styleUtils from "../../styles/utils.module.css";
import AddEditObjDialog from "./AddEditObjDialog";
import ViewStringDialog from "./ViewStringDialog";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

const ObjsPageLoggedInView = () => {
    const [objs, setObjs] = useState<ObjsModel[]>([]);
    const [objsLoading, setObjsLoading] = useState(true);
    const [showObjsLoadingError, setShowObjsLoadingError] = useState(false);
    const [scrapeParametersArray, setScrapeParametersArray] = useState<any[]>([]);

    const [showAddObjDialog, setShowAddObjDialog] = useState(false);
    const [objToEdit, setObjToEdit] = useState<ObjsModel | null>(null);
    const [stringToView, setStringToView] = useState<string | null>(null);
    const [dataToView, setDataToView] = useState<any>(null);

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

    const columns: ColumnsType<Obj> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Website URL",
            dataIndex: "url",
            key: "url",
            render: (text) => (
                <a href={text} style={{ color: "#315c9d" }}>
                    {text}
                </a>
            ),
        },
        // {
        //     title: "Scrape Parameters",
        //     dataIndex: "scrapeParameters",
        //     render: (scrapeParameters) => <pre>{JSON.stringify(scrapeParameters, null, 2)}</pre>,
        // },
        {
            title: "Interval (min)",
            dataIndex: "scrapeIntervalMinute",
            key: "scrapeIntervalMinute",
            align: "center",
        },
        {
            title: "Parameters And Data",
            key: "select",
            render: (_, record, index) => (
                <>
                    <a
                        className="text-secondary"
                        href="#"
                        onClick={async () => {
                            const note = await ObjsApi.getObj(record._id);
                            setStringToView(
                                note.scrapedData.map((data: any) => JSON.stringify(data, null, 2)).join(",\n") ||
                                    "Nothing Yet. Please Check Back Later."
                            );
                            setDataToView(note.scrapedData);
                            setScrapeParametersArray(objs[index].scrapeParameters);
                        }}
                    >
                        Select
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
                Create Crawler Configuration
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
            {stringToView && (
                <ViewStringDialog
                    dataToView={dataToView}
                    stringToView={stringToView}
                    onDismiss={() => setStringToView(null)}
                    scrapeParametersArray={scrapeParametersArray}
                />
            )}
        </>
    );
};

export default ObjsPageLoggedInView;

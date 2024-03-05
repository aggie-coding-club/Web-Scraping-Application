import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Chip, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ScrapeConfig } from "../../models/scrapeConfig";
import * as ObjsApi from "../../network/objs_api";
import styleUtils from "../../styles/utils.module.css";
import AddEditObjDialog from "./AddEditScrapeConfigDialog/AddEditScrapeConfigDialog";
import ViewDataDialog from "./ViewDataDialog/ViewDataDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ScrapeConfigPage = () => {
  const [objs, setObjs] = useState<ScrapeConfig[]>([]);
  const [objsLoading, setObjsLoading] = useState(true);
  const [showObjsLoadingError, setShowObjsLoadingError] = useState(false);
  const [selectedScrapeConfig, setSelectedScrapeConfig] =
    useState<ScrapeConfig>();

  const [showAddObjDialog, setShowAddObjDialog] = useState(false);
  const [objToEdit, setObjToEdit] = useState<ScrapeConfig | null>(null);
  const [dataToView, setDataToView] = useState<any>(null);

  const theme = useTheme();
  const urlStyle = {
    color: theme.palette.secondary.main,
    fontWeight: 500,
  };
  const onSelectClick = async (record: ScrapeConfig, index: number) => {
    const note = await ObjsApi.getObj(record._id);
    setDataToView(note.scrapedData);
    setSelectedScrapeConfig(objs[index]);
  };

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

  async function deleteObj(obj: ScrapeConfig) {
    try {
      await ObjsApi.deleteObj(obj._id);
      setObjs(objs.filter((existingObj) => existingObj._id !== obj._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const columns: ColumnsType<ScrapeConfig> = [
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
      title: "Last Scrape",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (text) => {
        if (text === "success") {
          return (
            <Chip label="Finished" color="success" style={{ color: "white" }} />
          );
        } else if (text === "failed") {
          return <Chip label="Failed" color="warning" />;
        }
        return <Chip label="Pending" color="default" />;
      },
    },
    {
      title: "Website URL",
      dataIndex: "url",
      key: "url",
      render: (text) => (
        <a href={text} style={urlStyle}>
          {text}
        </a>
      ),
    },
    {
      title: "Last Changed",
      key: "lastChanged",
      dataIndex: "lastChanged",
      render: (text) => {
        return text ? new Date(text).toLocaleString() : "N/A";
      },
    },
    {
      title: "Interval (min)",
      dataIndex: "scrapeIntervalMinute",
      key: "scrapeIntervalMinute",
      align: "center",
    },
    {
      title: "View",
      key: "view",
      align: "center",
      render: (_, record, index) => (
        <IconButton onClick={() => onSelectClick(record, index)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      align: "center",
      render: (_, record) => (
        <IconButton onClick={() => setObjToEdit(record)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      align: "center",
      render: (_, record) => (
        <IconButton onClick={() => deleteObj(record)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Button
        className={`m-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddObjDialog(true)}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Configuration
      </Button>
      {objsLoading && <Spinner animation="border" variant="primary" />}
      {showObjsLoadingError && (
        <p className="text-danger">
          Something went wrong. Please refresh the page.
        </p>
      )}
      {!objsLoading && !showObjsLoadingError && (
        <Table
          style={{ border: "1px solid #e6e6e6" }}
          columns={columns}
          dataSource={objs}
          rowKey={(objs) => objs._id}
        />
      )}
      {showAddObjDialog && (
        <AddEditObjDialog
          onDismiss={() => setShowAddObjDialog(false)}
          onScrapeConfigSaved={(newObj) => {
            setObjs([...objs, newObj]);
            setShowAddObjDialog(false);
          }}
        />
      )}
      {objToEdit && (
        <AddEditObjDialog
          scrapeConfig={objToEdit}
          onDismiss={() => setObjToEdit(null)}
          onScrapeConfigSaved={(updatedObj) => {
            setObjs(
              objs.map((existingObj) =>
                existingObj._id === updatedObj._id ? updatedObj : existingObj
              )
            );
            setObjToEdit(null);
            setShowAddObjDialog(false);
          }}
        />
      )}
      {dataToView && (
        <ViewDataDialog
          scrapeConfig={selectedScrapeConfig!}
          dataToView={dataToView}
          onDismiss={() => setDataToView(null)}
          scrapeParametersArray={selectedScrapeConfig!.scrapeParameters}
        />
      )}
    </>
  );
};

export default ScrapeConfigPage;

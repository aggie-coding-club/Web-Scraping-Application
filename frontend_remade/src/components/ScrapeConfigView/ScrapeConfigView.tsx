import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ScrapeConfig } from "../../models/scrapeConfig";
import * as apis from "../../network/apis";
import styleUtils from "../../styles/utils.module.css";
import { AddEditScrapeConfigDialog } from "./AddEditScrapeConfigDialog/AddEditScrapeConfigDialog";
import { ViewDataDialog } from "./ViewDataDialog/ViewDataDialog";

const ScrapeConfigView = () => {
  const [scrapeConfigs, setScrapeConfigs] = useState<ScrapeConfig[]>([]);
  const [scrapeConfigsLoading, setScrapeConfigsLoading] = useState(true);
  const [showScrapeConfigsLoadingError, setShowScrapeConfigsLoadingError] =
    useState(false);
  const [selectedScrapeConfig, setSelectedScrapeConfig] =
    useState<ScrapeConfig>();

  const [showAddScrapeConfigDialog, setShowAddScrapeConfigDialog] =
    useState(false);
  const [scrapeConfigToEdit, setScrapeConfigToEdit] =
    useState<ScrapeConfig | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);

  const theme = useTheme();
  const urlStyle = {
    color: theme.palette.secondary.main,
    fontWeight: 500,
  };
  const onView = async (record: ScrapeConfig) => {
    setSelectedScrapeConfig(record);
    setOpenViewDialog(true);
  };

  useEffect(() => {
    async function loadScrapeConfigs() {
      try {
        setShowScrapeConfigsLoadingError(false);
        setScrapeConfigsLoading(true);
        const scrapeConfigs = await apis.getScrapingConfigs();
        setScrapeConfigs(scrapeConfigs);
      } catch (error) {
        console.error(error);
        setShowScrapeConfigsLoadingError(true);
      } finally {
        setScrapeConfigsLoading(false);
      }
    }
    loadScrapeConfigs();
  }, []);

  async function deleteScrapeConfig(scrapeConfig: ScrapeConfig) {
    try {
      await apis.deleteScrapeConfig(scrapeConfig._id);
      setScrapeConfigs(
        scrapeConfigs.filter(
          (existingScrapeConfig) =>
            existingScrapeConfig._id !== scrapeConfig._id
        )
      );
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
        let backgroundColor;
        let label;

        if (text === "success") {
          backgroundColor = theme.palette.primary.main;
          label = "Finished";
        } else if (text === "failed") {
          backgroundColor = theme.palette.warning.main;
          label = "Failed";
        } else {
          backgroundColor = "gray";
          label = "Pending";
        }

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            <div
              style={{
                borderRadius: "50%",
                width: "12px",
                height: "12px",
                color: "white",
                backgroundColor,
              }}
            ></div>
            <div>{label}</div>
          </div>
        );
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
        <IconButton onClick={() => onView(record, index)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      align: "center",
      render: (_, record) => (
        <IconButton onClick={() => setScrapeConfigToEdit(record)}>
          <SettingsIcon />
        </IconButton>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      align: "center",
      render: (_, record) => (
        <IconButton onClick={() => deleteScrapeConfig(record)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Button
        className={`m-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddScrapeConfigDialog(true)}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Configuration
      </Button>
      {scrapeConfigsLoading && <Spinner animation="border" variant="primary" />}
      {showScrapeConfigsLoadingError && (
        <p className="text-danger">
          Something went wrong. Please refresh the page.
        </p>
      )}
      {!scrapeConfigsLoading && !showScrapeConfigsLoadingError && (
        <Table
          style={{ border: "1px solid #e6e6e6" }}
          columns={columns}
          dataSource={scrapeConfigs}
          rowKey={(scrapeConfigs) => scrapeConfigs._id}
        />
      )}
      {showAddScrapeConfigDialog && (
        <AddEditScrapeConfigDialog
          onDismiss={() => setShowAddScrapeConfigDialog(false)}
          onScrapeConfigSaved={(newScrapeConfig) => {
            setScrapeConfigs([...scrapeConfigs, newScrapeConfig]);
            setShowAddScrapeConfigDialog(false);
          }}
        />
      )}
      {scrapeConfigToEdit && (
        <AddEditScrapeConfigDialog
          scrapeConfig={scrapeConfigToEdit}
          onDismiss={() => setScrapeConfigToEdit(null)}
          onScrapeConfigSaved={(updatedScrapeConfig) => {
            setScrapeConfigs(
              scrapeConfigs.map((existingScrapeConfig) =>
                existingScrapeConfig._id === updatedScrapeConfig._id
                  ? updatedScrapeConfig
                  : existingScrapeConfig
              )
            );
            setScrapeConfigToEdit(null);
            setShowAddScrapeConfigDialog(false);
          }}
        />
      )}
      <ViewDataDialog
        scrapeConfig={selectedScrapeConfig!}
        openViewDialog={openViewDialog}
        setOpenViewDialog={setOpenViewDialog}
      />
    </>
  );
};

export { ScrapeConfigView };

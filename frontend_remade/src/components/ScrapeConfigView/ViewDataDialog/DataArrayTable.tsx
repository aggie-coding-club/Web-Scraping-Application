import Table, { ColumnsType } from "antd/es/table";
import { Button } from "@mui/material";

interface DataArrayTableProps {
  dataSource: any;
  setIndex: (index: number) => void;
}

const DataArrayTable = ({ dataSource, setIndex }: DataArrayTableProps) => {
  const columns: ColumnsType<any> = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => {
        return new Date(text).toLocaleString();
      },
    },
    {
      title: "Data",
      key: "select",
      render: (_, __, index) => (
        <Button variant="outlined" onClick={() => setIndex(index)}>
          Select
        </Button>
      ),
    },
  ];

  return <Table rowKey="timestamp" dataSource={dataSource} columns={columns} />;
};

export { DataArrayTable };

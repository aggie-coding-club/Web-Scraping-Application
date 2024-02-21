import Table, { ColumnsType } from "antd/es/table";

interface DataTableProps {
  dataSource: any;
}

const DataTable = ({ dataSource }: DataTableProps) => {
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Selector",
      dataIndex: "value",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Content",
      dataIndex: "content",
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default DataTable;

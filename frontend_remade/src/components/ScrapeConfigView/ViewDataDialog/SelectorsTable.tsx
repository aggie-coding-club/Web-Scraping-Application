import Table, { ColumnsType } from "antd/es/table";

interface SelectorsTableProps {
  dataSource: any;
}

const SelectorsTable = ({ dataSource }: SelectorsTableProps) => {
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Selector",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return <Table rowKey="id" dataSource={dataSource} columns={columns} />;
};

export default SelectorsTable;

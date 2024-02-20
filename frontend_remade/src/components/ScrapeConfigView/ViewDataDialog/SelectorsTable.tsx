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
        },
        {
            title: "Description",
            dataIndex: "description",
        },
    ];

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
        />
    );
};

export default SelectorsTable;

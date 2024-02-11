import { Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

const EditableTable = () => {
    const dataSource = [
        {
            key: "1",
            name: "Mike",
            tag: "#mike",
            description: 32,
        },
        {
            key: "2",
            name: "John",
            tag: "#john",
            description: 42,
        },
        {
            key: "3",
            name: "John",
            tag: "#john",
            description: 42,
        },
        {
            key: "4",
            name: "John",
            tag: "#john",
            description: 42,
        },
        {
            key: "5",
            name: "John",
            tag: "#john",
            description: 42,
        },
    ];

    const columns: ColumnsType<any> = [
        {
            title: "Parameter Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <Input defaultValue={text} />,
        },
        {
            title: "Tag",
            dataIndex: "tag",
            render: (text) => <Input defaultValue={text} />,
        },
        {
            title: "Description",
            dataIndex: "description",
            render: (text) => <Input defaultValue={text} />,
        },
        {
            title: "Operation",
            key: "operation",
            render: (_, __, index) => {
                return index === dataSource.length - 1 ? (
                    <a className="text-success" href="#" onClick={() => {}}>
                        Add
                    </a>
                ) : (
                    <a className="text-danger" href="#" onClick={() => {}}>
                        Delete
                    </a>
                );
            },
        },
    ];

    return <Table dataSource={dataSource} columns={columns} />;
};

export default EditableTable;

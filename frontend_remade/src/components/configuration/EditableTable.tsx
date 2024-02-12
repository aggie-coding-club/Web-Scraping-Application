import { Input } from "antd";
import Table, { ColumnsType } from "antd/es/table";

interface EditableTableProps {
    scrapeParametersArray: any[];
    setScrapeParametersArray: React.Dispatch<React.SetStateAction<any[]>>;
}

const EditableTable = ({ scrapeParametersArray, setScrapeParametersArray }: EditableTableProps) => {
    const columns: ColumnsType<any> = [
        {
            title: "Parameter Name",
            dataIndex: "name",
            key: "name",
            render: (text, _, index) => (
                <Input
                    defaultValue={text}
                    onChange={(event) => {
                        setScrapeParametersArray(
                            scrapeParametersArray.map((item, idx) => (idx === index ? { ...item, name: event.target.value } : item))
                        );
                    }}
                />
            ),
        },
        {
            title: "Tag",
            dataIndex: "tag",
            render: (text, _, index) => (
                <Input
                    defaultValue={text}
                    onChange={(event) => {
                        setScrapeParametersArray(
                            scrapeParametersArray.map((item, idx) => (idx === index ? { ...item, tag: event.target.value } : item))
                        );
                    }}
                />
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            render: (text, _, index) => (
                <Input
                    defaultValue={text}
                    onChange={(event) => {
                        setScrapeParametersArray(
                            scrapeParametersArray.map((item, idx) => (idx === index ? { ...item, description: event.target.value } : item))
                        );
                    }}
                />
            ),
        },
        {
            title: "Operation",
            key: "operation",
            render: (_, __, index) => {
                return index === scrapeParametersArray.length - 1 ? (
                    <a
                        className="text-success"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            const lastElement = scrapeParametersArray[scrapeParametersArray.length - 1];
                            if (!lastElement.name || !lastElement.tag) {
                                return;
                            }
                            setScrapeParametersArray([...scrapeParametersArray, { key: index + 1, name: "", tag: "", description: "" }]);
                        }}
                    >
                        Add
                    </a>
                ) : (
                    <a
                        className="text-danger"
                        href="#"
                        onClick={() => {
                            setScrapeParametersArray((prevArray) => [...prevArray.slice(0, index), ...prevArray.slice(index + 1)]);
                        }}
                    >
                        Delete
                    </a>
                );
            },
        },
    ];

    return <Table dataSource={scrapeParametersArray} columns={columns} />;
};

export default EditableTable;

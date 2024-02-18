import { Input } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { v4 as uuidv4 } from "uuid";

interface SelectorEditableTableProps {
    scrapeParametersArray: any[];
    setScrapeParametersArray: React.Dispatch<React.SetStateAction<any[]>>;
}

const SelectorEditableTable = ({
    scrapeParametersArray,
    setScrapeParametersArray,
}: SelectorEditableTableProps) => {
    const columns: ColumnsType<any> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, _, index) => (
                <Input
                    defaultValue={text}
                    onChange={(event) => {
                        setScrapeParametersArray(
                            scrapeParametersArray.map((item, idx) =>
                                idx === index
                                    ? { ...item, name: event.target.value }
                                    : item
                            )
                        );
                    }}
                />
            ),
        },
        {
            title: "Selector",
            dataIndex: "value",
            render: (text, _, index) => (
                <Input
                    defaultValue={text}
                    onChange={(event) => {
                        setScrapeParametersArray(
                            scrapeParametersArray.map((item, idx) =>
                                idx === index
                                    ? { ...item, value: event.target.value }
                                    : item
                            )
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
                            scrapeParametersArray.map((item, idx) =>
                                idx === index
                                    ? {
                                          ...item,
                                          description: event.target.value,
                                      }
                                    : item
                            )
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
                            const lastElement =
                                scrapeParametersArray[
                                    scrapeParametersArray.length - 1
                                ];
                            if (!lastElement.name || !lastElement.value) {
                                return;
                            }
                            setScrapeParametersArray([
                                ...scrapeParametersArray,
                                {
                                    id: uuidv4(),
                                    name: "",
                                    value: "",
                                    description: "",
                                },
                            ]);
                        }}
                    >
                        Add
                    </a>
                ) : (
                    <a
                        className="text-danger"
                        href="#"
                        onClick={() => {
                            setScrapeParametersArray((prevArray) => [
                                ...prevArray.slice(0, index),
                                ...prevArray.slice(index + 1),
                            ]);
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

export { SelectorEditableTable };

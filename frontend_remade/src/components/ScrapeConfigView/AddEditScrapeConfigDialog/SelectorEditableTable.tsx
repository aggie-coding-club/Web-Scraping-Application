import { Input } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { v4 as uuidv4 } from "uuid";

interface SelectorEditableTableProps {
  scrapeParametersArray: any[];
  setScrapeParametersArray: React.Dispatch<React.SetStateAction<any[]>>;
}

interface onChangeProps {
  event: React.ChangeEvent<HTMLInputElement>;
  index: number;
}

const SelectorEditableTable = ({
  scrapeParametersArray,
  setScrapeParametersArray,
}: SelectorEditableTableProps) => {
  // input change functions
  const onSelectorInputChange = ({ event, index }: onChangeProps) => {
    console.log("selector input change", scrapeParametersArray);
    setScrapeParametersArray(
      scrapeParametersArray.map((item, idx) =>
        idx === index ? { ...item, value: event.target.value } : item
      )
    );
  };

  const onNameInputChange = ({ event, index }: onChangeProps) => {
    console.log("name input change");
    setScrapeParametersArray(
      scrapeParametersArray.map((item, idx) =>
        idx === index ? { ...item, name: event.target.value } : item
      )
    );
  };

  const onDescriptionChange = ({ event, index }: onChangeProps) => {
    console.log("description input change");
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
  };

  // onAction
  const onAdd = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    console.log("adding, or so you thought");
    e.preventDefault();
    const lastElement = scrapeParametersArray[scrapeParametersArray.length - 1];
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
  };

  const onDelete = (index: number) => {
    setScrapeParametersArray((prevArray) => [
      ...prevArray.slice(0, index),
      ...prevArray.slice(index + 1),
    ]);
  };
  const columns: ColumnsType<any> = [
    {
      title: "Selector",
      dataIndex: "value",

      render: (text, _, index) => (
        <Input
          defaultValue={text}
          placeholder="span#video-title"
          onChange={(event) => onSelectorInputChange({ event, index })}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, _, index) => (
        <Input
          defaultValue={text}
          placeholder="Title of Video"
          onChange={(event) => onNameInputChange({ event, index })}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, _, index) => (
        <Input
          placeholder="(optional)"
          defaultValue={text}
          onChange={(event) => onDescriptionChange({ event, index })}
        />
      ),
    },
    {
      title: "Operation",
      key: "operation",
      render: (_, __, index) => {
        return index === scrapeParametersArray.length - 1 ? (
          <a className="text-success" href="#" onClick={(e) => onAdd(e)}>
            Add
          </a>
        ) : (
          <a className="text-danger" href="#" onClick={() => onDelete(index)}>
            Delete
          </a>
        );
      },
    },
  ];

  return <Table dataSource={scrapeParametersArray} columns={columns} />;
};

export { SelectorEditableTable };

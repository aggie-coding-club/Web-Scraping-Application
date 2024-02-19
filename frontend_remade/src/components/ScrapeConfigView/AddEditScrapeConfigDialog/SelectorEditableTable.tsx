import { Input } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { v4 as uuidv4 } from "uuid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";

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
  const onAdd = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    const element = scrapeParametersArray[index];
    if (!element.name || !element.value) {
      return;
    }

    let newArr = [...scrapeParametersArray];
    newArr[index].edit = false;

    // if last element add new empty table column
    if (index == scrapeParametersArray.length - 1) {
      newArr.push({
        id: uuidv4(),
        name: "",
        value: "",
        description: "",
        edit: true,
      });
    }

    setScrapeParametersArray(newArr);
  };

  const onEdit = (index: number) => {
    let newArr = [...scrapeParametersArray];
    newArr[index].edit = true;

    setScrapeParametersArray(newArr);
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

      render: (text, _, index) =>
        scrapeParametersArray[index].edit ? (
          <Input
            defaultValue={text}
            placeholder="span#video-title"
            onChange={(event) => onSelectorInputChange({ event, index })}
          />
        ) : (
          <div>{text}</div>
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, _, index) =>
        scrapeParametersArray[index].edit ? (
          <Input
            defaultValue={text}
            placeholder="Title of Video"
            onChange={(event) => onNameInputChange({ event, index })}
          />
        ) : (
          <div>{text}</div>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, _, index) =>
        scrapeParametersArray[index].edit ? (
          <Input
            placeholder="(optional)"
            defaultValue={text}
            onChange={(event) => onDescriptionChange({ event, index })}
          />
        ) : (
          <div>{text}</div>
        ),
    },
    {
      title: "Operation",
      key: "operation",
      render: (_, __, index) => {
        return scrapeParametersArray[index].edit ? (
          <Tooltip title="Add" arrow>
            <IconButton onClick={(e) => onAdd(e, index)} color="secondary">
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <div>
            <Tooltip title="Edit" arrow>
              <IconButton onClick={() => onEdit(index)} color="secondary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton onClick={() => onDelete(index)} color="error">
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return <Table dataSource={scrapeParametersArray} columns={columns} />;
};

export { SelectorEditableTable };

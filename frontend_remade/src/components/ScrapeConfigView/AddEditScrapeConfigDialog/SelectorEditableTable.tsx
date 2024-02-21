import { useEffect } from "react";
import { Input } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { scrapeParameterInterface } from "../../../models/scrapeConfig";
import { v4 as uuidv4 } from "uuid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { ButtonGroup, IconButton, Tooltip } from "@mui/material";

interface SelectorEditableTableProps {
  scrapeParametersArray: scrapeParameterInterface[];
  setScrapeParametersArray: React.Dispatch<
    React.SetStateAction<scrapeParameterInterface[]>
  >;
}

interface onChangeProps {
  event: React.ChangeEvent<HTMLInputElement>;
  index: number;
}

const SelectorEditableTable = ({
  scrapeParametersArray,
  setScrapeParametersArray,
}: SelectorEditableTableProps) => {
  // ---- Input Change Functions -----

  // update selector value if click on window
  useEffect(() => {
    const receiveMessage = (event: any) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data.selector) {
        // set selector value at end of array
        let myArr: scrapeParameterInterface[] = [...scrapeParametersArray];
        myArr[myArr.length - 1].value = event.data.selector;
        setScrapeParametersArray([...myArr]);
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [scrapeParametersArray]);

  const onSelectorInputChange = ({ event, index }: onChangeProps) => {
    setScrapeParametersArray(
      scrapeParametersArray.map((item, idx) =>
        idx === index ? { ...item, value: event.target.value } : item
      )
    );
  };

  const onNameInputChange = ({ event, index }: onChangeProps) => {
    setScrapeParametersArray(
      scrapeParametersArray.map((item, idx) =>
        idx === index ? { ...item, name: event.target.value } : item
      )
    );
  };

  const onDescriptionChange = ({ event, index }: onChangeProps) => {
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

    let newArr: scrapeParameterInterface[] = [...scrapeParametersArray];

    delete newArr[index].edit; // remove edit field to make it like Selector field

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
            value={text}
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
              <AddCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <ButtonGroup orientation="horizontal" size="small">
            <Tooltip title="Edit" arrow>
              <IconButton onClick={() => onEdit(index)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton onClick={() => onDelete(index)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        );
      },
    },
  ];

  return <Table dataSource={scrapeParametersArray} columns={columns} />;
};

export { SelectorEditableTable };

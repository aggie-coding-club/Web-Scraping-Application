import { useEffect, useState } from "react";
import { Input } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { SelectorTable } from "../../../models/scrapeConfig";
import { v4 as uuidv4 } from "uuid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { ButtonGroup, IconButton, Tooltip } from "@mui/material";
import { DeleteAlertDialog } from "./DeleteAlertDialog";

interface SelectorEditableTableProps {
  selectorsArray: SelectorTable[];
  setSelectorsArray: React.Dispatch<React.SetStateAction<SelectorTable[]>>;
}

interface onChangeProps {
  event: React.ChangeEvent<HTMLInputElement>;
  index: number;
}

const SelectorEditableTable = ({
  selectorsArray,
  setSelectorsArray,
}: SelectorEditableTableProps) => {
  // ---- State -----
  const [nameError, setNameError] = useState<boolean>(false);
  const [selectorError, setSelectorError] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [rowToDelete, setRowToDelete] = useState<SelectorTable>();

  // ---- Input Change Functions -----

  // update selector value if click on window
  useEffect(() => {
    const receiveMessage = (event: any) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data.selector) {
        // set selector value at end of array
        let myArr: SelectorTable[] = [...selectorsArray];
        myArr[myArr.length - 1].selectorValue = event.data.selector;
        setSelectorsArray([...myArr]);
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [selectorsArray]);

  const onSelectorInputChange = ({ event, index }: onChangeProps) => {
    if (selectorError) setSelectorError(false);

    setSelectorsArray(
      selectorsArray.map((item, idx) =>
        idx === index ? { ...item, selectorValue: event.target.value } : item
      )
    );
  };

  const onNameInputChange = ({ event, index }: onChangeProps) => {
    if (nameError) setNameError(false);

    setSelectorsArray(
      selectorsArray.map((item, idx) =>
        idx === index ? { ...item, name: event.target.value } : item
      )
    );
  };

  // onAction
  const onAdd = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    const element = selectorsArray[index];
    if (!element.name || !element.selectorValue) {
      if (!element.name) {
        setNameError(true);
      }

      if (!element.selectorValue) {
        setSelectorError(true);
      }
      return;
    }

    let newArr: SelectorTable[] = [...selectorsArray];

    delete newArr[index].edit; // remove edit field to make it like Selector field

    // if last element add new empty table column
    if (index == selectorsArray.length - 1) {
      newArr.push({
        key: uuidv4(),
        name: "",
        selectorValue: "",
        edit: true,
      });
    }

    setSelectorsArray(newArr);
  };

  const onEdit = (index: number) => {
    let newArr = [...selectorsArray];
    newArr[index].edit = true;

    setSelectorsArray(newArr);
  };

  const onDelete = (index: number) => {
    setRowToDelete(selectorsArray[index]);
    setOpenDialog(true);
  };

  /**
   *
   * @param isDeleteConfirmed true if the delete has been confirmed, false if the delete process was cancelled
   * @returns
   */
  const handleCloseDeleteDialog = (isDeleteConfirmed: boolean) => {
    setOpenDialog(false);

    if (!isDeleteConfirmed) {
      return;
    }

    if (!rowToDelete) {
      console.log("[ERROR] Row to Delete Undefined");
      return;
    }

    // Call API to delete Selector

    const newArr = selectorsArray.filter(
      (selector) => selector.key != rowToDelete.key
    );

    setSelectorsArray([...newArr]);
  };
  const columns: ColumnsType<any> = [
    {
      title: "Selector",
      dataIndex: "selectorValue",
      key: "selectorValue",
      render: (text, _, index) =>
        selectorsArray[index].edit ? (
          <Input
            defaultValue={text}
            value={text}
            placeholder="span#video-title"
            status={selectorError ? "error" : ""}
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
        selectorsArray[index].edit ? (
          <Input
            defaultValue={text}
            placeholder="Title of Video"
            status={nameError ? "error" : ""}
            onChange={(event) => onNameInputChange({ event, index })}
          />
        ) : (
          <div>{text}</div>
        ),
    },
    {
      title: "Operation",
      key: "operation",
      render: (_, __, index) => {
        return selectorsArray[index].edit ? (
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

  return (
    <>
      <Table
        dataSource={selectorsArray}
        columns={columns}
        size="small"
        pagination={false}
        rowKey="value"
      />
      <DeleteAlertDialog
        openDialog={openDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        rowToDelete={rowToDelete}
      />
    </>
  );
};

export { SelectorEditableTable };

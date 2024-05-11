import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { SelectorTable } from "../../../models/scrapeConfig";

interface DeleteAlertDialogProps {
  openDialog: boolean;
  handleCloseDeleteDialog: (isDeleteConfirmed: boolean) => void;
  rowToDelete: SelectorTable | undefined;
}

const DeleteAlertDialog = ({
  openDialog,
  handleCloseDeleteDialog,
  rowToDelete,
}: DeleteAlertDialogProps) => {
  if (openDialog && rowToDelete == undefined) {
    console.log("[ERROR] Row to Delete Undefined");
    handleCloseDeleteDialog(false);
    return <></>;
  }

  if (!rowToDelete) return <></>;

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => handleCloseDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete selector ${rowToDelete.name}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This and all associated data will be deleted with it
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDeleteDialog(true)}>Confirm</Button>
          <Button
            onClick={() => handleCloseDeleteDialog(false)}
            autoFocus
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { DeleteAlertDialog };

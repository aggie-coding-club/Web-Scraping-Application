import { Chip } from "@mui/material";
import { statusStates } from "../models/scrapeConfig";

interface MyChipProps {
  status: string;
  label: string;
}

const MyChip = ({ status, label }: MyChipProps) => {
  const chipStyle = {
    height: "20px",
    fontWeight: 500,
    margin: "0 5px",
    lineHeight: "10px",
  };

  if (status == statusStates.success) {
    return (
      <Chip
        label={label}
        color="success"
        sx={{ color: "white", ...chipStyle }}
      />
    );
  } else if (status == statusStates.pending) {
    return (
      <Chip label={label} color="primary" variant="outlined" sx={chipStyle} />
    );
  } else if (status == statusStates.failed) {
    return <Chip label={label} color="error" variant="filled" sx={chipStyle} />;
  }

  return <Chip label={label} sx={chipStyle} />;
};

export { MyChip };

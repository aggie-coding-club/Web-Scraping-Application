import styles from "../styles/Obj.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Obj as ObjModel } from "../../models/object";
import { formatDate } from "../../utils/formatDate";
import DeleteIcon from "@mui/icons-material/Delete";

interface ObjProps {
  obj: ObjModel;
  onObjClicked: (obj: ObjModel) => void;
  onDeleteObjClicked: (obj: ObjModel) => void;
  className?: string;
}

const Obj = ({
  obj,
  onObjClicked,
  onDeleteObjClicked,
  className,
}: ObjProps) => {
  const { url, text, createdAt, updatedAt } = obj;

  // will be run at every render, formatDate is a computationally cheap function but can utilize something like useEffect for later optimization
  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = "Updated: " + formatDate(updatedAt);
  } else {
    createdUpdatedText = "Created: " + formatDate(createdAt);
  }

  return (
    <Card
      className={`${styles.objCard} ${className}`}
      onClick={() => onObjClicked(obj)}
    >
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styleUtils.flexCenter}>
          {url}
          <DeleteIcon
            className="text-muted ms-auto"
            onClick={(e: React.MouseEvent) => {
              onDeleteObjClicked(obj);
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
    </Card>
  );
};

export default Obj;

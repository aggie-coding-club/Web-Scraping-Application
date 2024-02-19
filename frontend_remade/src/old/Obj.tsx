import styles from "../styles/Obj.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { formatDate } from "../../utils/formatDate";
import { MdDelete } from "react-icons/md";
import { ScrapeConfig } from "../../models/scrapeConfig";

interface ObjProps {
  scrapeConfig: ScrapeConfig;
  onObjClicked: (obj: ScrapeConfig) => void;
  onDeleteObjClicked: (obj: ScrapeConfig) => void;
  className?: string;
}

const Obj = ({
  scrapeConfig,
  onObjClicked,
  onDeleteObjClicked,
  className,
}: ObjProps) => {
  const { url, text, createdAt, updatedAt } = scrapeConfig;

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
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e: React.MouseEvent) => {
              onDeleteObjClicked(obj);
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Text className={styles.cardText}>{'text'}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
    </Card>
  );
};

export default Obj;

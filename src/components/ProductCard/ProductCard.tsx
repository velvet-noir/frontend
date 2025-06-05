import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import cardImage from "../../assets/no_image.png";

interface ProductCardProps {
  id: number;
  name: string;
  image: string | null;
  mini_description: string;
  price: string;
}

function ProductCard({
  id,
  name,
  image,
  mini_description,
  price,
}: ProductCardProps) {
  const imageUrl = image ? image : cardImage;

  return (
    <Card className={styles.card}>
      <Card.Img variant="top" src={imageUrl} alt={name} />
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styles.title}>{name}</Card.Title>
        <Card.Text className={styles.description}>{mini_description}</Card.Text>
        <div className={styles.cardFooter}>
          <Card.Text className={styles.price}>{price} ₽ / месяц</Card.Text>
          <Link to={`/product/${id}`}>
            <Button variant="primary" className={styles.button}>
              Подробнее
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;

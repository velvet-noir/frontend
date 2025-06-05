import styles from "./ProductPage.module.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { fetchServiceById } from "../../api/services";
import cardImage from "../../assets/no_image.png";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";

interface Specification {
  id: number;
  description: string;
  processor: string;
  ram: string;
  disk: string;
  internet_speed: string;
  service: number;
}

interface Product {
  pk: number;
  name: string;
  image: string;
  mini_description: string;
  price: string;
  is_active: boolean;
  specifications: Specification[];
}

function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSpecs, setShowSpecs] = useState(false);

  useEffect(() => {
    if (id) {
      fetchServiceById(id)
        .then((data) => {
          setProduct(data.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p></p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!product) return <p>Данные не найдены</p>;

  const imageUrl = product.image || cardImage;
  const spec = product.specifications[0];

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.productCard}>
        <Link to="/" className={styles.backButton}>
          ← Назад
        </Link>
        <div className={styles.imageTitleWrapper}>
          <Card.Img variant="top" src={imageUrl} alt={product.name} />
          <Card.Title className={styles.title}>{product.name}</Card.Title>
        </div>
        <Card.Body>
          <Card.Text className={styles.description}>
            {spec.description}
          </Card.Text>
          <Card.Text className={styles.priceWrapper}>
            <span>{product.price} ₽ / месяц</span>
            <AddToCartButton productId={product.pk} />
          </Card.Text>
          <Button
            variant="outline-primary"
            onClick={() => setShowSpecs(!showSpecs)}
            className={styles.toggleButton}
          >
            {showSpecs ? "Скрыть характеристики" : "Показать характеристики"}
          </Button>

          {showSpecs && (
            <div className={styles.specifications}>
              <ul>
                <li>
                  <strong>Процессор:</strong> {spec.processor}
                </li>
                <li>
                  <strong>ОЗУ:</strong> {spec.ram}
                </li>
                <li>
                  <strong>Диск:</strong> {spec.disk}
                </li>
                <li>
                  <strong>Скорость интернета:</strong> {spec.internet_speed}
                </li>
              </ul>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default ProductPage;

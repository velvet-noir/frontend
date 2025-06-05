import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import styles from "./HomePage.module.css";
import { fetchServices } from "../../api/services";

export interface Product {
  id: number;
  name: string;
  image: string;
  mini_description: string;
  price: string;
  is_active: boolean;
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (query: string = "") => {
    setLoading(true);
    fetchServices(query)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    fetchData(filter);
  };

  const handleClear = () => {
    setFilter("");
    fetchData();
  };

  if (loading) return <p></p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.pageContent}>
      <h1>Добро пожаловать в VPS Rental</h1>
      <p>Выберите подходящий VPS сервер из списка ниже.</p>

      <SearchBar
        filter={filter}
        setFilter={setFilter}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {products.length === 0 ? (
        <div className={styles.noResultsWrapper}>
          <div className={styles.noResultsMessage}>
            Товаров/услуг не найдено
          </div>
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              mini_description={product.mini_description}
              price={product.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;

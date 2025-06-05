import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import styles from "./AddToCartButton.module.css";
import { useNavigate } from "react-router-dom";

interface AddToCartButtonProps {
  productId: number;
}

const getCSRFToken = () => {
  const match = document.cookie.match(new RegExp("(^| )csrftoken=([^;]+)"));
  return match ? match[2] : "";
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const csrfToken = getCSRFToken();
      console.log("Sending server_id:", productId, typeof productId);
      const response = await fetch("/api/app/draft/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": csrfToken,
        },
        body: JSON.stringify({ server_id: Number(productId) }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      console.log("Added to cart:", data);
      setSuccess(true);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={success ? "success" : "primary"}
        className={styles.addToCartButton}
        onClick={handleAddToCart}
        disabled={loading || success}
      >
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : success ? (
          "В корзину"
        ) : (
          "В корзину"
        )}
      </Button>
      {error && <div style={{ color: "red", marginTop: 5 }}>{error}</div>}
    </>
  );
};

export default AddToCartButton;

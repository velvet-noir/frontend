import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Spinner, Container } from "react-bootstrap";
import styles from "./CartPage.module.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface Server {
  id: number;
  name: string;
  mini_description: string;
  price: string;
  is_active: boolean;
}

interface DraftData {
  pk: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_creator: number;
  user_moderator: number | null;
  servers: Server[];
}

const CartPage = () => {
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDraft() {
      try {
        const response = await axios.get("/api/app/draft/", {
          headers: { Accept: "application/json" },
          withCredentials: true,
        });
        setDraft(response.data.data);
      } catch (err: any) {
        setError(err.message || "Ошибка при загрузке корзины");
      } finally {
        setLoading(false);
      }
    }
    fetchDraft();
  }, []);

  const handleDelete = async (serverId: number) => {
    try {
      const csrftoken = Cookies.get("csrftoken");

      await axios.delete(`/api/app/del/${serverId}`, {
        headers: {
          Accept: "application/json",
          "X-CSRFTOKEN": csrftoken || "",
        },
        withCredentials: true,
      });

      navigate(0);
    } catch (err) {
      console.error("Ошибка при удалении сервера:", err);
      alert("Не удалось удалить сервер.");
    }
  };

  const handleSubmit = async () => {
    try {
      const csrftoken = Cookies.get("csrftoken") || "";

      // 1. Получаем draft
      const draftResponse = await axios.get("/api/app/draft/", {
        headers: {
          Accept: "application/json",
          "X-CSRFTOKEN": csrftoken,
        },
        withCredentials: true,
      });

      if (draftResponse.data.status !== "success") {
        alert("Не удалось получить черновик заявки.");
        return;
      }

      const pk = draftResponse.data.data.pk;

      // 2. Отправляем PUT запрос для оформления
      const putResponse = await axios.put(
        `/api/app/${pk}/formed/`,
        {}, // обычно PUT без тела, но если надо, можно добавить
        {
          headers: {
            Accept: "application/json",
            "X-CSRFTOKEN": csrftoken,
          },
          withCredentials: true,
        },
      );

      if (putResponse.status === 200) {
        alert("Заявка успешно оформлена!");
        // Можно перейти на другую страницу, например
        // navigate('/orders');
      } else {
        alert("Ошибка при оформлении заявки.");
      }
    } catch (error) {
      console.error("Ошибка при оформлении заявки:", error);
      alert("Произошла ошибка при оформлении заявки.");
    } finally {
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Загрузка...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-3">
        <Alert variant="danger">Ошибка: {error}</Alert>
      </Container>
    );

  if (!draft || draft.servers.length === 0)
    return (
      <Container
        className={`d-flex flex-column align-items-center justify-content-center ${styles.emptyContainer}`}
      >
        <div className="text-center mt-5">
          <h2 className="mb-3">🛒 Ваша корзина пуста</h2>
          <p className="text-muted">Выберете сервер, чтобы оформить заявку</p>
        </div>
      </Container>
    );

  return (
    <Container className={styles.pageContainer}>
      <h1 className="mb-4">Корзина</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Цена (₽ / месяц)</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {draft.servers.map((server) => (
            <tr key={server.id}>
              <td>{server.name}</td>
              <td>{server.mini_description}</td>
              <td>{server.price}</td>
              <td className={styles.actionsCell}>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(server.id)}
                  aria-label={`Удалить ${server.name} из корзины`}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <button className={styles.submitButton} onClick={handleSubmit}>
          Оформить заявку
        </button>
      </div>
    </Container>
  );
};

export default CartPage;

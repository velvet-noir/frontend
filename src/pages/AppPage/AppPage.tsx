import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Spinner,
  Alert,
  Table,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import styles from "./AppPage.module.css";

interface Server {
  id: number;
  name?: string;
  mini_description?: string;
  price?: string;
  is_active?: boolean;
}

interface Application {
  pk: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_creator: number;
  user_moderator: number | null;
  servers: Server[];
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1] || "";

      const response = await axios.get("/api/app/", {
        headers: {
          Accept: "application/json",
          "X-CSRFTOKEN": csrftoken,
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setApplications(response.data.data);
        setFilteredApplications(response.data.data);
      } else {
        setError("Не удалось загрузить заявки");
      }
    } catch (err: any) {
      setError(err.message || "Ошибка при загрузке заявок");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = applications.filter((app) =>
      app.status.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredApplications(filtered);
  };

  const handleStatusChange = async (id: number, newStatus: "COMPLETED" | "REJECTED") => {
    try {
      const csrftoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1] || "";

      await axios.put(
        `/api/app/${id}/`,
        { status: newStatus },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFTOKEN": csrftoken,
          },
          withCredentials: true,
        }
      );

      await fetchApplications(); // обновить список после изменения
    } catch (err: any) {
      alert("Ошибка при смене статуса: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading)
    return (
      <Container className={styles.loadingSpinner}>
        <Spinner animation="border" role="status" />
        <p>Загрузка заявок...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-3">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Список заявок</h2>

      <Row className={styles.searchRow}>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Введите статус"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </Col>
        <Col md="auto">
          <Button onClick={handleSearch} className={styles.searchButton}>
            Поиск
          </Button>
        </Col>
      </Row>

      {filteredApplications.length === 0 ? (
        <Alert variant="info">Заявки с таким статусом не найдены.</Alert>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Статус</th>
              <th>Создана</th>
              <th>Обновлена</th>
              <th>Кол-во серверов</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.pk}>
                <td>{app.pk}</td>
                <td>{app.status}</td>
                <td>{new Date(app.created_at).toLocaleString()}</td>
                <td>{new Date(app.updated_at).toLocaleString()}</td>
                <td>{app.servers.length}</td>
                <td className={styles.tableActions}>
                  <Button
                    variant="success"
                    size="sm"
                    className={styles.actionButton}
                    onClick={() => handleStatusChange(app.pk, "COMPLETED")}
                  >
                    Завершить
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className={styles.actionButton}
                    onClick={() => handleStatusChange(app.pk, "REJECTED")}
                  >
                    Отменить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ApplicationsPage;

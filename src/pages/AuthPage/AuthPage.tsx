import { useState } from "react";
import styles from "./AuthPage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/authSlice";

function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setPassword("");
  };

  const getCSRFToken = () => {
    const match = document.cookie.match(new RegExp("(^| )csrftoken=([^;]+)"));
    if (match) return match[2];
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const csrfToken = getCSRFToken();

    if (isLogin) {
      try {
        await axios.post(
          "/api/login/",
          { username, password },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFTOKEN": csrfToken,
              Accept: "application/json",
            },
          },
        );

        const userResponse = await axios.get("/api/user-me/", {
          withCredentials: true,
          headers: {
            "X-CSRFTOKEN": csrfToken,
            Accept: "application/json",
          },
        });

        dispatch(
          setAuth({
            isAuthenticated: true,
            isStaff: userResponse.data.is_staff,
          }),
        );

        alert("Вход выполнен успешно!");
        setPassword("");
        navigate("/");
      } catch (error: any) {
        const message =
          error.response?.data?.detail || error.message || "Ошибка входа";
        setError(message);

        // При ошибке 403 или другой, можно сбросить авторизацию:
        if (error.response?.status === 403) {
          dispatch(
            setAuth({
              isAuthenticated: false,
              isStaff: null,
            }),
          );
        }
      }
    }
  };

  return (
    <div className={styles.authPage}>
      <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.inputField}
        />
        {!isLogin && (
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
        )}
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={toggleMode} className={styles.toggleButton}>
        {isLogin
          ? "Нет аккаунта? Зарегистрируйтесь"
          : "Уже есть аккаунт? Войти"}
      </button>
    </div>
  );
}

export default AuthPage;

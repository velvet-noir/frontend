import { Button, ButtonGroup } from "react-bootstrap";
import styles from "./AuthButton.module.css";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

const getCSRFToken = () => {
  const match = document.cookie.match(new RegExp("(^| )csrftoken=([^;]+)"));
  return match ? match[2] : "";
};

const LogoutButton = () => {
  const dispatch = useDispatch();

  const csrfToken = getCSRFToken();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFTOKEN": csrfToken,
        },
      });
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <ButtonGroup className={styles.authButtonGroup}>
      <Button variant="outline-light" size="sm" onClick={handleLogout}>
        Выйти
      </Button>
    </ButtonGroup>
  );
};

export default LogoutButton;

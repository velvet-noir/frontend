import { Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./AuthButton.module.css";

const AuthButton = () => {
  return (
    <ButtonGroup className={styles.authButtonGroup}>
      <Link to="/auth" className={styles.linkWrapper}>
        <Button variant="outline-light" size="sm">
          Вход / Регистрация
        </Button>
      </Link>
    </ButtonGroup>
  );
};

export default AuthButton;

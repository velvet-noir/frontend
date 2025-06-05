import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import AuthButton from "../AuthButton/AuthButton";
import LogoutButton from "../LogoutButton/LogoutButton";

const Header = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const isStaff = useSelector((state: RootState) => state.auth.isStaff);

  return (
    <Navbar className={styles.header} variant="dark" expand="lg">
      <Container className={styles.header__container}>
        <Nav className={styles.header__center}>
          <Nav.Link as={Link} to="/" className={styles.navLink}>
            Главная
          </Nav.Link>
          <Nav.Link as={Link} to="/about" className={styles.navLink}>
            О нас
          </Nav.Link>
          <Nav.Link as={Link} to="/contacts" className={styles.navLink}>
            Контакты
          </Nav.Link>

          {isStaff && (
            <Nav.Link as={Link} to="/application" className={styles.navLink}>
              Заявки
            </Nav.Link>
          )}
        </Nav>

        <div
          className={styles.header__right}
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          {isLoggedIn && (
            <Nav.Link as={Link} to="/cart" className={styles.navLink}>
              Корзина
            </Nav.Link>
          )}
          {isLoggedIn ? <LogoutButton /> : <AuthButton />}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;

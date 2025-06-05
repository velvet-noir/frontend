import { useLocation } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav className={styles.breadcrumbs}>
      <span>Главная</span>
      {pathnames.map((value, index) => (
        <span key={index}>
          {" / "}
          <span>{decodeURIComponent(value)}</span>
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;

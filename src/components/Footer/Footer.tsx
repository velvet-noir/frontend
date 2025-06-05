import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <a
          href="https://github.com/velvet-noir"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
      <div>© 2025 VPS Rental. Все права защищены.</div>
    </footer>
  );
}

export default Footer;

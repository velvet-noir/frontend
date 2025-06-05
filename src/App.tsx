import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import routes from "./routes";

import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.appWrapper}>
        <Header />
        <Breadcrumbs />
        <main className={styles.mainContent}>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

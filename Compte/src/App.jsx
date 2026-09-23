import styles from "./App.module.css";

import { generateMonths } from "./services/budget";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import MobileNav from "./components/MobileNav/MobileNav";
import CurrentMonth from "./pages/CurrentMonth/CurrentMonth";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    generateMonths();
    setIsReady(true);
  }, []);

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar />
      <div className={styles.mainColumn}>
        <Header onMenuClick={() => setIsNavOpen(true)} />
        {isNavOpen && <MobileNav onClose={() => setIsNavOpen(false)} />}
        {isReady ? (
          <section className={styles.appShell}>
            <CurrentMonth />
          </section>
        ) : (
          <p>chargement</p>
        )}
      </div>
    </div>
  );
}

export default App;

import styles from "./App.module.css";
import { generateMonths } from "./services/budget";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import MobileNav from "./components/MobileNav/MobileNav";
import CurrentMonth from "./pages/CurrentMonth/CurrentMonth";
import ChangesRules from "./pages/ChangesRules/ChangesRules";
import UnderConstruction from "./pages/Construction/ UnderConstruction";
import NotFound from "./pages/NotFound/NotFound";

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
        <main>
          {isReady ? (
            <section className={styles.appShell}>
              <Routes>
                <Route path="/" element={<CurrentMonth />} />
                <Route path="/rules-changes" element={<ChangesRules />} />
                <Route
                  path="/dashboard"
                  element={<UnderConstruction title="Dashboard" />}
                />
                <Route
                  path="/savings"
                  element={<UnderConstruction title="Epargne" />}
                />
                <Route
                  path="/account"
                  element={<UnderConstruction title="Compte" />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </section>
          ) : (
            <p>chargement</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

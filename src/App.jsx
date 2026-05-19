import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import BottomNav from "./components/BottomNav.jsx";
import FloatingBuddy from "./components/FloatingBuddy.jsx";
import StatusBar from "./components/StatusBar.jsx";
import { destinations } from "./data/mockData.js";
import { navItems } from "./navigation.js";
import BuddyPage from "./pages/BuddyPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MemoryPage from "./pages/MemoryPage.jsx";
import PlanPage from "./pages/PlanPage.jsx";
import SafetyPage from "./pages/SafetyPage.jsx";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [mode, setMode] = useState("realtime");
  const [buddyReady, setBuddyReady] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [toast, setToast] = useState("");

  const pageTitle = useMemo(() => navItems.find((item) => item.id === activePage)?.label ?? "陪伴", [activePage]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__fellowTripToast);
    window.__fellowTripToast = window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <main className="stage">
      <section className="phone-shell" aria-label="FellowTrip mobile prototype">
        <StatusBar />
        <div className="app-header">
          <div>
            <span className="eyebrow">FellowTrip</span>
            <h1>{pageTitle === "陪伴" ? "今日旅途陪伴" : pageTitle}</h1>
          </div>
          <button className="icon-button" aria-label="通知" onClick={() => showToast("暂无新的安全提醒")}>
            <Bell size={18} />
          </button>
        </div>

        <section className="screen">
          {activePage === "home" && (
            <HomePage mode={mode} setMode={setMode} setActivePage={setActivePage} showToast={showToast} />
          )}
          {activePage === "buddy" && (
            <BuddyPage buddyReady={buddyReady} setBuddyReady={setBuddyReady} showToast={showToast} />
          )}
          {activePage === "plan" && (
            <PlanPage
              selectedDestination={selectedDestination}
              setSelectedDestination={setSelectedDestination}
              setActivePage={setActivePage}
              showToast={showToast}
            />
          )}
          {activePage === "safety" && <SafetyPage showToast={showToast} />}
          {activePage === "memory" && <MemoryPage showToast={showToast} />}
        </section>

        <FloatingBuddy mode={mode} onClick={() => showToast("我在，随时可以叫我一起看看路线")} />
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  );
}

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import BottomNav from "./components/BottomNav.jsx";
import FloatingBuddy from "./components/FloatingBuddy.jsx";
import StatusBar from "./components/StatusBar.jsx";
import { destinations } from "./data/mockData.js";
import { navItems } from "./navigation.js";
import AuthPage from "./pages/AuthPage.jsx";
import BuddyPage from "./pages/BuddyPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MemoryPage from "./pages/MemoryPage.jsx";
import PlanPage from "./pages/PlanPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SafetyPage from "./pages/SafetyPage.jsx";

const pageTitles = {
  buddySetup: "创建搭子",
  buddySettings: "搭子设置",
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [mode, setMode] = useState("realtime");
  const [buddyReady, setBuddyReady] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [toast, setToast] = useState("");

  const pageTitle = useMemo(() => {
    if (pageTitles[activePage]) return pageTitles[activePage];
    return navItems.find((item) => item.id === activePage)?.label ?? "陪伴";
  }, [activePage]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__fellowTripToast);
    window.__fellowTripToast = window.setTimeout(() => setToast(""), 2200);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setActivePage("buddySetup");
    showToast("登录成功，先创建你的旅行搭子");
  };

  const handleBuddyComplete = () => {
    setBuddyReady(true);
    setActivePage(activePage === "buddySettings" ? "profile" : "home");
    showToast(activePage === "buddySettings" ? "搭子设置已保存" : "小旅已准备好陪你出发");
  };

  if (!isAuthenticated) {
    return (
      <main className="stage">
        <section className="phone-shell" aria-label="FellowTrip login prototype">
          <StatusBar />
          <AuthPage onSuccess={handleAuthSuccess} showToast={showToast} />
          {toast && <div className="toast auth-toast">{toast}</div>}
        </section>
      </main>
    );
  }

  const shouldShowNav = buddyReady && activePage !== "buddySettings";
  const shouldShowBuddy = buddyReady && activePage !== "buddySettings";

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

        <section className={shouldShowNav ? "screen" : "screen no-nav"}>
          {activePage === "buddySetup" && (
            <BuddyPage variant="onboarding" submitLabel="完成设置，进入 FellowTrip" onComplete={handleBuddyComplete} />
          )}
          {activePage === "buddySettings" && (
            <BuddyPage variant="settings" submitLabel="保存搭子设置" onComplete={handleBuddyComplete} />
          )}
          {activePage === "home" && (
            <HomePage mode={mode} setMode={setMode} setActivePage={setActivePage} showToast={showToast} />
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
          {activePage === "profile" && (
            <ProfilePage
              onEditBuddy={() => setActivePage("buddySettings")}
              onLogout={() => {
                setIsAuthenticated(false);
                setBuddyReady(false);
                setActivePage("home");
              }}
              showToast={showToast}
            />
          )}
        </section>

        {shouldShowBuddy && <FloatingBuddy mode={mode} onClick={() => showToast("我在，随时可以叫我一起看看路线")} />}
        {shouldShowNav && <BottomNav activePage={activePage} setActivePage={setActivePage} />}
        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  );
}

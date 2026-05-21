import { useMemo, useState } from "react";
import { Bell, History } from "lucide-react";
import BottomNav from "./components/BottomNav.jsx";
import FloatingBuddy from "./components/FloatingBuddy.jsx";
import StatusBar from "./components/StatusBar.jsx";
import { buddyProfile, confirmedCompanionTrips } from "./data/mockData.js";
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

const storageKey = "fellowTripPrototypeState";

const loadStoredState = () => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStoredState = (partialState) => {
  try {
    const previousState = loadStoredState();
    window.localStorage.setItem(storageKey, JSON.stringify({ ...previousState, ...partialState }));
  } catch {
    // Prototype-only persistence can fail in restricted browsers.
  }
};

export default function App() {
  const storedState = useMemo(loadStoredState, []);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(storedState.isAuthenticated));
  const [activePage, setActivePage] = useState("home");
  const [mode, setMode] = useState(storedState.buddySettings?.companionMode ?? "realtime");
  const [buddyReady, setBuddyReady] = useState(Boolean(storedState.buddyReady));
  const [buddySettings, setBuddySettings] = useState(storedState.buddySettings ?? buddyProfile);
  const [confirmedTrips, setConfirmedTrips] = useState(storedState.confirmedTrips ?? confirmedCompanionTrips);
  const [toast, setToast] = useState("");

  const effectivePage = isAuthenticated && !buddyReady ? "buddySetup" : activePage;

  const pageTitle = useMemo(() => {
    if (pageTitles[effectivePage]) return pageTitles[effectivePage];
    return navItems.find((item) => item.id === effectivePage)?.label ?? "陪伴";
  }, [effectivePage]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__fellowTripToast);
    window.__fellowTripToast = window.setTimeout(() => setToast(""), 2200);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    saveStoredState({ isAuthenticated: true });
    setActivePage(buddyReady ? "home" : "buddySetup");
    showToast(buddyReady ? "欢迎回来，已读取本机记忆" : "登录成功，先创建你的旅行搭子");
  };

  const handleBuddyComplete = (nextBuddySettings) => {
    const mergedSettings = { ...buddySettings, ...nextBuddySettings };
    setBuddySettings(mergedSettings);
    setBuddyReady(true);
    if (mergedSettings.companionMode) {
      setMode(mergedSettings.companionMode);
    }
    saveStoredState({
      isAuthenticated: true,
      buddyReady: true,
      buddySettings: mergedSettings,
      confirmedTrips,
    });
    setActivePage(effectivePage === "buddySettings" ? "profile" : "home");
    showToast(effectivePage === "buddySettings" ? "搭子设置已保存" : "小旅已准备好和你规划下一段旅程");
  };

  const handleConfirmTrip = (destination) => {
    const newTrip = {
      id: `${destination.city}-${Date.now()}`,
      city: destination.city,
      title: `${destination.city}${destination.days ?? "三天两夜"}攻略`,
      date: "待出发",
      status: "ready",
      statusText: "待进入陪伴",
      safety: "安全守护已开启",
      currentPlace: "推荐酒店",
      nextPlace: destination.attractions?.[0]?.name ?? "第一个景点",
      buddyLine: `我已经把${destination.city}的路线放进陪伴列表，进入行程后会按节点提醒你。`,
      nearbySpots:
        destination.attractions?.map((spot, index) => ({
          ...spot,
          distance: index === 0 ? "1.2km" : "2.4km",
        })) ?? [],
      route: ["酒店", ...(destination.highlights ?? []), "返程"],
    };

    setConfirmedTrips((trips) => {
      const nextTrips = [newTrip, ...trips];
      saveStoredState({ confirmedTrips: nextTrips });
      return nextTrips;
    });
    setActivePage("plan");
    showToast("行程已加入陪伴列表");
  };

  const updateTripStatus = (tripId, status, statusText) => {
    setConfirmedTrips((trips) => {
      const nextTrips = trips.map((trip) => (trip.id === tripId ? { ...trip, status, statusText } : trip));
      saveStoredState({ confirmedTrips: nextTrips });
      return nextTrips;
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage("home");
    saveStoredState({ isAuthenticated: false });
    showToast("已退出登录，本机搭子记忆仍保留");
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

  const shouldShowNav = buddyReady && effectivePage !== "buddySettings";
  const shouldShowBuddy = buddyReady && effectivePage !== "buddySettings" && effectivePage !== "home";

  return (
    <main className="stage">
      <section className="phone-shell" aria-label="FellowTrip mobile prototype">
        <StatusBar />
        <div className="app-header">
          <div>
            <span className="eyebrow">FellowTrip</span>
            <h1>{effectivePage === "home" ? "旅途前规划" : pageTitle}</h1>
          </div>
          <div className="app-header-actions">
            <button className="history-record-button" type="button" onClick={() => setActivePage("memory")}>
              <History size={16} />
              <span>历史记录</span>
            </button>
            <button className="icon-button" aria-label="通知" onClick={() => showToast("暂无新的安全提醒")}>
              <Bell size={18} />
            </button>
          </div>
        </div>

        <section className={shouldShowNav ? "screen" : "screen no-nav"}>
          {effectivePage === "buddySetup" && (
            <BuddyPage
              variant="onboarding"
              submitLabel="完成设置，进入 FellowTrip"
              initialSettings={buddySettings}
              onComplete={handleBuddyComplete}
            />
          )}
          {effectivePage === "buddySettings" && (
            <BuddyPage
              variant="settings"
              submitLabel="保存搭子设置"
              initialSettings={buddySettings}
              onComplete={handleBuddyComplete}
            />
          )}
          {effectivePage === "home" && (
            <HomePage
              mode={mode}
              setMode={setMode}
              setActivePage={setActivePage}
              showToast={showToast}
              onConfirmTrip={handleConfirmTrip}
              buddySettings={buddySettings}
            />
          )}
          {effectivePage === "plan" && (
            <PlanPage
              confirmedTrips={confirmedTrips}
              setActivePage={setActivePage}
              showToast={showToast}
              updateTripStatus={updateTripStatus}
            />
          )}
          {effectivePage === "safety" && <SafetyPage showToast={showToast} />}
          {effectivePage === "memory" && <MemoryPage showToast={showToast} />}
          {effectivePage === "profile" && (
            <ProfilePage
              buddySettings={buddySettings}
              onEditBuddy={() => setActivePage("buddySettings")}
              onLogout={handleLogout}
              showToast={showToast}
            />
          )}
        </section>

        {shouldShowBuddy && (
          <FloatingBuddy
            mode={mode}
            buddy={buddySettings}
            onClick={(message = "我在~有什么想去的地方？") => showToast(message)}
          />
        )}
        {shouldShowNav && <BottomNav activePage={effectivePage} setActivePage={setActivePage} />}
        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  );
}

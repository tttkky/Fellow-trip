import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Bell, History } from "lucide-react";
import BottomNav from "./components/BottomNav.jsx";
import FloatingBuddy from "./components/FloatingBuddy.jsx";
import StatusBar from "./components/StatusBar.jsx";
import { buddyProfile, confirmedCompanionTrips, userProfile } from "./data/mockData.js";
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

const defaultSafetyPreferences = {
  safetyMode: true,
  nightTravelReminder: true,
  remoteRouteHint: true,
  locationShareReminder: true,
  emergencyContactReminder: true,
};
const DEFAULT_COMPANION_TRIP_ID = "xiamen-2026";

const orderConfirmedTrips = (trips) => {
  const list = Array.isArray(trips) ? trips : [];
  return [
    ...list.filter((trip) => trip.id === DEFAULT_COMPANION_TRIP_ID),
    ...list.filter((trip) => trip.id !== DEFAULT_COMPANION_TRIP_ID),
  ];
};

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
  const storedBuddySettings = storedState.selectedBuddy ?? storedState.buddySettings ?? buddyProfile;
  const storedOnboardingCompleted = storedState.onboardingCompleted ?? storedState.buddyReady;
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(storedState.isAuthenticated));
  const [activePage, setActivePage] = useState("home");
  const [mode, setMode] = useState(storedBuddySettings.companionMode ?? "realtime");
  const [buddyReady, setBuddyReady] = useState(Boolean(storedOnboardingCompleted));
  const [buddySettings, setBuddySettings] = useState(storedBuddySettings);
  const [profileSettings, setProfileSettings] = useState({
    ...userProfile,
    ...storedState.userProfile,
  });
  const [safetyPreferences, setSafetyPreferences] = useState({
    ...defaultSafetyPreferences,
    ...storedState.safetyPreferences,
  });
  const [confirmedTrips, setConfirmedTrips] = useState(
    orderConfirmedTrips(storedState.confirmedTrips ?? confirmedCompanionTrips),
  );
  const [selectedMemoryArchiveId, setSelectedMemoryArchiveId] = useState(null);
  const [pageHistory, setPageHistory] = useState([]);
  const [toast, setToast] = useState("");
  const screenRef = useRef(null);
  const scrollPositionsRef = useRef({});
  const pendingScrollRef = useRef({ type: "top" });

  useEffect(() => {
    saveStoredState({
      selectedBuddy: buddySettings,
      onboardingCompleted: buddyReady,
      userProfile: profileSettings,
      safetyPreferences,
    });
  }, [buddyReady, buddySettings, profileSettings, safetyPreferences]);

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

  const saveCurrentScrollPosition = () => {
    const screen = screenRef.current;
    if (!screen) return;
    scrollPositionsRef.current[activePage] = screen.scrollTop;
  };

  const navigateToPage = (nextPage, options = {}) => {
    if (nextPage === activePage) return;
    saveCurrentScrollPosition();

    if (nextPage === "memory") {
      setSelectedMemoryArchiveId(options.archiveId ?? null);
    }

    if (options.reset) {
      setPageHistory([]);
    } else if (!options.replace) {
      setPageHistory((history) => [...history, activePage].slice(-8));
    }

    pendingScrollRef.current = { type: "top" };
    setActivePage(nextPage);
  };

  const handleBack = () => {
    const previousPage = pageHistory[pageHistory.length - 1];
    if (!previousPage) return;

    saveCurrentScrollPosition();
    pendingScrollRef.current = {
      type: "restore",
      page: previousPage,
    };
    setPageHistory((history) => history.slice(0, -1));
    setActivePage(previousPage);
  };

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const pendingScroll = pendingScrollRef.current;
    window.requestAnimationFrame(() => {
      if (pendingScroll.type === "restore") {
        screen.scrollTop = scrollPositionsRef.current[pendingScroll.page] ?? 0;
      } else {
        screen.scrollTop = 0;
      }
      screen.focus({ preventScroll: true });
      pendingScrollRef.current = { type: "top" };
    });
  }, [effectivePage]);

  const handleAuthSuccess = (authMode = "login") => {
    const isRegistering = authMode === "register";
    const nextBuddyReady = isRegistering ? false : true;

    setIsAuthenticated(true);
    setBuddyReady(nextBuddyReady);
    saveStoredState({
      isAuthenticated: true,
      buddyReady: nextBuddyReady,
      onboardingCompleted: nextBuddyReady,
    });
    setPageHistory([]);
    setActivePage(isRegistering ? "buddySetup" : "home");
    showToast(isRegistering ? "注册成功，先创建你的旅行搭子" : "欢迎回来，已进入旅行规划");
  };

  const handleBuddyComplete = (nextBuddySettings) => {
    const mergedSettings = { ...buddySettings, ...nextBuddySettings };
    const buddySettingsReturnPage = pageHistory[pageHistory.length - 1] ?? "profile";
    setBuddySettings(mergedSettings);
    setBuddyReady(true);
    if (mergedSettings.companionMode) {
      setMode(mergedSettings.companionMode);
    }
    saveStoredState({
      isAuthenticated: true,
      buddyReady: true,
      onboardingCompleted: true,
      buddySettings: mergedSettings,
      selectedBuddy: mergedSettings,
      confirmedTrips,
    });
    if (effectivePage === "buddySettings") {
      saveCurrentScrollPosition();
      pendingScrollRef.current = {
        type: "restore",
        page: buddySettingsReturnPage,
      };
      setPageHistory((history) => history.slice(0, -1));
      setActivePage(buddySettingsReturnPage);
    } else {
      setPageHistory([]);
      pendingScrollRef.current = { type: "top" };
      setActivePage("home");
    }
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
      // 新增陪伴相关字段
      liveTips: [
        "今天气温偏高，小旅建议你先补充水分～",
        "前方300米有适合休息的咖啡店",
        "现在光线很好，很适合拍照"
      ],
      photoGuide: {
        title: "景点拍照建议",
        tips: [
          "靠近建筑边缘拍更有层次",
          "下午4点后的光线最柔和",
          "建议使用广角模式"
        ]
      },
      spotGuide: {
        title: "景点讲解",
        content: `${destination.city}是一个适合独自旅行的地方，这里有丰富的文化历史和自然景观。`
      },
      nearbyFoods: [
        "一人友好餐厅",
        "安静咖啡馆",
        "适合休息的甜品店"
      ],
      emotionCare: [
        "今天已经走了很久，别忘记休息。",
        "你已经探索了很多地方啦。",
        "独自旅行也很勇敢。"
      ]
    };

    setConfirmedTrips((trips) => {
      const nextTrips = orderConfirmedTrips([...trips, newTrip]);
      saveStoredState({ confirmedTrips: nextTrips });
      return nextTrips;
    });
    navigateToPage("plan");
    showToast("行程已加入陪伴列表");
  };

  const updateTripStatus = (tripId, status, statusText) => {
    setConfirmedTrips((trips) => {
      const nextTrips = orderConfirmedTrips(trips.map((trip) => (trip.id === tripId ? { ...trip, status, statusText } : trip)));
      saveStoredState({ confirmedTrips: nextTrips });
      return nextTrips;
    });
  };

  const deleteTrip = (tripId) => {
    setConfirmedTrips((trips) => {
      const nextTrips = orderConfirmedTrips(trips.filter((trip) => trip.id !== tripId));
      saveStoredState({ confirmedTrips: nextTrips });
      return nextTrips;
    });
    showToast("行程已删除");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPageHistory([]);
    setActivePage("home");
    saveStoredState({ isAuthenticated: false });
    showToast("已退出登录，本机搭子记忆仍保留");
  };

  const handleSafetyPreferencesChange = (nextPreferences) => {
    setSafetyPreferences(nextPreferences);
    saveStoredState({ safetyPreferences: nextPreferences });
    showToast("安全偏好已保存");
  };

  const handleProfileSettingsChange = (nextProfile) => {
    setProfileSettings(nextProfile);
    saveStoredState({ userProfile: nextProfile });
    showToast("个人信息已保存");
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
  const shouldShowBuddy = buddyReady && effectivePage !== "buddySettings" && effectivePage !== "home" && effectivePage !== "plan";
  const shouldShowHeaderBack = pageHistory.length > 0 && effectivePage !== "home" && effectivePage !== "buddySetup";

  return (
    <main className="stage">
      <section className="phone-shell" aria-label="FellowTrip mobile prototype">
        <StatusBar />
        <div className="app-header">
          <div className="app-header-title">
            {shouldShowHeaderBack && (
              <button className="header-back-button" type="button" onClick={handleBack} aria-label="返回上一页">
                <ArrowLeft size={17} />
              </button>
            )}
            <div>
              <span className="eyebrow">FellowTrip</span>
              <h1>{effectivePage === "home" ? "旅途前规划" : pageTitle}</h1>
            </div>
          </div>
          <div className="app-header-actions">
            {effectivePage !== "memory" && (
              <button className="history-record-button" type="button" onClick={() => navigateToPage("memory")}>
                <History size={16} />
                <span>历史记录</span>
              </button>
            )}
            <button className="icon-button" aria-label="通知" onClick={() => showToast("暂无新的安全提醒")}>
              <Bell size={18} />
            </button>
          </div>
        </div>

        <section ref={screenRef} className={shouldShowNav ? "screen" : "screen no-nav"} tabIndex={-1}>
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
              setActivePage={navigateToPage}
              showToast={showToast}
              onConfirmTrip={handleConfirmTrip}
              buddySettings={buddySettings}
            />
          )}
          {effectivePage === "plan" && (
            <PlanPage
              confirmedTrips={confirmedTrips}
              setActivePage={navigateToPage}
              showToast={showToast}
              updateTripStatus={updateTripStatus}
              deleteTrip={deleteTrip}
              buddySettings={buddySettings}
            />
          )}
          {effectivePage === "safety" && <SafetyPage showToast={showToast} safetyPreferences={safetyPreferences} />}
          {effectivePage === "memory" && (
            <MemoryPage showToast={showToast} initialArchiveId={selectedMemoryArchiveId} />
          )}
          {effectivePage === "profile" && (
            <ProfilePage
              userSettings={profileSettings}
              buddySettings={buddySettings}
              safetyPreferences={safetyPreferences}
              onEditBuddy={() => navigateToPage("buddySettings")}
              onEditProfile={handleProfileSettingsChange}
              onEditSafety={handleSafetyPreferencesChange}
              onOpenTrip={(archive) =>
                navigateToPage("memory", {
                  archiveId: archive.id,
                })
              }
              onLogout={handleLogout}
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
        {shouldShowNav && (
          <BottomNav activePage={effectivePage} setActivePage={(page) => navigateToPage(page, { reset: true })} />
        )}
        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  );
}

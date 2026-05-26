import { useRef, useState, useEffect } from "react";
import { Bot, Grip, MessageCircle, X } from "lucide-react";

const TIPS = [
  "附近有不错的拍照点哦～",
  "今天已经走了很多路啦",
  "夕阳快开始了",
  "前方适合休息一下",
  "要不要喝点水休息会儿？",
  "这里风景很美呢",
  "记得补充能量哦",
  "慢慢来，享受旅程"
];

export default function FloatingBuddy({ mode, buddy, onClick }) {
  const [position, setPosition] = useState({ right: 20, bottom: 160 });
  const [isOpen, setIsOpen] = useState(false);
  const [cartoonMode, setCartoonMode] = useState(false);
  const [currentTip, setCurrentTip] = useState("");
  const [tipFading, setTipFading] = useState(false);
  const dragRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipFading(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * TIPS.length);
        setCurrentTip(TIPS[randomIndex]);
        setTipFading(false);
      }, 300);
    }, 15000); // 每15秒切换一次提示

    return () => clearInterval(interval);
  }, []);

  const appearance = buddy?.appearance ?? "round-bot";
  const buddyName = buddy?.name ?? "小旅";

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getBounds = () => {
    const shell = document.querySelector(".phone-shell");
    const rect = shell?.getBoundingClientRect();
    const width = rect?.width ?? 414;
    const height = rect?.height ?? 820;

    return {
      maxRight: Math.max(10, width - 206),
      maxBottom: Math.max(92, height - 150),
    };
  };

  const startDrag = (event) => {
    event.preventDefault();
    const pointer = event.touches?.[0] ?? event;
    dragRef.current = {
      startX: pointer.clientX,
      startY: pointer.clientY,
      startRight: position.right,
      startBottom: position.bottom,
      moved: false,
    };

    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", handleDrag, { passive: false });
    window.addEventListener("touchend", endDrag);
  };

  const handleDrag = (event) => {
    if (!dragRef.current) return;
    event.preventDefault();
    const pointer = event.touches?.[0] ?? event;
    const nextRight = dragRef.current.startRight - (pointer.clientX - dragRef.current.startX);
    const nextBottom = dragRef.current.startBottom - (pointer.clientY - dragRef.current.startY);
    const bounds = getBounds();

    if (Math.abs(pointer.clientX - dragRef.current.startX) > 3 || Math.abs(pointer.clientY - dragRef.current.startY) > 3) {
      dragRef.current.moved = true;
    }

    setPosition({
      right: clamp(nextRight, 10, bounds.maxRight),
      bottom: clamp(nextBottom, 86, bounds.maxBottom),
    });
  };

  const endDrag = () => {
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", endDrag);
    window.removeEventListener("touchmove", handleDrag);
    window.removeEventListener("touchend", endDrag);
    window.setTimeout(() => {
      dragRef.current = null;
    }, 0);
  };

  const handleClick = () => {
    if (dragRef.current?.moved) return;
    setIsOpen((value) => !value);
    onClick?.(currentTip || "我在~有什么想去的地方？");
  };

  return (
      <div className="floating-buddy-wrap" style={{ right: position.right, bottom: position.bottom }}>
        {currentTip && !isOpen && (
          <div className={`floating-buddy-tip ${tipFading ? 'fading' : 'visible'}`} role="status" aria-live="polite">
            {currentTip}
          </div>
        )}
      {isOpen && (
        <section className="floating-buddy-popover" aria-label="当前搭子形象">
          <button className="floating-buddy-close" type="button" onClick={() => setIsOpen(false)} aria-label="关闭搭子形象">
            <X size={14} />
          </button>
          <div className={`buddy-avatar floating-buddy-avatar buddy-avatar-${appearance}`} aria-hidden="true">
            <span className="buddy-avatar-head" />
            <span className="buddy-avatar-face" />
            <span className="buddy-avatar-body" />
          </div>
          <div>
            <span className="eyebrow">当前搭子</span>
            <strong>{buddyName}</strong>
            <p>{buddy?.voice ?? "温柔"}声线 · {mode === "realtime" ? "实时陪伴" : "后台响应"}</p>
          </div>
        </section>
      )}
      <button
        className="floating-buddy"
        type="button"
        onClick={handleClick}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        aria-label="拖动或唤醒 FellowTrip 搭子"
      >
        {cartoonMode ? (
          <span className={`floating-buddy-mini-avatar buddy-avatar-${appearance}`} aria-hidden="true">
            <span className="mini-avatar-head" />
            <span className="mini-avatar-face" />
            <span className="mini-avatar-body" />
          </span>
        ) : (
          <span className="buddy-face">
            <Bot size={24} />
          </span>
        )}
        <span className="floating-grip">
          <Grip size={10} />
        </span>
        <span className={mode === "realtime" ? "pulse-dot online" : "pulse-dot"} />
      </button>
      {isOpen && (
        <button
          className="floating-buddy-say"
          type="button"
          onClick={() => {
            setCartoonMode(true);
            setIsOpen(false);
            onClick?.("已切换为卡通陪伴");
          }}
        >
          <MessageCircle size={14} /> 卡通陪伴
        </button>
      )}
    </div>
  );
}

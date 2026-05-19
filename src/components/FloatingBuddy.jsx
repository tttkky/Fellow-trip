import { Bot } from "lucide-react";

export default function FloatingBuddy({ mode, onClick }) {
  return (
    <button className="floating-buddy" onClick={onClick} aria-label="唤醒 FellowTrip 搭子">
      <span className="buddy-face">
        <Bot size={24} />
      </span>
      <span className={mode === "realtime" ? "pulse-dot online" : "pulse-dot"} />
    </button>
  );
}

export default function MiniMap() {
  return (
    <div className="mini-map" aria-label="抽象路线地图">
      <span className="map-node start" />
      <span className="map-node middle" />
      <span className="map-node end" />
      <svg viewBox="0 0 280 118" role="presentation">
        <path d="M34 90 C88 36, 135 102, 183 48 S246 24, 258 32" />
      </svg>
    </div>
  );
}

export default function OptionSection({ title, items, selected }) {
  return (
    <section className="card">
      <div className="section-title">
        <h3>{title}</h3>
      </div>
      <div className="choice-grid">
        {items.map((item) => (
          <button key={item} className={selected === item ? "choice active" : "choice"}>
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

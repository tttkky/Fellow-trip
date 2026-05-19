export default function InfoTile({ icon: Icon, title, text }) {
  return (
    <section className="info-tile">
      <Icon size={18} />
      <strong>{title}</strong>
      <p>{text}</p>
    </section>
  );
}

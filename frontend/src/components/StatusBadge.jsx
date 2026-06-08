export default function StatusBadge({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`badge badge--${status}`} aria-label={`Status: ${label}`}>
      <span className="badge__dot" aria-hidden="true" />
      {label}
    </span>
  );
}

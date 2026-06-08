export default function LanguageBadge({ language }) {
  const key = language.toLowerCase();
  return (
    <span className={`badge badge--${key}`} aria-label={`Language: ${language}`}>
      {language}
    </span>
  );
}

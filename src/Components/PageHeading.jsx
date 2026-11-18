export default function PageHeading({ title, description, action }) {
  return (
    <header className="fit-page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}

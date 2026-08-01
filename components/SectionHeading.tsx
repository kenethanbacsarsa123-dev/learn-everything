export default function SectionHeading({
  coordinate,
  title,
  description,
}: {
  coordinate: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 animate-rise">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal">{coordinate}</p>
      <h2 className="mt-2 font-display text-3xl italic text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
    </div>
  );
}

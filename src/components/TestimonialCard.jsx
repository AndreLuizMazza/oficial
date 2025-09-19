// src/components/TestimonialCard.jsx
export default function TestimonialCard({ quote, name, role, avatar }) {
  return (
    <figure className="card p-5 hover:shadow-card transition">
      <blockquote className="text-sm leading-relaxed">“{quote}”</blockquote>
      <figcaption className="flex items-center gap-3 mt-4">
        <img src={avatar} alt="" className="size-9 rounded-full border border-[var(--c-border)]" />
        <div className="text-sm">
          <div className="font-medium">{name}</div>
          <div className="muted">{role}</div>
        </div>
      </figcaption>
    </figure>
  );
}

// src/components/BottomDockCTA.jsx
import { Link } from "react-router-dom";

export default function BottomDockCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] md:hidden">
      <div className="mx-auto max-w-7xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]/90 backdrop-blur p-3 shadow-2xl">
          <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo w-full" aria-label="Solicitar demonstração da Progem">
            Solicitar Demonstração
          </Link>
        </div>
      </div>
    </div>
  );
}

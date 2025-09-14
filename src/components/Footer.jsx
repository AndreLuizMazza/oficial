export default function Footer(){
  return (
    <footer className="mt-16 border-t border-[var(--c-border)]">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-[color:var(--c-muted)] flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Progem. Todos os direitos reservados.</p>
        <nav className="flex items-center gap-4">
          <a href="#">Termos</a>
          <a href="#">Privacidade</a>
          <a href="#">Suporte</a>
        </nav>
      </div>
    </footer>
  )
}

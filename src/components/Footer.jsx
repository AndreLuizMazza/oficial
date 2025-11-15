// src/components/Footer.jsx
import {
  Mail, Phone, Globe,
  Instagram, Facebook, Youtube, Music
} from "lucide-react"

export default function Footer(){
  return (
    <footer className="mt-16 border-t border-[var(--c-border)] bg-[var(--c-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-sm">
        
        {/* Dados institucionais */}
        <div>
          <img
            src="https://sandbox-api.progem.com.br/docs/logo.png"
            alt="Logo Progem"
            className="h-10 mb-3"
            loading="lazy"
          />
          <h4 className="font-semibold mb-2">AWIS Desenvolvimento de Software LTDA</h4>
          <ul className="space-y-1 text-[color:var(--c-muted)]">
            <li>CNPJ: 45.839.937/0001-93</li>

            {/* NOVO ENDEREÇO */}
            <li>Rua Luiz Favretto, 10 – Edif. Rio Madeira, 2º Andar</li>
            <li>Bairro La Salle – Pato Branco – PR</li>
            <li>CEP 85.505-150</li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="font-semibold mb-2">Contato</h4>
          <ul className="space-y-2 text-[color:var(--c-muted)]">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4"/>
              <a href="mailto:contato@progem.com.br" className="hover:underline">
                contato@progem.com.br
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4"/>
              <a href="tel:+554626040880" className="hover:underline">
                (46) 2604-0880
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="w-4 h-4"/>
              <a
                href="https://www.awis.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                www.awis.com.br
              </a>
            </li>
          </ul>
        </div>

        {/* Redes sociais */}
        <div>
          <h4 className="font-semibold mb-2">Siga-nos</h4>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/progemsoftware"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Progem"
              className="hover:text-[var(--c-primary)]"
            >
              <Instagram className="w-5 h-5"/>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61557184553857&locale=pt_BR"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook da Progem"
              className="hover:text-[var(--c-primary)]"
            >
              <Facebook className="w-5 h-5"/>
            </a>
            <a
              href="https://www.youtube.com/@progemsoftware"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube da Progem"
              className="hover:text-[var(--c-primary)]"
            >
              <Youtube className="w-5 h-5"/>
            </a>
            <a
              href="https://www.tiktok.com/@progemsoftware"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok da Progem"
              className="hover:text-[var(--c-primary)]"
            >
              <Music className="w-5 h-5"/>
            </a>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="text-center text-xs text-[color:var(--c-muted)] py-4 border-t border-[var(--c-border)]">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <p>© {new Date().getFullYear()} AWIS Desenvolvimento de Software LTDA. Todos os direitos reservados.</p>
          <nav className="flex items-center gap-4">
            <a href="/quem-somos">Quem somos</a>
            <a href="/taxas">Taxas & Cobrança</a>
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Suporte</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

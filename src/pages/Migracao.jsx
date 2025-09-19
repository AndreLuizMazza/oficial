// src/pages/Migracao.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { setPageSEO } from "@/lib/seo";
import {
  Database, UploadCloud, FileSpreadsheet, ShieldCheck, Check, Sparkles,
  Server, Info, Rocket, Download
} from "lucide-react";
import BottomDockCTA from "@/components/BottomDockCTA";

export default function Migracao(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Migração de Dados",
      description: "Importação guiada de clientes, contratos, carnês/boletos e histórico com validações e segurança."
    });
  },[]);

  return (
    <div>


      {/* HERO */}
      <section className="relative border-b border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden">
        {/* halo sutil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -top-10 h-[220px] opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(1100px 220px at 50% 0, color-mix(in oklab, var(--c-primary) 28%, transparent), transparent 60%)",
            zIndex: 0,
          }}
        />
        {/* grid sutil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(var(--c-border) 1px, transparent 1px), linear-gradient(90deg, var(--c-border) 1px, transparent 1px)",
            backgroundSize: "28px 28px, 28px 28px",
            mixBlendMode: "normal",
            zIndex: 0,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
              <Sparkles className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Onboarding assistido
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Migração de <span className="text-[var(--c-primary)]">Dados</span>
            </h1>
            <p className="muted mt-3 text-lg">
              Trazemos seu histórico para o Progem com segurança: clientes, contratos, carnês/boletos, baixas e status.
            </p>

            {/* badges rápidas */}
            <ul className="mt-4 flex flex-wrap gap-2 text-xs">
              {["CSV/XLSX/JSON", "Backups SQL", "Prévia de erros", "Homologação", "LGPD & auditoria"].map(b => (
                <li key={b} className="badge">{b}</li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Solicitar demonstração
              </Link>
              <Link to="/developers#migracao" className="btn btn-ghost">
                Ver guias técnicos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <main className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-6">
        {/* Formatos tabulares */}
        <article className="card p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
              <UploadCloud className="w-5 h-5 text-[color:var(--c-muted)]"/>
            </span>
            <div>
              <div className="font-semibold">Formatos aceitos</div>
              <div className="muted text-sm">CSV, XLSX e JSON. Modelos prontos para exportar do seu sistema atual.</div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Clientes/associados",
              "Contratos e planos",
              "Carnês/boletos e parcelas",
              "Baixas e conciliações",
            ].map(i=>(
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5"/><span className="muted">{i}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Backups de banco */}
        <article className="card p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
              <Server className="w-5 h-5 text-[color:var(--c-muted)]"/>
            </span>
            <div>
              <div className="font-semibold">Backups de Banco de Dados</div>
              <div className="muted text-sm">
                Também realizamos migração a partir de <strong>backups/dumps</strong> dos seus bancos.
              </div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "PostgreSQL (.dump / .sql)",
              "SQL Server (.bak / .sql)",
              "MySQL/MariaDB (.sql / .gz)",
            ].map(i=>(
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5"/><span className="muted">{i}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-sm muted">
            Inclui análise de esquema, mapeamento de colunas para o modelo Progem e tratamento de PK/FK e consistência.
          </div>
        </article>

        {/* Validações & segurança */}
        <article className="card p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
              <FileSpreadsheet className="w-5 h-5 text-[color:var(--c-muted)]"/>
            </span>
            <div>
              <div className="font-semibold">Validações & Prévia</div>
              <div className="muted text-sm">Checagem de duplicidade, normalização de CPF/CNPJ e status.</div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Prévia de erros e acertos",
              "Relatório de ajustes sugeridos",
              "Homologação antes do go-live",
            ].map(i=>(
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5"/><span className="muted">{i}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Passo a passo (stepper) */}
        <article className="md:col-span-3 card p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
              <Database className="w-5 h-5 text-[color:var(--c-muted)]"/>
            </span>
            <div>
              <div className="font-semibold">Como migramos (passo a passo)</div>
              <div className="muted text-sm">Fluxo guiado e reversível até a homologação.</div>
            </div>
          </div>
          <ol className="mt-4 space-y-3">
            {[
              { t: "Kickoff & escopo", d: "Levantamento de fontes, tabelas e escopo de histórico." },
              { t: "Coleta & mapeamento", d: "Recebemos arquivos/backups e mapeamos colunas para o modelo Progem." },
              { t: "Normalização & validação", d: "Tratamos formatos, CPF/CNPJ, duplicidades e consistência de chaves." },
              { t: "Carga em sandbox", d: "Importamos em ambiente de testes para prévia e ajustes finais." },
              { t: "Homologação", d: "Você valida e assina a conferência de amostras e relatórios." },
              { t: "Go-live & monitoramento", d: "Publicamos a base e acompanhamos os primeiros ciclos.", icon: Rocket },
            ].map((step, i)=>(
              <li key={i} className="flex items-start gap-3">
                <span className="grid place-content-center size-8 rounded-full bg-[color:var(--c-primary)] text-[var(--c-primary-contrast)] font-bold">
                  {i+1}
                </span>
                <div>
                  <div className="font-medium">{step.t}</div>
                  <div className="text-sm muted">{step.d}</div>
                </div>
              </li>
            ))}
          </ol>

          {/* Segurança & compliance */}
          <div className="mt-6 flex items-center gap-3">
            <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
              <ShieldCheck className="w-5 h-5 text-[color:var(--c-muted)]"/>
            </span>
            <div>
              <div className="font-semibold">Segurança & Compliance</div>
              <div className="muted text-sm">Criptografia em trânsito, acesso restrito e registros de auditoria.</div>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "Uploads seguros e segregação de ambientes",
              "Logs de importação e rastreabilidade",
              "Rollback assistido quando aplicável",
            ].map(i=>(
              <li key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5"/><span className="muted">{i}</span>
              </li>
            ))}
          </ul>

          {/* Aviso de custo sob orçamento */}
          <div className="mt-5 p-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-[color:var(--c-muted)]"/>
            <span className="muted">
              A migração possui <strong>custo sob orçamento</strong>, variando conforme volume de dados, complexidade do esquema
              e qualidade dos arquivos/backups.
            </span>
          </div>

          {/* Materiais de apoio */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/developers#migracao" className="btn btn-ghost text-sm inline-flex items-center gap-2">
              <Download className="w-4 h-4"/> Modelos de planilha (CSV/XLSX)
            </Link>
            <Link to="/developers#migracao" className="btn btn-ghost text-sm inline-flex items-center gap-2">
              <Download className="w-4 h-4"/> Checklist de migração (PDF)
            </Link>
          </div>
        </article>
      </main>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-sm px-3 py-1.5 inline-flex items-center gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)]">
              <Database className="w-4 h-4 text-[color:var(--c-muted)]"/>
              Pronto para migrar?
            </div>
            <h2 className="text-2xl font-semibold mt-3">Comece com nosso time de onboarding</h2>
            <p className="muted">
              Envie um exemplo de arquivo ou descreva seu backup (PostgreSQL, SQL Server, MySQL/MariaDB) para
              orçarmos com precisão.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
              Falar com um especialista
            </Link>
            <Link to="/developers#migracao" className="btn btn-ghost">
              Ver guias técnicos
            </Link>
          </div>
        </div>
      </section>
     {/* CTA fixo (mobile) */}
      <BottomDockCTA />
      <Footer/>
    </div>
  );
}

// src/pages/QuemSomos.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomDockCTA from "@/components/BottomDockCTA";
import AnimatedCounter from "@/components/AnimatedCounter";
import placeholder from "@/assets/img/placeholder.png";
import fototime from "@/assets/img/time/1.jpg";
import { setPageSEO } from "@/lib/seo";
import {
  ShieldCheck, Globe, Users, Rocket, Sparkles, HeartHandshake,
  Target, Clock, Building2, CheckCircle2, LineChart
} from "lucide-react";

const GridHalo = () => (
  <>
    {/* Halo radial */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -top-10 h-[220px] opacity-70 blur-3xl"
      style={{
        background:
          "radial-gradient(1100px 220px at 50% 0, color-mix(in oklab, var(--c-primary) 28%, transparent), transparent 60%)",
        zIndex: 0,
      }}
    />
    {/* Grid sutil */}
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
  </>
);

export default function QuemSomos(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Quem somos",
      description: "Conheça a Progem: missão, visão e valores. Nossa história, time e o compromisso com transparência e resultados."
    });
  },[]);

  const pillars = [
    { icon: ShieldCheck,     title: "Confiabilidade",       desc: "Segurança, disponibilidade e processos auditáveis." },
    { icon: Sparkles,        title: "Excelência",           desc: "Detalhe importa. Melhoramos continuamente cada fluxo." },
    { icon: HeartHandshake,  title: "Parceria",             desc: "Crescemos junto: sucesso do cliente como norte." },
    { icon: Target,          title: "Foco em resultado",    desc: "Produtos que reduzem custos e aumentam receita." },
  ];

  const timeline = [
    { year: "2019", title: "Início",        desc: "Progem nasce para atender empresas do setor funerário com gestão recorrente." },
    { year: "2022", title: "Whitelabels",   desc: "Apps e sites com a marca do cliente." },
    { year: "2024", title: "Ecossistema",   desc: "Analytics, APIs e parceiros estratégicos." },
    { year: "2025", title: "Expansão",      desc: "Fortalecimento no setor funerário e ampliação de integrações." },
  ];

  return (
    <div>
      <Header/>

      {/* HERO */}
      <section className="relative border-b border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden">
        <GridHalo />
        <div className="relative mx-auto max-w-7xl px-4 py-14 grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div style={{ zIndex: 1 }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
                <Building2 className="w-4 h-4 text-[color:var(--c-muted)]"/> Quem somos
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[var(--c-primary)] text-[var(--c-primary-contrast)] text-sm font-medium">
                Foco no setor funerário
              </span>
            </div>

            <h1 className="h1-fluid text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Tecnologia para negócios recorrentes no setor funerário com transparência e resultado.
            </h1>

            <p className="p-fluid muted mt-3 md:text-lg">
              A Progem nasceu para simplificar a gestão de contratos, cobranças e a experiência digital
              de organizações funerárias e negócios recorrentes. Unimos software, dados e atendimento próximo.
            </p>

            {/* CTAs no herói */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
                Solicitar Demonstração
              </Link>
              <Link to="/planos" className="btn btn-ghost">Ver Planos</Link>
            </div>

            {/* Trust strip (cards) */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: LineChart, title: "R$ 5 mi+ processados/mês", sub: "Pagamentos recorrentes com escala" },
                { icon: Building2, title: "Foco no setor funerário",  sub: "Operando desde 2019" },
                { icon: ShieldCheck, title: "SLA médio 99,9%",        sub: "Disponibilidade para operações críticas" },
              ].map(({icon:Icon, title, sub}, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center gap-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]/70 backdrop-blur"
                >
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-5 h-5 text-[color:var(--c-muted)]" />
                  </span>
                  <div>
                    <div className="font-semibold leading-tight">{title}</div>
                    <div className="muted text-[13px]">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)] aspect-[16/10]" style={{ zIndex: 1 }}>
            <img
              src={fototime}
              alt="Time Progem em operação"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* MISSÃO / VISÃO / VALORES */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe,  title: "Missão", desc: "Potencializar negócios recorrentes com produtos simples, seguros e mensuráveis." },
            { icon: Rocket, title: "Visão",  desc: "Ser a plataforma referência em performance e experiência whitelabel no segmento funerário." },
            { icon: Users,  title: "Valores",desc: "Integridade, foco no cliente, melhoria contínua e responsabilidade com dados." },
          ].map((c,i)=>{
            const Icon = c.icon;
            return (
              <article key={i} className="card p-6 hover:shadow-card transition">
                <div className="flex items-start gap-3">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-5 h-5 text-[color:var(--c-muted)]"/>
                  </span>
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <p className="muted text-sm mt-1">{c.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* MÉTRICAS (com contador animado) */}
        <section className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "anos de experiência", to: 5, prefix: "", suffix: "+", decimals: 0 },
            { label: "empresas atendidas",  to: 200, prefix: "", suffix: "+", decimals: 0 },
            { label: "volume transacionado/mês", to: 5, prefix: "R$ ", suffix: " mi+", decimals: 0 },
            { label: "SLA médio", to: 99.9, prefix: "", suffix: "%", decimals: 1 },
          ].map((m)=>(
            <div
              key={m.label}
              className="relative overflow-hidden rounded-2xl p-5 text-center border border-[var(--c-border)] bg-[var(--c-surface-2)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(600px 120px at 50% 0%, color-mix(in oklab, var(--c-primary) 26%, transparent), transparent)"
                }}
              />
              <div className="relative text-3xl font-bold">
                <AnimatedCounter to={m.to} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals}/>
              </div>
              <div className="relative muted text-sm mt-1">{m.label}</div>
            </div>
          ))}
        </section>

        {/* PILARES DA CULTURA */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Como trabalhamos</h2>
          <p className="muted mt-1">Princípios que orientam decisões de produto, suporte e implantação.</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-5">
            {pillars.map((p)=> {
              const Icon = p.icon;
              return (
                <div key={p.title} className="card p-6 hover:shadow-card transition">
                  <Icon className="w-6 h-6 text-[color:var(--c-muted)] mb-3"/>
                  <div className="font-semibold">{p.title}</div>
                  <p className="muted text-sm mt-1">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* LINHA DO TEMPO */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Nossa trajetória</h2>
          <div className="mt-6 relative">
            {/* Linha com gradiente */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px opacity-80"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--c-primary) 60%, transparent), var(--c-border) 30%, var(--c-border) 70%, color-mix(in oklab, var(--c-primary) 60%, transparent))"
              }}
            />
            <ul className="space-y-5">
              {timeline.map((t, i)=>(
                <li key={i} className="relative pl-12">
                  {/* Dot com glow */}
                  <span
                    className="absolute left-0 top-1.5 grid place-content-center w-8 h-8 rounded-full border border-[var(--c-border)] bg-[var(--c-surface-2)] text-xs font-semibold"
                    style={{ boxShadow: "0 0 0 6px color-mix(in oklab, var(--c-primary) 18%, transparent)" }}
                    aria-hidden
                  >
                    {t.year}
                  </span>
                  <div className="card p-4">
                    <div className="font-semibold">{t.title}</div>
                    <p className="muted text-sm mt-1">{t.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CONFIANÇA / SELOS */}
        <section className="mt-12">
          <div className="card p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Transparência e segurança em primeiro lugar</h3>
                <p className="muted text-sm mt-1">Monitoramento, TLS, backups e políticas de acesso com boas práticas de mercado.</p>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {[
                  "Criptografia em trânsito",
                  "Backups automáticos",
                  "Monitoramento 24/7",
                  "Boas práticas LGPD"
                ].map(item=>(
                  <li key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4"/> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Vamos juntos</div>
              <h3 className="text-2xl font-semibold mt-1">Conheça o ecossistema Progem por dentro</h3>
              <p className="muted">Agende uma conversa e veja como aceleramos a sua operação recorrente.</p>
            </div>
            <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
              Solicitar Demonstração
            </Link>
          </div>
        </section>
      </main>

      {/* Dock de CTA (mobile) */}
      <BottomDockCTA />

      <Footer/>
    </div>
  );
}

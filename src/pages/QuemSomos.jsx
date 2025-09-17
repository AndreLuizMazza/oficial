// src/pages/QuemSomos.jsx
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import placeholder from "@/assets/img/placeholder.png";
import { setPageSEO } from "@/lib/seo";
import {
  ShieldCheck, Globe, Users, Rocket, Sparkles, HeartHandshake,
  Target, Clock, Building2, CheckCircle2, LineChart
} from "lucide-react";

export default function QuemSomos(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Quem somos",
      description: "Conheça a Progem: missão, visão e valores. Nossa história, time e o compromisso com transparência e resultados."
    });
  },[]);

  const metrics = [
    { label: "anos de experiência", value: "5+" },
    { label: "empresas atendidas", value: "200+" },
    { label: "volume transacionado/mês", value: "R$ 5 mi+" },
    { label: "SLA médio", value: "99,9%" },
  ];

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
      <section className="border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
                <Building2 className="w-4 h-4 text-[color:var(--c-muted)]"/> Quem somos
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[var(--c-primary)] text-[var(--c-primary-contrast)] text-sm font-medium">
                Desde 2019
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Tecnologia para negócios recorrentes no setor funerário — com transparência e resultado.
            </h1>

            <p className="muted mt-3 text-lg">
              A Progem nasceu para simplificar a gestão de contratos, cobranças e a experiência digital
              de organizações funerárias e negócios recorrentes. Unimos software, dados e atendimento próximo.
            </p>

            {/* ✅ Trust strip abaixo do título */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="card p-4 flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <LineChart className="w-5 h-5 text-[color:var(--c-muted)]" />
                </span>
                <div>
                  <div className="font-semibold leading-tight">R$ 5 mi+ processados/mês</div>
                  <div className="muted text-[13px]">Pagamentos recorrentes com escala</div>
                </div>
              </div>

              <div className="card p-4 flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <Building2 className="w-5 h-5 text-[color:var(--c-muted)]" />
                </span>
                <div>
                  <div className="font-semibold leading-tight">Foco no setor funerário</div>
                  <div className="muted text-[13px]">Operando desde 2019</div>
                </div>
              </div>

              <div className="card p-4 flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <ShieldCheck className="w-5 h-5 text-[color:var(--c-muted)]" />
                </span>
                <div>
                  <div className="font-semibold leading-tight">SLA médio 99,9%</div>
                  <div className="muted text-[13px]">Disponibilidade para operações críticas</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)] aspect-[16/10]">
            <img
              src={placeholder}
              alt="Time Progem em operação"
              className="w-full h-full object-cover" loading="lazy"
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
              <article key={i} className="card p-6">
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

        {/* MÉTRICAS */}
        <section className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m=>(
            <div key={m.label} className="card p-5 text-center">
              <div className="text-3xl font-bold">{m.value}</div>
              <div className="muted text-sm mt-1">{m.label}</div>
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
                <div key={p.title} className="card p-6">
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
          <div className="mt-4 grid gap-4">
            {timeline.map((t, i)=>(
              <div key={i} className="card p-4 flex items-start gap-4">
                <div className="w-16 shrink-0 text-center">
                  <div className="text-xl font-bold">{t.year}</div>
                  <Clock className="w-4 h-4 mx-auto mt-1 text-[color:var(--c-muted)]" />
                </div>
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <p className="muted text-sm mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONFIANÇA / SELOS / ITENS */}
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
            <a href="/contato" className="btn btn-primary">Falar com um especialista</a>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  );
}

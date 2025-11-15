// src/pages/QuemSomos.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
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

export default function QuemSomos() {
  useEffect(() => {
    setPageSEO({
      title: "Progem • Quem somos",
      description:
        "Conheça a Progem: missão, visão e valores. Nossa história, time e o compromisso com transparência e resultados.",
    });
  }, []);

  const pillars = [
    { icon: ShieldCheck,     title: "Confiabilidade",    desc: "Segurança, disponibilidade e processos auditáveis." },
    { icon: Sparkles,        title: "Excelência",        desc: "Detalhe importa. Melhoramos continuamente cada fluxo." },
    { icon: HeartHandshake,  title: "Parceria",          desc: "Crescemos junto: sucesso do cliente como norte." },
    { icon: Target,          title: "Foco em resultado", desc: "Produtos que reduzem custos e aumentam receita." },
  ];

  const history = [
    {
      year: "2019",
      title: "O Começo de Uma Ideia que Mudaria Caminhos",
      paragraphs: [
        "Tudo começou com uma inquietação: por que a gestão de contratos e cobranças recorrentes ainda era tão complicada para tantas empresas?",
        "A partir dessa pergunta nasceu não apenas um sistema, mas um propósito.",
        "Foi em 2019 que demos nosso primeiro passo, determinados a trazer simplicidade, organização e previsibilidade para negócios que precisavam crescer com segurança.",
      ],
    },
    {
      year: "2022",
      title: "De Sistema a Ecossistema",
      paragraphs: [
        "Após anos entendendo de perto a dor dos clientes, percebemos que o futuro exigia algo maior.",
        "Assim, em 2022, deixamos de ser apenas um software para nos tornarmos um ecossistema conectado: Analytics avançado, integrações via API e parcerias estratégicas que ampliaram nosso poder de transformação.",
        "Era o início de uma nova fase — mais sólida, mais inteligente e muito mais ambiciosa.",
      ],
    },
    {
      year: "2023",
      title: "O Ano da Personalização e da Experiência",
      paragraphs: [
        "Com o avanço da nossa tecnologia, surgiu um desejo forte: e se nossos clientes pudessem ter suas próprias plataformas, com sua identidade e sua marca?",
        "Foi assim que, em 2023, lançamos apps e sites personalizados, reforçando a experiência e posicionando nossos clientes como protagonistas de seus próprios negócios.",
        "Ganhamos velocidade, flexibilidade e um diferencial que nos colocou em outro patamar.",
      ],
    },
    {
      year: "2024",
      title: "Crescer com Propósito",
      paragraphs: [
        "2024 marcou um dos anos mais importantes da nossa jornada.",
        "A equipe cresceu 60%, a infraestrutura evoluiu para equipamentos de última geração e a inovação passou a ser rotina.",
        "Este foi o período em que percebemos que não éramos apenas uma empresa de tecnologia — éramos uma empresa que movimenta resultados.",
      ],
    },
    {
      year: "2025",
      title: "A Consolidação de Uma Marca Forte",
      paragraphs: [
        "Em 2025, expandimos nossa presença e nos tornamos uma referência ainda mais sólida no setor funerário, reforçando nossa capacidade de entregar soluções estratégicas onde precisão, controle e confiança são essenciais.",
        "Foi o ano em que vimos nossa marca ganhar espaço, respeito e maturidade.",
        "E o mais inspirador é saber que estamos só no começo. Cada etapa da nossa trajetória carrega evolução, coragem e o compromisso de sempre criar tecnologia que aproxima empresas do seu potencial máximo.",
      ],
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative border-b border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden">
        <GridHalo />
        <div className="relative mx-auto max-w-7xl px-4 py-14 grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          <div style={{ zIndex: 1 }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-sm">
                <Building2 className="w-4 h-4 text-[color:var(--c-muted)]" /> Quem somos
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
              <Link to="/planos" className="btn btn-ghost">
                Ver Planos
              </Link>
            </div>

            {/* Trust strip (cards) */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: LineChart,
                  title: "Volume transacionado/mês R$ 6 MM",
                  sub: "Pagamentos recorrentes em escala",
                },
                {
                  icon: Building2,
                  title: "Foco no setor funerário",
                  sub: "Operando desde 2019",
                },
                {
                  icon: ShieldCheck,
                  title: "SLA médio 99,9%",
                  sub: "Disponibilidade para operações críticas",
                },
              ].map(({ icon: Icon, title, sub }, i) => (
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

          <div
            className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)] aspect-[16/10]"
            style={{ zIndex: 1 }}
          >
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
            {
              icon: Globe,
              title: "Missão",
              desc:
                "Inspirar empresas a atingirem seu potencial máximo por meio de uma gestão inteligente de contratos e recorrência — fortalecendo vendas, elevando a eficiência das cobranças e entregando experiências que encantam, com tecnologia avançada que une dados, inteligência e performance para impulsionar o sucesso.",
            },
            {
              icon: Rocket,
              title: "Visão",
              desc:
                "Construir um novo paradigma na gestão de contratos e recorrência, tornando-nos a plataforma que redefine como empresas vendem, cobram e escalam — sendo reconhecida como sinônimo de inovação contínua, alta performance e crescimento sem fronteiras.",
            },
            {
              icon: Users,
              title: "Valores",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            const isValores = c.title === "Valores";
            return (
              <article key={i} className="card p-6 hover:shadow-card transition">
                <div className="flex items-start gap-3">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                    <Icon className="w-5 h-5 text-[color:var(--c-muted)]" />
                  </span>
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    {isValores ? (
                      <ul className="muted text-sm mt-2 space-y-1.5">
                        <li>
                          <span className="font-semibold">Integridade:</span>{" "}
                          Agir com ética, transparência e responsabilidade.
                        </li>
                        <li>
                          <span className="font-semibold">Foco no Cliente:</span>{" "}
                          Decisões orientadas pela jornada e experiência do cliente.
                        </li>
                        <li>
                          <span className="font-semibold">Evolução Contínua:</span>{" "}
                          Inovar sempre, aprendendo e melhorando todos os dias.
                        </li>
                        <li>
                          <span className="font-semibold">Responsabilidade com Dados:</span>{" "}
                          Segurança, inteligência e uso ético da informação.
                        </li>
                        <li>
                          <span className="font-semibold">Inovação com Propósito:</span>{" "}
                          Tecnologia que gera impacto real e crescimento.
                        </li>
                        <li>
                          <span className="font-semibold">Alta Performance:</span>{" "}
                          Eficiência, precisão e resultados consistentes.
                        </li>
                      </ul>
                    ) : (
                      <p className="muted text-sm mt-1">{c.desc}</p>
                    )}
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
            { label: "empresas atendidas", to: 300, prefix: "", suffix: "+", decimals: 0 },
            {
              label: "volume transacionado/mês",
              to: 6,
              prefix: "R$ ",
              suffix: " MM",
              decimals: 0,
            },
            { label: "SLA médio", to: 99.9, prefix: "", suffix: "%", decimals: 1 },
          ].map((m) => (
            <div
              key={m.label}
              className="relative overflow-hidden rounded-2xl p-5 text-center border border-[var(--c-border)] bg-[var(--c-surface-2)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(600px 120px at 50% 0%, color-mix(in oklab, var(--c-primary) 26%, transparent), transparent)",
                }}
              />
              <div className="relative text-3xl font-bold">
                <AnimatedCounter
                  to={m.to}
                  prefix={m.prefix}
                  suffix={m.suffix}
                  decimals={m.decimals}
                />
              </div>
              <div className="relative muted text-sm mt-1">{m.label}</div>
            </div>
          ))}
        </section>

        {/* PILARES DA CULTURA */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Como trabalhamos</h2>
          <p className="muted mt-1">
            Princípios que orientam decisões de produto, suporte e implantação.
          </p>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-5">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="card p-6 hover:shadow-card transition">
                  <Icon className="w-6 h-6 text-[color:var(--c-muted)] mb-3" />
                  <div className="font-semibold">{p.title}</div>
                  <p className="muted text-sm mt-1">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* LINHA DO TEMPO / HISTÓRIA */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">
            A Nossa História — Uma Jornada de Crescimento e Inovação
          </h2>
          <div className="mt-6 relative">
            {/* Linha com gradiente */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px opacity-80"
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--c-primary) 60%, transparent), var(--c-border) 30%, var(--c-border) 70%, color-mix(in oklab, var(--c-primary) 60%, transparent))",
              }}
            />
            <ul className="space-y-5">
              {history.map((item, i) => (
                <li key={i} className="relative pl-12">
                  {/* Dot com ano */}
                  <span
                    className="absolute left-0 top-1.5 grid place-content-center w-8 h-8 rounded-full border border-[var(--c-border)] bg-[var(--c-surface-2)] text-xs font-semibold"
                    style={{
                      boxShadow:
                        "0 0 0 6px color-mix(in oklab, var(--c-primary) 18%, transparent)",
                    }}
                    aria-hidden
                  >
                    {item.year}
                  </span>
                  <div className="card p-4 space-y-2">
                    <div className="font-semibold">{item.title}</div>
                    {item.paragraphs.map((p, idx) => (
                      <p key={idx} className="muted text-sm">
                        {p}
                      </p>
                    ))}
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
                <h3 className="text-xl font-semibold">
                  Transparência e segurança em primeiro lugar
                </h3>
                <p className="muted text-sm mt-1">
                  Monitoramento, TLS, backups e políticas de acesso com boas práticas de mercado.
                </p>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {[
                  "Criptografia em trânsito",
                  "Backups automáticos",
                  "Monitoramento 24/7",
                  "Boas práticas LGPD",
                ].map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {item}
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
              <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">
                Vamos juntos
              </div>
              <h3 className="text-2xl font-semibold mt-1">
                Conheça o ecossistema Progem por dentro
              </h3>
              <p className="muted">
                Agende uma conversa e veja como aceleramos a sua operação recorrente.
              </p>
            </div>
            <Link to="/demo" data-cta="demo" className="btn btn-primary btn-demo">
              Solicitar Demonstração
            </Link>
          </div>
        </section>
      </main>

      {/* Dock de CTA (mobile) */}
      <BottomDockCTA />
    </div>
  );
}

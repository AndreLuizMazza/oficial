// src/pages/GestaoWeb.jsx
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Progemhome from "@/assets/img/progemhome.png";
import { setPageSEO } from "@/lib/seo";
import {
  ShieldCheck, Users, ClipboardList, Receipt, BarChart3, Cable,
  CheckCircle2, Layers, Wallet, HandCoins, Wrench, ShoppingCart, Package, Truck
} from "lucide-react";

export default function GestaoWeb(){
  useEffect(()=>{
    setPageSEO({
      title: "Progem • Software de Gestão Web",
      description:
        "Software de gestão empresarial 100% web: contratos, assinaturas, cobranças, financeiro, caixas, serviços, compras, vendas e estoque."
    });
  },[]);

  const features = [
    { icon: ClipboardList, title: "Contratos & Assinaturas", desc: "Criação, renovação e reajustes com regras por plano e dependentes." },
    { icon: Receipt,       title: "Cobrança Recorrente",     desc: "Carnês/boletos, Pix e cartão, com baixa automática e conciliação." },
    { icon: ShieldCheck,   title: "Inadimplência & Regras",  desc: "Régua de cobrança multicanais, políticas e alertas operacionais." },
    { icon: Users,         title: "Portais & Apps",          desc: "Área do cliente + apps de vendedor e cobrador (online/offline)." },
    { icon: BarChart3,     title: "Analytics em Tempo Real", desc: "KPIs operacionais, receita, churn e relatórios executivos." },
    { icon: Cable,         title: "APIs & Webhooks",         desc: "Integração com WhatsApp, obituário digital, clubes de desconto e mais." },
  ];

  const steps = [
    { step: "1", title: "Modelagem",    desc: "Cadastro de planos, políticas, integrações e equipes." },
    { step: "2", title: "Implantação",  desc: "Migração de dados (clientes, contratos, histórico) e testes." },
    { step: "3", title: "Go-live",      desc: "Publicação, treinamentos e acompanhamento do time Progem." },
    { step: "4", title: "Evolução",     desc: "Ajustes finos, dashboards, campanhas e automações." },
  ];

  const integrations = [
    { title: "Pagamentos", items: ["Pix", "Boletos/Carnês", "Cartões", "Conciliação & Baixa"] },
    { title: "Canais",     items: ["WhatsApp Automação", "E-mail Transacional", "Webhooks"] },
    { title: "Produtos",   items: ["Obituário Digital (NaLápide)", "Clube de Benefícios", "Site Premium"] },
  ];

  const faqs = [
    { q: "Para quais empresas o Progem é indicado?", a: "Empresas que trabalham com contratos e receita recorrente (planos/assinaturas) e que desejam padronizar cobrança, reduzir inadimplência e integrar operações." },
    { q: "Como funciona a precificação?", a: "Todos os recursos estão incluídos. O valor varia pelo número de contratos ativos. Consulte a página de Planos." },
    { q: "Quais meios de pagamento são suportados?", a: "Pix, boletos/carnês e cartões, com conciliação e baixa automática. As taxas estão na página de Taxas & Cobrança." },
    { q: "É possível migrar meus dados?", a: "Sim. Realizamos importação de clientes, contratos e histórico, com validações e testes antes do go-live." },
    { q: "Posso usar minha marca (whitelabel)?", a: "Sim. Oferecemos site institucional e apps whitelabel, com sua identidade, ícones e cores." },
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
                <Layers className="w-4 h-4 text-[color:var(--c-muted)]"/> Software de Gestão Web
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[var(--c-primary)] text-[var(--c-primary-contrast)] text-sm font-medium">
                100% web
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
              Gestão completa — contratos, cobranças, financeiro e operação.
            </h1>
            <p className="muted mt-3 text-lg">
              Reduza inadimplência, padronize processos e integre sua operação de ponta a ponta.
              O Progem centraliza <strong>contratos</strong>, <strong>cobranças</strong>, <strong>pagamentos</strong>, <strong>financeiro</strong> e <strong>analytics</strong>
              com performance e segurança.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/demo" className="btn btn-primary">Solicitar Demonstração</a>
              <a href="/planos" className="btn btn-ghost">Ver planos</a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-surface-2)] aspect-[16/10]">
            <img src={Progemhome} alt="Painéis do Software de Gestão Progem" className="w-full h-full object-cover" loading="lazy"/>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* RECURSOS GERAIS */}
        <section>
          <h2 className="text-2xl font-semibold">Recursos principais</h2>
          <p className="muted mt-1">Tudo o que sua operação precisa — com foco em recorrência e eficiência.</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-5">
            {features.map((f)=> {
              const Icon = f.icon;
              return (
                <article key={f.title} className="card p-6">
                  <Icon className="w-6 h-6 text-[color:var(--c-muted)] mb-3"/>
                  <div className="font-semibold">{f.title}</div>
                  <p className="muted text-sm mt-1">{f.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* MÓDULOS OPERACIONAIS (simplificado) */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Módulos operacionais</h2>
          <p className="muted mt-1">Organize o dia a dia financeiro e operacional sem complicação.</p>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-5">
            <article id="financeiro" className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <Wallet className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Financeiro</div>
                  <p className="muted text-sm mt-1">Contas, fluxo e relatórios conectados aos contratos.</p>
                </div>
              </div>
            </article>

            <article id="caixas" className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <HandCoins className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Controle de Caixas</div>
                  <p className="muted text-sm mt-1">Abertura, fechamento e conferência por operador.</p>
                </div>
              </div>
            </article>

            <article id="servicos" className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <Wrench className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Gestão de Serviços</div>
                  <p className="muted text-sm mt-1">OS, agenda e status com notificações.</p>
                </div>
              </div>
            </article>

            <article id="compras" className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <Truck className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Compras</div>
                  <p className="muted text-sm mt-1">Pedidos, fornecedores e entradas de notas.</p>
                </div>
              </div>
            </article>

            <article id="vendas" className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <ShoppingCart className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Vendas (Produtos & Serviços)</div>
                  <p className="muted text-sm mt-1">Itens faturados com vínculo ao contrato.</p>
                </div>
              </div>
            </article>

            <article id="estoque" className="card p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface-2)]">
                  <Package className="w-5 h-5 text-[color:var(--c-muted)]"/>
                </span>
                <div>
                  <div className="font-semibold">Controle de Estoque</div>
                  <p className="muted text-sm mt-1">Movimentação, inventário e múltiplos depósitos.</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Como funciona</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {steps.map(s=>(
              <div key={s.step} className="card p-5">
                <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Etapa {s.step}</div>
                <div className="font-semibold mt-1">{s.title}</div>
                <p className="muted text-sm mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INTEGRAÇÕES */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Integrações</h2>
          <p className="muted mt-1">Conecte ferramentas e canais para automatizar fluxos e ganhar escala.</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {integrations.map(group=>(
              <div key={group.title} className="card p-5">
                <div className="font-semibold">{group.title}</div>
                <ul className="mt-2 space-y-1 text-sm">
                  {group.items.map(i=>(
                    <li key={i} className="inline-flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4"/> <span className="muted">{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SEGURANÇA */}
        <section className="mt-12">
          <div className="card p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Segurança e conformidade</h3>
                <p className="muted text-sm mt-1">Criptografia em trânsito, monitoramento, backups e governança de acesso. Alinhado à LGPD.</p>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {["Criptografia em trânsito","Backups automáticos","Monitoramento 24/7","Boas práticas LGPD"].map(item=>(
                  <li key={item} className="inline-flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4"/> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Perguntas frequentes</h2>
          <div className="mt-4 space-y-3">
            {faqs.map(({q,a})=>(
              <details key={q} className="card p-4">
                <summary className="cursor-pointer font-medium">{q}</summary>
                <p className="muted mt-2 text-sm">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mt-12">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">Pronto para decolar</div>
              <h3 className="text-2xl font-semibold mt-1">Veja o Progem em ação</h3>
              <p className="muted">Agende uma demonstração e conheça o fluxo completo — da venda ao faturamento.</p>
            </div>
            <div className="flex gap-2">
              <a href="/demo" className="btn btn-primary">Solicitar Demonstração</a>
              <a href="/planos" className="btn btn-ghost">Ver Planos</a>
              <a href="/taxas" className="btn btn-ghost">Taxas & Cobrança</a>
            </div>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  );
}

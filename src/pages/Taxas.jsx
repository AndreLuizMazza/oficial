// src/pages/Taxas.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { setPageSEO } from "@/lib/seo";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const taxasPagamento = [
  { tipo: "Pix", valor: "R$0,99", icon: "💠" },
  { tipo: "Boleto (Liquidado)", valor: "R$2,30", icon: "📄" },
];

const taxasCartoes = [
  { bandeira: "Mastercard",        gatilho: "R$0,29", taxa: "3,59%" },
  { bandeira: "Visa",              gatilho: "R$0,29", taxa: "3,59%" },
  { bandeira: "Elo",               gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "American Express",  gatilho: "R$0,29", taxa: "4,79%" },
  { bandeira: "Hipercard",         gatilho: "R$0,29", taxa: "3,79%" },
  { bandeira: "Discover",          gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "Diners Club",       gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "JCB",               gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "EnRoute",           gatilho: "R$0,29", taxa: "4,09%" },
  { bandeira: "Aura",              gatilho: "R$0,29", taxa: "4,09%" },
];

const faqs = [
  {
    q: "O que é considerado um contrato ativo?",
    a: "Contratos com status 'ativo' dentro do período de faturamento. Cancelados, suspensos ou em implantação não entram na contagem."
  },
  {
    q: "Há cobrança para boletos emitidos, baixados ou cancelados?",
    a: "Não. A taxa de boleto aplica-se apenas quando há liquidação (pagamento confirmado). Emissão, baixa manual ou cancelamento não geram tarifa."
  },
  {
    q: "O que significa 'gatilho' nos cartões?",
    a: "É um valor fixo por transação cobrado pelo adquirente/gateway, somado ao percentual da taxa da bandeira."
  },
  {
    q: "Ultrapassei minha faixa de contratos. O que acontece?",
    a: "Você pode migrar para a faixa seguinte (ex.: Pro → Enterprise) ou contratar um add-on conforme o volume. Nosso time orienta o melhor cenário."
  },
  {
    q: "Posso antecipar recebíveis de cartão?",
    a: "Sim. A antecipação é opcional e possui custo do adquirente. Se desejar, ajudamos a habilitar e simular."
  }
];

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-[var(--c-border)] rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]">
      {items.map((it, i) => {
        const expanded = open === i;
        return (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              onClick={() => setOpen(expanded ? null : i)}
              aria-expanded={expanded}
            >
              <span className="font-medium">{it.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && (
              <div className="px-4 pb-4 text-sm muted">
                {it.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Taxas() {
  useEffect(() => {
    setPageSEO({
      title: "Progem • Taxas e formas de cobrança",
      description:
        "Transparência nas taxas: Pix, boleto liquidado e cartões por bandeira. Entenda gatilhos, percentuais e perguntas frequentes."
    });
  }, []);

  return (
    <div>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Nossas Taxas</h1>
          <p className="muted mt-2">
            Transparência nas modalidades de cobrança e nos custos de pagamento.
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Taxas de Pagamento */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-center md:text-left">Taxas de Pagamento</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--c-surface-2)]">
                  <tr>
                    <th className="text-left px-4 py-3">Tipo</th>
                    <th className="text-left px-4 py-3">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {taxasPagamento.map((t, i) => (
                    <tr key={i} className="border-t border-[var(--c-border)]">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span aria-hidden>{t.icon}</span>
                        {t.tipo}
                      </td>
                      <td className="px-4 py-3">{t.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-center md:text-left muted">
              * Não cobramos taxas para boletos emitidos, baixados ou cancelados.
            </p>
          </section>

          {/* Taxas de Cartões */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-center md:text-left">Taxas de Cartões</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--c-surface-2)]">
                  <tr>
                    <th className="text-left px-4 py-3">Bandeira</th>
                    <th className="text-left px-4 py-3">Gatilho</th>
                    <th className="text-left px-4 py-3">Taxa</th>
                  </tr>
                </thead>
                <tbody>
                  {taxasCartoes.map((c, i) => (
                    <tr key={i} className="border-t border-[var(--c-border)]">
                      <td className="px-4 py-3">{c.bandeira}</td>
                      <td className="px-4 py-3">{c.gatilho}</td>
                      <td className="px-4 py-3">{c.taxa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-3">Perguntas frequentes</h2>
          <Accordion items={faqs} />
        </section>

        {/* CTA final */}
        <section className="mt-10">
          <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm uppercase tracking-wide text-[color:var(--c-muted)]">
                Precisa de ajuda?
              </div>
              <h3 className="text-2xl font-semibold mt-1">Vamos calcular o melhor cenário para sua operação</h3>
              <p className="muted">Simulamos custos por volume, bandeira e meios de pagamento.</p>
            </div>
            <a href="/contato" className="btn btn-primary">Falar com um especialista</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

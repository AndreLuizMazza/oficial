export default function LogosBar(){
  const logos = ['Patense','Bom Jesus','Pax Center','Memorial X','Crematório Y']
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 opacity-80">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 place-items-center text-sm">
          {logos.map((l,i)=>(<div key={i} className="text-[color:var(--c-muted)]">{l}</div>))}
        </div>
      </div>
    </section>
  )
}

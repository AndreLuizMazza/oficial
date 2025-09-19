// src/components/LogoCloud.jsx
export default function LogoCloud({ logos=[] }){
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
      {logos.map((src,i)=>(
        <img key={i} src={src} alt="" className="h-8 w-auto mx-auto opacity-70 hover:opacity-100 transition
          filter grayscale hover:grayscale-0" loading="lazy"/>
      ))}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, englishScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const translations = {
 nl: {
  concept:"MCC ontwerpconcept. Geen officiële website.",
  services:"Behandelingen",visit:"Vind ons",book:"Afspraak bekijken",menu:"Menu",
  heading:"Jouw stijl. Tot in detail.",serviceNote:"Voorbeeldbehandelingen voor dit ontwerp. Aanbod en tarieven moeten nog worden bevestigd.",
  treatments:["Knippen","Baard","Knippen + baard"],
  descriptions:["Van een frisse update tot een andere look. Kies deze voorbeeldbehandeling om de afspraakdemo te proberen.","Een verzorgde vorm en strakke contouren. Dit is een voorbeeld van hoe een behandeling op de website kan staan.","Haar en baard in één afspraak. Bekijk hoe klanten eenvoudig hun voorkeur kunnen doorgeven."],
  selectService:"Kies deze optie",imageNote:"AI-conceptbeeld. Geen foto van de echte zaak.",
  bookingHeading:"Neem plaats.",bookingIntro:"Zo eenvoudig kan een afspraak beginnen. Probeer de demo en bekijk je voorbeeldbevestiging.",
  demoNote:"Alle keuzes zijn voorbeelden. Er wordt niets verstuurd of geboekt.",
  treatment:"Behandeling",day:"Voorkeursdag",moment:"Voorkeursmoment",days:["Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"],moments:["Ochtend","Middag","Avond"],
  sample:"Voorbeeldafspraak",selected:"Jouw keuze",preview:"Voorbeeld bekijken",reset:"Opnieuw proberen",
  done:"Zo ziet je bevestiging eruit.",doneText:"Dit is een demo. Er is niets verstuurd en geen afspraak geboekt.",
  choose:"Kies een behandeling om verder te gaan.",receiptNote:"Beschikbaarheid en tarieven worden pas door de barbershop bevestigd.",
  visitTitle:"Tot zo, Zwijndrecht.",phone:"Telefoon",hours:"Bel voor actuele openingstijden en beschikbaarheid.",route:"Route bekijken",
  footer:"Een websiteconcept van MCC voor Tip.TopBarbershop.",footerNote:"Beeld, merkontwerp en behandelingsoverzicht zijn conceptueel. Geen officiële samenwerking of boekingsservice.",
  photoCredit:"Conceptbeelden gemaakt voor dit ontwerp.",skip:"Naar de inhoud",summary:"Afspraakoverzicht"
 },
 en: {
  concept:"MCC design concept. Not the official website.",
  services:"Services",visit:"Find us",book:"Try the demo",menu:"Menu",
  heading:"Your style. Every detail.",serviceNote:"Sample services for this design. The actual offering and prices need confirmation.",
  treatments:["Haircut","Beard trim","Haircut + beard"],
  descriptions:["A fresh update or a different look. Choose this sample service to try the booking demo.","A neat shape and defined contours. An example of how a service could appear on the website.","Hair and beard in one appointment. See how customers could easily share their preferences."],
  selectService:"Choose this option",imageNote:"AI concept image. Not a photograph of the actual shop.",
  bookingHeading:"Take a seat.",bookingIntro:"This is how simple booking could feel. Try the demo and preview your confirmation.",
  demoNote:"All choices are examples. Nothing is submitted or booked.",
  treatment:"Service",day:"Preferred day",moment:"Preferred time",days:["Tuesday","Wednesday","Thursday","Friday","Saturday"],moments:["Morning","Afternoon","Evening"],
  sample:"Sample appointment",selected:"Your selection",preview:"Preview confirmation",reset:"Try again",
  done:"Your confirmation preview.",doneText:"This is a demo. Nothing has been submitted and no appointment has been booked.",
  choose:"Choose a service to continue.",receiptNote:"Availability and prices would be confirmed by the barbershop.",
  visitTitle:"See you, Zwijndrecht.",phone:"Phone",hours:"Call for current opening hours and availability.",route:"Get directions",
  footer:"A website concept by MCC for Tip.TopBarbershop.",footerNote:"Images, branding and service choices are conceptual. No official partnership or booking service.",
  photoCredit:"Concept imagery created for this design.",skip:"Skip to content",summary:"Appointment summary"
 }
} as const;
export default function App(){
 const [lang,setLang]=useState<"nl"|"en">("nl");
 const [menu,setMenu]=useState(false);
 const [active,setActive]=useState(0);
 const [service,setService]=useState<number|null>(null);
 const [day,setDay]=useState(0);
 const [moment,setMoment]=useState(1);
 const [confirmed,setConfirmed]=useState(false);
 const [error,setError]=useState(false);
 const receiptRef=useRef<HTMLDivElement>(null);
 const t=translations[lang];
 useEffect(()=>{document.documentElement.lang=lang;},[lang]);
 useEffect(()=>{
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  gsap.registerPlugin(ScrollTrigger);
  const lenis=new Lenis({autoRaf:false,anchors:true,duration:0.85});
  const tick=(time:number)=>lenis.raf(time*1000);
  lenis.on("scroll",ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  const ctx=gsap.context(()=>{
   gsap.from(".service-layout",{y:24,duration:0.8,ease:"power2.out",scrollTrigger:{trigger:".service-layout",start:"top 92%"}});
  });
  return()=>{ctx.revert();gsap.ticker.remove(tick);lenis.destroy();};
 },[]);
 function pick(i:number){setService(i);setError(false);setConfirmed(false);}
 function confirm(){
  if(service===null){setError(true);return;}
  setConfirmed(true);
  requestAnimationFrame(()=>receiptRef.current?.focus());
 }
 return (
 <div className="tiptop-site">
  <a href="#inhoud" className="skip-link">{t.skip}</a>
  <div className="concept-banner"><span>MCC / CONCEPT</span><p>{t.concept}</p></div>
  <header className="site-header">
   <a className="brand-lockup" href="#top" aria-label="Tip.TopBarbershop">
    <img src="./assets/mark.png" alt="" width="42" height="42" role="presentation"/>
    <span>Tip.Top<span className="brand-small">BARBERSHOP</span></span>
   </a>
   <nav id="mobile-navigation" className={menu?"main-nav is-open":"main-nav"} aria-label={lang==="nl"?"Hoofdnavigatie":"Main navigation"}>
    <a href="#behandelingen" onClick={()=>setMenu(false)}>{t.services}</a>
    <a href="#bezoek" onClick={()=>setMenu(false)}>{t.visit}</a>
    <a className="nav-book" href="#afspraak" onClick={()=>setMenu(false)}>{t.book}<span aria-hidden="true">↗</span></a>
   </nav>
   <div className="header-controls">
    <div className="language-switch" aria-label="Language">
     <button type="button" aria-pressed={lang==="nl"} onClick={()=>setLang("nl")}>NL</button>
     <span aria-hidden="true">/</span>
     <button type="button" aria-pressed={lang==="en"} onClick={()=>setLang("en")}>EN</button>
    </div>
    <button className="menu-toggle" type="button" aria-expanded={menu} aria-controls="mobile-navigation" onClick={()=>setMenu(!menu)}>{menu?"×":t.menu}</button>
   </div>
  </header>
  <main id="inhoud">
   <div className="hero-wrap">
    <ScrollScrub scenes={lang==="nl"?scrollScrubScenes:englishScenes} theme={scrollScrubTheme}/>
    <div className="hero-caption">{t.imageNote}</div>
   </div>
   <section id="behandelingen" className="services-section page-section">
    <div className="section-intro"><h2>{t.heading}</h2><p>{t.serviceNote}</p></div>
    <div className="service-layout">
     <div className="service-list">
      {t.treatments.map((name,i)=>(
       <div className="service-item" key={i}>
        <h3><button type="button" aria-expanded={active===i} aria-controls={"service-"+i} onClick={()=>setActive(active===i?-1:i)}>
         <img src={"./assets/icon-"+i+".png"} alt="" role="presentation" width="36" height="36"/><span>{name}</span><span className="accordion-symbol" aria-hidden="true">{active===i?"−":"+"}</span>
        </button></h3>
        <div id={"service-"+i} hidden={active!==i} className="service-detail">
         <p>{t.descriptions[i]}</p><a href="#afspraak" onClick={()=>pick(i)}>{t.selectService}<span aria-hidden="true">↗</span></a>
        </div>
       </div>
      ))}
     </div>
     <figure className="tools-figure"><img src="./assets/tools.webp" alt={lang==="nl"?"Conceptbeeld van een kappersschaar en kam":"Concept image of barber scissors and comb"} width="720" height="960" loading="lazy"/><figcaption>{t.imageNote}</figcaption></figure>
    </div>
   </section>
   <section id="afspraak" className="booking-section page-section">
    <div className="booking-heading"><h2>{t.bookingHeading}</h2><p>{t.bookingIntro}</p></div>
    <div className="booking-grid">
     <form className="booking-form" onSubmit={e=>{e.preventDefault();confirm();}} noValidate>
      <fieldset aria-describedby={error?"service-error":"booking-disclosure"}>
       <legend>{t.treatment}</legend>
       <div className="treatment-options">{t.treatments.map((name,i)=><label className={service===i?"treatment-choice selected":"treatment-choice"} key={i}><input type="radio" name="service" value={i} checked={service===i} onChange={()=>pick(i)} required/><span>{name}</span><span className="radio-mark" aria-hidden="true"/></label>)}</div>
       {error&&<p className="form-error" id="service-error" role="alert">{t.choose}</p>}
      </fieldset>
      <div className="preference-row">
       <div><label htmlFor="day">{t.day}</label><select id="day" value={day} onChange={e=>{setDay(Number(e.target.value));setConfirmed(false);}}>{t.days.map((d,i)=><option value={i} key={d}>{d}</option>)}</select></div>
       <div><label htmlFor="moment">{t.moment}</label><select id="moment" value={moment} onChange={e=>{setMoment(Number(e.target.value));setConfirmed(false);}}>{t.moments.map((m,i)=><option value={i} key={m}>{m}</option>)}</select></div>
      </div>
      <button className="booking-stamp" type="submit">{t.preview}<span aria-hidden="true">↗</span></button>
      <p className="demo-disclosure" id="booking-disclosure">{t.demoNote}</p>
     </form>
     <div className={confirmed?"appointment-receipt confirmed":"appointment-receipt"} ref={receiptRef} tabIndex={-1} role="region" aria-label={t.summary}>
      <div className="receipt-heading"><img src={confirmed?"./assets/icon-5.png":"./assets/icon-3.png"} alt="" role="presentation" width="38" height="38"/><span>{t.sample}</span><span className="receipt-monogram">TT.</span></div>
      {confirmed?<div className="confirmation-message" role="status"><h3>{t.done}</h3><p>{t.doneText}</p></div>:<h3>{t.selected}</h3>}
      <dl>
       <div><dt>{t.treatment}</dt><dd>{service===null?"...":t.treatments[service]}</dd></div>
       <div><dt>{t.day}</dt><dd>{t.days[day]}</dd></div>
       <div><dt>{t.moment}</dt><dd>{t.moments[moment]}</dd></div>
      </dl>
      <div className="receipt-bottom"><p>{t.receiptNote}</p>{confirmed&&<button type="button" className="reset-booking" onClick={()=>{setConfirmed(false);setService(null);setDay(0);setMoment(1);}}>{t.reset} ↺</button>}</div>
     </div>
    </div>
   </section>
   <section id="bezoek" className="visit-section page-section">
    <h2>{t.visitTitle}</h2>
    <div className="visit-layout">
     <div className="address-block"><img src="./assets/icon-4.png" alt="" role="presentation" width="42" height="42"/><address>Troelstraplein 7<span>3332 JB Zwijndrecht</span></address>
     <a className="route-link" href="https://www.google.com/maps/dir/?api=1&destination=Troelstraplein+7%2C+3332+JB+Zwijndrecht%2C+Netherlands" target="_blank" rel="noopener noreferrer">{t.route}<span aria-hidden="true">↗</span></a></div>
     <div className="contact-rail"><p>{t.phone}</p><a href="tel:+31653665796">06 53665796</a><p>{t.hours}</p></div>
    </div>
   </section>
  </main>
  <footer className="site-footer">
   <div className="footer-wordmark" aria-hidden="true">Tip<span>.</span>Top</div>
   <div className="footer-copy"><strong>{t.footer}</strong><p>{t.footerNote}</p><p>{t.photoCredit}</p></div>
   <div className="footer-bottom"><span>MCC CONCEPT STUDIO</span><a href="#top">Tip.TopBarbershop ↗</a></div>
  </footer>
 </div>
 );
}

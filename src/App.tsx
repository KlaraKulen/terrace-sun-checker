import { useState } from "react";

const SC = (() => {
  const PI=Math.PI,sin=Math.sin,cos=Math.cos,tan=Math.tan,
        asin=Math.asin,atan=Math.atan2,rad=PI/180,e=rad*23.4397;
  const smAnomaly=d=>rad*(357.5291+0.98560028*d);
  const eclLon=M=>M+rad*(1.9148*sin(M)+0.02*sin(2*M)+0.0003*sin(3*M))+rad*102.9372+PI;
  const decl=l=>asin(sin(l)*sin(e));
  const ra=l=>atan(sin(l)*cos(e),cos(l));
  const st=(d,lw)=>rad*(280.16+360.9856235*d)-lw;
  const days=dt=>dt.valueOf()/86400000-0.5+2440588-2451545;
  return {
    pos(dt,lat,lng){
      const lw=rad*-lng,phi=rad*lat,d=days(dt),M=smAnomaly(d),L=eclLon(M),
            dec=decl(L),H=st(d,lw)-ra(L);
      return {alt:asin(sin(phi)*sin(dec)+cos(phi)*cos(dec)*cos(H))};
    },
    times(dt,lat,lng){
      const lw=rad*-lng,phi=rad*lat,d=days(dt),M=smAnomaly(d),L=eclLon(M),dec=decl(L);
      const Jn=2451545+0.0009+(lw/(2*PI))+Math.round(d-lw/(2*PI));
      const w=Math.acos((sin(rad*-0.833)-sin(phi)*sin(dec))/(cos(phi)*cos(dec)));
      return{
        rise:new Date((Jn-w/(2*PI)-2440588+0.5)*86400000),
        set: new Date((Jn+w/(2*PI)-2440588+0.5)*86400000)
      };
    }
  };
})();

const FALLBACK = {
  "paris":[48.857,2.352,[5,6,9,12,17,20,23,23,19,14,8,5],[75,70,65,62,62,58,52,52,60,70,76,76]],
  "london":[51.507,-0.128,[5,5,8,10,14,17,19,19,16,12,8,5],[78,72,65,62,62,58,55,57,65,74,78,80]],
  "madrid":[40.416,-3.703,[6,8,11,13,18,24,29,28,23,16,10,6],[52,48,44,46,43,30,15,17,32,52,58,56]],
  "barcelona":[41.385,2.173,[10,11,13,15,19,23,26,27,24,19,14,10],[55,50,50,55,55,45,30,32,48,60,62,58]],
  "rome":[41.902,12.496,[8,9,12,15,20,25,28,28,24,18,13,9],[56,50,48,48,45,30,18,20,38,55,60,60]],
  "amsterdam":[52.370,4.895,[3,4,7,10,14,17,20,20,16,12,7,4],[78,72,65,62,60,58,56,58,66,74,80,82]],
  "berlin":[52.520,13.405,[1,2,6,11,16,20,23,22,17,11,6,2],[72,65,58,55,56,54,50,52,58,66,72,75]],
  "new york":[40.713,-74.006,[0,1,5,11,17,22,25,24,20,14,8,2],[58,56,56,54,54,50,48,50,54,54,58,58]],
  "tokyo":[35.690,139.692,[5,6,9,14,19,23,27,28,24,18,12,7],[46,48,48,52,52,60,52,44,54,56,46,42]],
  "sydney":[33.868,151.207,[23,23,22,19,16,13,12,13,15,18,20,22],[38,38,40,44,50,54,54,50,44,38,36,36]],
  "dubai":[25.204,55.270,[18,20,23,28,34,36,38,38,35,31,25,20],[20,18,14,10,5,2,2,2,3,5,12,18]],
  "singapore":[1.290,103.852,[27,28,28,29,29,29,28,28,28,28,27,27],[68,62,60,64,66,62,60,60,66,68,72,74]],
  "los angeles":[34.052,-118.244,[14,15,16,17,19,22,24,25,24,21,17,14],[42,40,38,35,30,22,8,10,16,24,36,42]],
  "istanbul":[41.013,28.979,[5,6,8,12,17,22,25,25,21,16,11,7],[62,60,58,54,52,44,32,32,42,56,64,66]],
  "athens":[37.984,23.728,[10,11,13,17,22,28,32,31,27,21,15,11],[52,48,44,38,30,15,8,8,18,38,52,56]],
  "lisbon":[38.717,-9.142,[12,13,15,17,20,24,27,27,25,20,16,13],[68,62,56,48,38,22,10,12,28,52,65,70]],
  "vienna":[48.208,16.373,[1,3,8,13,18,22,25,24,19,13,6,2],[65,60,55,52,54,52,48,50,56,62,68,70]],
  "prague":[50.088,14.421,[0,1,5,10,15,19,22,21,16,10,5,1],[68,62,55,50,52,50,46,47,54,62,70,72]],
  "budapest":[47.498,19.040,[1,3,8,14,19,23,26,25,20,14,7,2],[64,58,52,50,52,48,42,44,52,60,66,68]],
  "dublin":[53.331,-6.249,[7,7,9,11,14,17,19,19,16,13,9,7],[76,72,66,62,62,60,58,60,66,72,76,78]],
  "miami":[25.774,-80.194,[20,21,23,25,27,29,30,30,29,27,23,21],[52,48,44,42,52,60,62,62,62,55,52,52]],
  "bangkok":[13.754,100.502,[27,29,31,33,33,31,30,30,30,29,28,26],[38,28,28,36,50,58,60,60,60,58,52,40]],
  "mumbai":[19.076,72.878,[24,25,27,29,32,31,29,29,29,30,28,25],[22,14,12,14,22,68,82,80,74,52,24,16]],
  "cairo":[30.033,31.233,[13,15,18,22,28,31,32,32,29,26,20,14],[18,14,10,8,6,2,0,0,2,6,12,16]],
  "cape town":[33.925,18.424,[21,22,21,18,15,13,12,13,14,16,18,20],[26,28,34,44,56,62,62,58,50,40,32,26]],
};

function normalizeCity(s){
  return s.toLowerCase().trim()
    .replace(/[éèê]/g,"e").replace(/[àâ]/g,"a").replace(/ô/g,"o")
    .replace(/ü/g,"u").replace(/ñ/g,"n").replace(/ç/g,"c");
}

function fallbackWeather(lat,cityKey){
  const month=new Date().getMonth();
  const entry=FALLBACK[cityKey];
  if(!entry){
    const absLat=Math.abs(lat);
    return{temp:Math.round(30-absLat*0.4),cloudCover:50,precipitation:0,uvIndex:Math.round(8-absLat/15),hourlyClouds:Array(16).fill(50),isLive:false};
  }
  const[,,temps,clouds]=entry;
  const cloudBase=clouds[month];
  return{
    temp:temps[month],cloudCover:cloudBase,precipitation:0,
    uvIndex:Math.max(0,Math.round(8-Math.abs(lat)/15)),
    hourlyClouds:Array.from({length:16},(_,i)=>{
      const h=i+6;
      const timeEffect=(h<9||h>18)?8:-4;
      return Math.max(0,Math.min(100,cloudBase+timeEffect+Math.round((Math.random()-0.5)*12)));
    }),
    isLive:false
  };
}

async function geocode(cafe,city){
  const q=encodeURIComponent(`${cafe}, ${city}`);
  const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&addressdetails=1`,{headers:{"Accept-Language":"en","User-Agent":"TerraceSunChecker/1.0"}});
  const data=await res.json();
  if(!data.length) throw new Error(`Could not find "${cafe}" in ${city}.`);
  const best=data.find(d=>["cafe","restaurant","bar","pub","fast_food"].includes(d.type))||data.find(d=>d.class==="amenity")||data[0];
  return{lat:parseFloat(best.lat),lon:parseFloat(best.lon),displayName:best.display_name.split(",").slice(0,3).join(", ")};
}

async function liveWeather(lat,lon){
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,cloud_cover,precipitation,uv_index&hourly=cloud_cover,precipitation_probability&timezone=auto&forecast_days=1`;
  const res=await fetch(url);
  const d=await res.json();
  const hourly=d.hourly;
  const hourlyClouds=Array.from({length:16},(_,i)=>{
    const h=i+6;
    const idx=hourly.time?.findIndex(t=>new Date(t).getHours()===h)??-1;
    return idx>=0?hourly.cloud_cover[idx]:50;
  });
  return{temp:Math.round(d.current.temperature_2m),cloudCover:d.current.cloud_cover,precipitation:d.current.precipitation,uvIndex:Math.round(d.current.uv_index??0),hourlyClouds,isLive:true};
}

async function fetchData(cafe,city){
  try{
    const place=await geocode(cafe,city);
    const weather=await liveWeather(place.lat,place.lon);
    return{...place,weather,source:"live"};
  }catch(e){
    const key=normalizeCity(city);
    const match=Object.keys(FALLBACK).find(k=>k===key||k.includes(key)||key.includes(k));
    if(!match) throw new Error(`"${city}" not found. In preview mode only built-in cities work. Deploy the app for worldwide support!`);
    const[lat,lon]=FALLBACK[match];
    const weather=fallbackWeather(lat,match);
    return{lat,lon,displayName:`${cafe}, ${city} (estimated weather)`,weather,source:"fallback"};
  }
}

function getVerdict(lat,lon,weather){
  const now=new Date();
  const pos=SC.pos(now,lat,lon);
  const times=SC.times(now,lat,lon);
  const altDeg=pos.alt*(180/Math.PI);
  const isDay=now>times.rise&&now<times.set;
  const{cloudCover,precipitation}=weather;
  const rise=times.rise.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  const set=times.set.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  if(!isDay) return{emoji:"🌙",title:"Sun has set",cls:"night",desc:`The sun is below the horizon (rises ${rise}, sets ${set}).`};
  if(precipitation>0.5) return{emoji:"🌧️",title:"It's raining",cls:"rainy",desc:`${precipitation}mm of rain right now. Best to sit inside!`};
  if(cloudCover>80) return{emoji:"☁️",title:"Overcast sky",cls:"cloudy",desc:`${cloudCover}% cloud cover — no direct sunshine on the terrace.`};
  if(cloudCover>40) return{emoji:"⛅",title:"Partly sunny",cls:"partial",desc:`${cloudCover}% clouds, sun at ${Math.round(altDeg)}° — patches of sunshine likely.`};
  if(altDeg<10) return{emoji:"🌅",title:"Low sun — likely shaded",cls:"shaded",desc:`Sun is very low (${Math.round(altDeg)}°). Nearby buildings cast long shadows.`};
  return{emoji:"☀️",title:"Sunny terrace!",cls:"sunny",desc:`Clear skies, sun at ${Math.round(altDeg)}° — full sunshine on the terrace!`};
}

function buildTimeline(lat,lon,hourlyClouds){
  return Array.from({length:16},(_,i)=>i+6).map((h,i)=>{
    const d=new Date();d.setHours(h,0,0,0);
    const{alt}=SC.pos(d,lat,lon);
    const times=SC.times(d,lat,lon);
    const altDeg=alt*(180/Math.PI);
    const isDay=d>times.rise&&d<times.set;
    const cloud=hourlyClouds[i]??50;
    const isCurrent=new Date().getHours()===h;
    let cls="night",height=14;
    if(isDay){
      if(cloud>70){cls="shade";height=35;}
      else if(cloud>35){cls="partial";height=52;}
      else{cls="sunny";height=Math.min(74,52+altDeg*0.55);}
    }
    return{h,cls,height:Math.max(height,8),isCurrent};
  });
}

const css=`
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
.app{font-family:'Outfit',sans-serif;min-height:100vh;padding-bottom:60px;transition:background 0.6s;}
.app.sunny{background:#F7F2E6;}.app.partial{background:#EFF3F7;}
.app.cloudy{background:#EBEEF3;}.app.shaded{background:#EDEEF0;}
.app.rainy{background:#EAF0F5;}.app.night{background:#18222F;}
.hero{text-align:center;padding:44px 20px 28px;}
.orb{width:78px;height:78px;border-radius:50%;margin:0 auto 18px;transition:all 0.6s;}
.orb.sunny,.orb.partial{background:radial-gradient(circle at 36% 34%,#FFE566,#F5A623 55%,#D4720A);box-shadow:0 0 55px 16px rgba(245,166,35,0.24);}
.orb.shaded{background:radial-gradient(circle at 36% 34%,#FFE566,#F5A623);opacity:0.28;box-shadow:none;}
.orb.cloudy,.orb.rainy{background:#B8C8D8;box-shadow:none;}
.orb.night{background:#C0D0E8;box-shadow:0 0 36px 10px rgba(180,210,240,0.14);}
.hero h1{font-family:'Lora',serif;font-size:clamp(1.75rem,5vw,2.4rem);font-weight:600;line-height:1.15;color:#1A2230;}
.night .hero h1{color:#DDE6F0;}.hero h1 em{font-style:italic;color:#C97A08;}
.night .hero h1 em{color:#7EB8E0;}
.sub{font-size:0.9rem;color:#8A9AAA;font-weight:300;margin-top:6px;}
.card{background:#fff;border-radius:18px;padding:22px;box-shadow:0 4px 24px rgba(0,0,0,0.08);margin:0 auto 14px;max-width:600px;width:calc(100% - 28px);}
.night .card{background:#22304A;}
.row{display:flex;gap:9px;flex-wrap:wrap;}
.iw{flex:1;min-width:110px;}
.iw label{display:block;font-size:0.66rem;font-weight:600;text-transform:uppercase;letter-spacing:.09em;color:#9AA8B8;margin-bottom:5px;}
.iw input{width:100%;border:1.5px solid #E0E8F0;border-radius:10px;padding:11px 13px;font-family:'Outfit',sans-serif;font-size:0.93rem;color:#1A2230;background:#FAFBFC;outline:none;transition:border-color .2s,box-shadow .2s;}
.iw input:focus{border-color:#F5A623;box-shadow:0 0 0 3px rgba(245,166,35,.12);}
.btn{align-self:flex-end;background:#1A2230;color:#fff;border:none;border-radius:10px;padding:12px 20px;font-family:'Outfit',sans-serif;font-size:0.9rem;font-weight:500;cursor:pointer;white-space:nowrap;transition:background .15s,transform .1s;}
.btn:hover{background:#2C3E55;}.btn:active{transform:scale(.97);}.btn:disabled{background:#9AA8B8;cursor:not-allowed;}
.hint{font-size:0.72rem;color:#9AA8B8;margin-top:8px;}
.live-badge{display:inline-block;background:#D1FAE5;color:#065F46;font-size:0.68rem;font-weight:600;padding:3px 8px;border-radius:20px;margin-left:8px;vertical-align:middle;}
.est-badge{display:inline-block;background:#FEF3C7;color:#92400E;font-size:0.68rem;font-weight:600;padding:3px 8px;border-radius:20px;margin-left:8px;vertical-align:middle;}
.suggest{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
.chip{background:#F0F4F8;border:none;border-radius:20px;padding:5px 12px;font-size:0.78rem;color:#4A5A6A;cursor:pointer;font-family:'Outfit',sans-serif;transition:background .15s;}
.chip:hover{background:#E2EAF2;}
.err{background:#FFF5F5;border:1.5px solid #FCA5A5;border-radius:11px;padding:13px 16px;color:#B91C1C;font-size:0.86rem;margin:0 auto 12px;max-width:600px;width:calc(100% - 28px);}
.spin-wrap{text-align:center;padding:28px;}
.spin{width:32px;height:32px;border:3px solid #E2E8F0;border-top-color:#F5A623;border-radius:50%;animation:spin .75s linear infinite;margin:0 auto 10px;}
@keyframes spin{to{transform:rotate(360deg)}}
.spin-wrap p{font-size:0.86rem;color:#8A9AAA;}
.fade{animation:fadeUp .35s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.vname{font-family:'Lora',serif;font-size:1.28rem;font-weight:600;margin-bottom:3px;}
.night .vname{color:#DDE6F0;}
.vaddr{font-size:0.8rem;color:#8A9AAA;margin-bottom:17px;}
.vbox{display:flex;align-items:center;gap:15px;padding:19px;border-radius:14px;margin-bottom:17px;}
.vbox.sunny{background:linear-gradient(135deg,#FFF8E2,#FEF0C0);border:1.5px solid #F5A623;}
.vbox.partial{background:linear-gradient(135deg,#F3F7FB,#E8EFF5);border:1.5px solid #B8C8D8;}
.vbox.cloudy{background:linear-gradient(135deg,#EEF2F6,#E4EBF0);border:1.5px solid #B0C0D0;}
.vbox.shaded{background:linear-gradient(135deg,#EEEEF0,#E4E6E9);border:1.5px solid #A8B0BC;}
.vbox.rainy{background:linear-gradient(135deg,#EBF4FF,#DBEAFE);border:1.5px solid #93C5FD;}
.vbox.night{background:linear-gradient(135deg,#1C2A40,#243450);border:1.5px solid #3A5070;}
.vemoji{font-size:2.5rem;flex-shrink:0;}
.vtitle{font-family:'Lora',serif;font-size:1.18rem;font-weight:600;margin-bottom:3px;}
.vdesc{font-size:0.84rem;color:#6A7A8A;line-height:1.5;}
.vbox.night .vdesc{color:#8AA0BA;}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:17px;}
.stat{background:#F7F4EF;border-radius:12px;padding:12px 7px;text-align:center;}
.night .stat{background:#1A2A3E;}
.sicon{font-size:1.15rem;margin-bottom:2px;}
.slabel{font-size:0.64rem;text-transform:uppercase;letter-spacing:.07em;color:#9AA8B8;margin-bottom:2px;}
.sval{font-size:1rem;font-weight:600;}
.night .sval{color:#DDE6F0;}
.tltitle{font-family:'Lora',serif;font-size:.93rem;font-weight:600;margin-bottom:10px;}
.night .tltitle{color:#DDE6F0;}
.tlbars{display:flex;gap:3px;align-items:flex-end;height:70px;margin-bottom:5px;}
.tlbar{flex:1;border-radius:4px 4px 0 0;min-height:8px;cursor:default;transition:opacity .15s;}
.tlbar:hover{opacity:.7;}
.tlbar.sunny{background:linear-gradient(to top,#D4720A,#FFD84A);}
.tlbar.partial{background:linear-gradient(to top,#7A9AB0,#B8CCE0);}
.tlbar.shade{background:linear-gradient(to top,#485060,#6A7888);}
.tlbar.night{background:linear-gradient(to top,#182030,#283848);}
.tlbar.current{outline:2.5px solid #F5A623;outline-offset:1px;}
.tllabels{display:flex;justify-content:space-between;font-size:.63rem;color:#9AA8B8;}
.legend{display:flex;gap:11px;flex-wrap:wrap;margin-top:9px;}
.leg{display:flex;align-items:center;gap:4px;font-size:.72rem;color:#8A9AAA;}
.ldot{width:8px;height:8px;border-radius:2px;}
.fnote{font-size:0.7rem;color:#9AA8B8;margin-top:13px;text-align:center;font-style:italic;}
`;

const EXAMPLES=["Paris","London","Barcelona","New York","Tokyo","Sydney","Dubai","Rome","Amsterdam","Berlin"];

export default function App(){
  const[cafe,setCafe]=useState("");
  const[city,setCity]=useState("");
  const[loading,setLoading]=useState(false);
  const[loadMsg,setLoadMsg]=useState("");
  const[error,setError]=useState("");
  const[result,setResult]=useState(null);
  const mood=result?.verdict?.cls??"sunny";

  async function search(cafeVal,cityVal){
    const c=(cafeVal??cafe).trim();
    const ci=(cityVal??city).trim();
    if(!c||!ci){setError("Please enter both a café name and a city.");return;}
    setError("");setResult(null);setLoading(true);
    try{
      setLoadMsg("🔍 Finding location…");
      const data=await fetchData(c,ci);
      setLoadMsg("☀️ Calculating sun position…");
      const verdict=getVerdict(data.lat,data.lon,data.weather);
      const timeline=buildTimeline(data.lat,data.lon,data.weather.hourlyClouds);
      setResult({cafe:c,city:ci,data,verdict,timeline});
    }catch(e){
      setError(e.message||"Something went wrong. Please try again.");
    }finally{
      setLoading(false);
    }
  }

  const onKey=e=>{if(e.key==="Enter")search();};
  const monthName=new Date().toLocaleString("en",{month:"long"});

  return(
    <>
      <style>{css}</style>
      <div className={`app ${mood}`}>
        <div className="hero">
          <div className={`orb ${mood}`}/>
          <h1>Is the <em>terrace</em><br/>in the sun?</h1>
          <p className="sub">Any café, anywhere in the world.</p>
        </div>
        <div className="card">
          <div className="row">
            <div className="iw" style={{flex:2}}>
              <label>Café or Restaurant</label>
              <input value={cafe} onChange={e=>setCafe(e.target.value)} onKeyDown={onKey} placeholder="e.g. Café de Flore"/>
            </div>
            <div className="iw" style={{flex:1}}>
              <label>City</label>
              <input value={city} onChange={e=>setCity(e.target.value)} onKeyDown={onKey} placeholder="e.g. Paris"/>
            </div>
            <button className="btn" onClick={()=>search()} disabled={loading}>
              {loading?"…":"Check ☀️"}
            </button>
          </div>
          <p className="hint">Try a city below or type any city in the world:</p>
          <div className="suggest">
            {EXAMPLES.map(c=>(
              <button key={c} className="chip" onClick={()=>{setCity(c);if(cafe.trim())search(cafe,c);}}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {error&&<div className="err">⚠️ {error}</div>}
        {loading&&(
          <div className="card spin-wrap">
            <div className="spin"/>
            <p>{loadMsg}</p>
          </div>
        )}
        {result&&!loading&&(
          <div className="card fade">
            <div className="vname">
              {result.cafe}
              {result.data.weather.isLive
                ?<span className="live-badge">🟢 Live weather</span>
                :<span className="est-badge">🟡 Estimated</span>
              }
            </div>
            <div className="vaddr">{result.data.displayName}</div>
            <div className={`vbox ${result.verdict.cls}`}>
              <div className="vemoji">{result.verdict.emoji}</div>
              <div>
                <div className="vtitle">{result.verdict.title}</div>
                <div className="vdesc">{result.verdict.desc}</div>
              </div>
            </div>
            <div className="stats">
              {[["🌡️","Temp",`${result.data.weather.temp}°C`],
                ["☁️","Cloud",`${result.data.weather.cloudCover}%`],
                ["🔆","UV",`${result.data.weather.uvIndex}`]
              ].map(([icon,label,val])=>(
                <div className="stat" key={label}>
                  <div className="sicon">{icon}</div>
                  <div className="slabel">{label}</div>
                  <div className="sval">{val}</div>
                </div>
              ))}
            </div>
            <div className="tltitle">Best times today</div>
            <div className="tlbars">
              {result.timeline.map(({h,cls,height,isCurrent})=>(
                <div key={h} className={`tlbar ${cls}${isCurrent?" current":""}`}
                  style={{height}} title={`${h}:00`}/>
              ))}
            </div>
            <div className="tllabels">
              {["6am","9am","12pm","3pm","6pm","9pm"].map(l=><span key={l}>{l}</span>)}
            </div>
            <div className="legend">
              {[["#F5A623","Sunny"],["#A0BAD0","Partly cloudy"],["#607080","Overcast"],["#283848","Night"]].map(([c,l])=>(
                <div className="leg" key={l}><div className="ldot" style={{background:c}}/>{l}</div>
              ))}
            </div>
            <p className="fnote">
              {result.data.weather.isLive
                ?`☀️ Sun position precise · 🌤 Live weather data`
                :`☀️ Sun position precise · 🌡️ Weather estimated for ${monthName} · Deploy for live weather`
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
}

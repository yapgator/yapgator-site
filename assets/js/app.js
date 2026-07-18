(() => {
  "use strict";
  const config = window.YAPGATOR_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const validUrl = (value, domains = []) => { try { const u = new URL(value); return u.protocol === "https:" && (!domains.length || domains.some(d => u.hostname === d || u.hostname.endsWith(`.${d}`))) ? u.href : ""; } catch { return ""; } };
  const finite = v => typeof v === "number" && Number.isFinite(v) && v >= 0;
  const money = (v, digits = 2) => finite(v) ? new Intl.NumberFormat("en-US", {style:"currency",currency:"USD",maximumFractionDigits:digits}).format(v) : "—";
  const isoDate = v => { const d = new Date(v); return Number.isFinite(d.getTime()) ? d : null; };
  let lastGood = null, timer = null;

  function normalize(raw) {
    if (!raw || raw.ok !== true || raw.network !== "Robinhood Chain" || raw.platform !== "Pons") return null;
    const launchStatus = ["prelaunch","live"].includes(raw.launchStatus) ? raw.launchStatus : null;
    if (!launchStatus) return null;
    const contractAddress = typeof raw.contractAddress === "string" && /^0x[a-fA-F0-9]{40}$/.test(raw.contractAddress) ? raw.contractAddress : "";
    const target = finite(raw.graduationTargetEth) && raw.graduationTargetEth > 0 ? raw.graduationTargetEth : config.graduationTargetEth;
    const current = finite(raw.graduationCurrentEth) ? raw.graduationCurrentEth : null;
    const computed = current !== null && target ? Math.min(100, Math.max(0, current / target * 100)) : null;
    const supplied = finite(raw.graduationPercent) ? Math.min(100, raw.graduationPercent) : null;
    return {launchStatus, contractAddress, graduated: raw.graduated === true, graduationTargetEth:target, graduationCurrentEth:current, graduationPercent:computed ?? supplied,
      marketCapUsd:finite(raw.marketCapUsd)?raw.marketCapUsd:null, priceUsd:finite(raw.priceUsd)?raw.priceUsd:null, volume24hUsd:finite(raw.volume24hUsd)?raw.volume24hUsd:null, liquidityUsd:finite(raw.liquidityUsd)?raw.liquidityUsd:null, updatedAt:isoDate(raw.updatedAt)};
  }
  function baseState() { return {launchStatus:config.launchStatus,contractAddress:config.contractAddress,graduated:config.graduated,graduationTargetEth:config.graduationTargetEth,graduationCurrentEth:config.graduationCurrentEth,graduationPercent:config.graduationPercent,marketCapUsd:config.marketCapUsd,priceUsd:config.priceUsd,volume24hUsd:config.volume24hUsd,liquidityUsd:config.liquidityUsd,updatedAt:null}; }
  function marketCapProgress(cap) {
    const levels = [0,100000,250000,500000,1000000,5000000,10000000];
    if (!finite(cap) || cap <= 0) return .58;
    if (cap >= levels.at(-1)) return .96;
    let i=1; while (i < levels.length && cap >= levels[i]) i++;
    const lo=levels[i-1], hi=levels[i], local=(Math.log1p(cap-lo)/Math.log1p(hi-lo));
    return .58 + ((i-1+local)/(levels.length-1))*.38;
  }
  function render(state, stale=false) {
    const launched = state.launchStatus === "live" && Boolean(state.contractAddress);
    const graduated = launched && state.graduated;
    const climbing = launched && finite(state.graduationPercent) && finite(state.graduationCurrentEth) && finite(state.graduationTargetEth) && state.graduationTargetEth > 0;
    const status = graduated ? "Graduated" : climbing ? "Climbing" : launched ? "Awaiting Graduation Data" : "Preparing for Launch";
    const values = {status,contract:launched?state.contractAddress:"Added at Launch",graduation:graduated?"Graduated":launched&&finite(state.graduationPercent)?`${state.graduationPercent.toFixed(2)}% · ${state.graduationCurrentEth} / ${state.graduationTargetEth} ETH`:"Awaiting Launch",marketCap:money(state.marketCapUsd,0),price:money(state.priceUsd,8),volume:money(state.volume24hUsd,0),liquidity:money(state.liquidityUsd,0),updated:state.updatedAt?`${state.updatedAt.toLocaleString()}${stale?" · STALE":""}`:"Pre-Launch Configuration"};
    Object.entries(values).forEach(([k,v]) => $$(`[data-market="${k}"]`).forEach(n=>n.textContent=v));
    const mode = graduated ? "graduated" : climbing ? "climbing" : "prelaunch";
    const p = graduated ? marketCapProgress(state.marketCapUsd) : climbing ? .035 + Math.min(1,state.graduationPercent/100)*.54 : .035;
    positionGator(p);
    $("[data-journey-status]").textContent = mode === "prelaunch" ? "PREPARING FOR LAUNCH" : mode === "graduated" ? "GRADUATED" : "CLIMBING";
    $("[data-journey-mode]").textContent = mode === "graduated" ? "MARKET-CAP SWIM" : "ROBINHOOD CHAIN";
    $("[data-journey-platform]").textContent = "PONS";
    $("[data-journey-detail]").textContent = mode === "prelaunch" ? "AWAITING CONTRACT" : mode === "graduated" ? (finite(state.marketCapUsd)?money(state.marketCapUsd,0):"AWAITING VERIFIED MARKET DATA") : `${state.graduationCurrentEth} / ${state.graduationTargetEth} ETH · ${state.graduationPercent.toFixed(2)}%`;
    $("[data-journey]").dataset.mode=mode;
    activateAction("buy", config.ponsTokenUrl, ["pons.family"]); activateAction("chart", config.chartUrl); activateAction("explorer", config.explorerUrl, ["robinhoodchain.blockscout.com"]);
    const copy=$("[data-action=copy]"); copy.hidden=!launched;
  }
  function positionGator(progress) { const path=$("[data-route]"), g=$("[data-gator]"); if (!path||!g||!path.getTotalLength) return; const point=path.getPointAtLength(path.getTotalLength()*progress); g.style.transform=`translate(${point.x}px,${point.y}px)`; }
  function activateAction(name,url,domains=[]) { const el=$(`[data-action="${name}"]`), safe=validUrl(url,domains); if(!el)return; el.hidden=!safe; if(safe){el.href=safe;el.target="_blank";el.rel="noopener noreferrer";} }
  async function refresh() { const url=validUrl(config.marketDataApiUrl); if(!url)return; try { const res=await fetch(url,{headers:{Accept:"application/json"},cache:"no-store"}); if(!res.ok)throw 0; const next=normalize(await res.json()); if(!next)throw 0; lastGood=next; render(next,next.updatedAt?Date.now()-next.updatedAt.getTime()>config.staleAfterMs:false); } catch { if(lastGood) render(lastGood,true); } }
  async function community() { const url=validUrl(config.telegramStatsApiUrl); if(!url)return; try { const res=await fetch(url,{cache:"no-store"}), d=await res.json(); if(res.ok&&Number.isInteger(d.members)&&d.members>0) $("[data-community-stat]").textContent=`${d.members.toLocaleString()} GATORS IN THE SWAMP`; } catch {} }
  function schedule(){clearInterval(timer);if(document.hidden||!config.marketDataApiUrl)return;timer=setInterval(refresh,Math.max(30000,config.refreshIntervalMs));}
  document.addEventListener("DOMContentLoaded",()=>{
    $$('[data-link]').forEach(a=>{const key=a.dataset.link,url=validUrl(config[key],key==="telegramPublicUrl"?["t.me"]:key==="xUrl"?["x.com","twitter.com"]:[]);if(url){a.href=url;a.target="_blank";a.rel="noopener noreferrer";}else a.hidden=true;});
    $$('[data-value]').forEach(n=>n.textContent=config[n.dataset.value]||"—"); $("[data-year]").textContent=new Date().getFullYear();
    const toggle=$(".menu-toggle"),menu=$("#menu"); toggle.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")==="true";toggle.setAttribute("aria-expanded",String(!open));menu.classList.toggle("open",!open);}); $$("#menu a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");toggle.setAttribute("aria-expanded","false");}));
    render(normalize({...baseState(),ok:true,network:"Robinhood Chain",platform:"Pons"})||baseState()); refresh(); community(); schedule(); document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh();schedule();});
    $("[data-action=copy]").addEventListener("click",async()=>{if(!config.contractAddress)return;try{await navigator.clipboard.writeText(config.contractAddress);}catch{}});
    if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
    const observer="IntersectionObserver" in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");}),{threshold:.12}):null; $$(".reveal").forEach(n=>observer?observer.observe(n):n.classList.add("visible"));
  });
})();

// Plays many careers instantly and prints the odds. Usage: node tools/sim.js 1000
const fs = require("fs"), path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
let js = html.match(/<script>([\s\S]*)<\/script>/)[1];
js = js.split("function start(data)")[0]
  .replace('const app=document.getElementById("app");', "const app={};")
  .replace(/document\.addEventListener/g, "(()=>{})");
const N = +process.argv[2] || 500;
const harness = `
const document={getElementById:()=>({})};const window={scrollTo(){}};
const location={protocol:"file:",hostname:"",origin:"",pathname:""};
const localStorage={getItem(){},setItem(){},removeItem(){}};
${js}
const out={};
for(const pos of Object.keys(POS)){
  const r={verdict:{},picks:[],undrafted:0,seasons:0,earn:0,rings:0,mvp:0,allpro:0,heisman:0};
  for(let n=0;n<${N};n++){
    newCareer("Sim",pos);chooseCollege(Math.floor(Math.random()*3));
    while(!S.decision)simCollegeSeason();
    if(S.decision.type==="declare"&&Math.random()<.5){S.decision=null;while(!S.decision)simCollegeSeason();runDraft(false)}else runDraft(S.decision.type==="declare");
    if(S.decision)signOffer(S.decision.options[0],"udfa");
    if(S.draft.pick)r.picks.push(S.draft.pick);else r.undrafted++;
    S.phase="nfl";let k=0;
    while(S.phase==="nfl"&&k<30){simNflSeason();k++;
      if(S.decision){if(S.decision.type==="forced")retire();else if(S.decision.options)signOffer(S.decision.options[0],S.decision.type)}}
    if(S.phase!=="retired")retire();
    const v=hof()[0];r.verdict[v]=(r.verdict[v]||0)+1;
    r.seasons+=S.nflLog.length;r.earn+=S.earnings;r.rings+=S.awards["Super Bowl Champion"]||0;
    r.mvp+=S.awards["MVP"]||0;r.allpro+=S.awards["All-Pro"]||0;r.heisman+=S.awards["Heisman Trophy"]||0;
  }
  out[pos]=r;
}
const pct=x=>(x/${N}*100).toFixed(1)+"%";
for(const [pos,r] of Object.entries(out)){
  const p=r.picks.sort((a,b)=>a-b);
  console.log("\\n== "+pos+" ("+${N}+" careers) ==");
  console.log("Round 1: "+pct(p.filter(x=>x<=32).length)+" | Median pick: "+(p[Math.floor(p.length/2)]||"-")+" | Undrafted: "+pct(r.undrafted));
  console.log("Avg NFL seasons: "+(r.seasons/${N}).toFixed(1)+" | Avg earnings: $"+(r.earn/${N}).toFixed(1)+"M");
  console.log("Per career: rings "+(r.rings/${N}).toFixed(2)+", MVPs "+(r.mvp/${N}).toFixed(2)+", All-Pros "+(r.allpro/${N}).toFixed(2)+", Heisman "+pct(r.heisman));
  for(const [v,c] of Object.entries(r.verdict).sort((a,b)=>b[1]-a[1]))console.log("  "+v.padEnd(28)+pct(c));
}`;
new Function(harness)();

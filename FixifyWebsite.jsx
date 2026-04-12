import { useState, useEffect } from "react";

/* ─── Design Tokens ─────────────────────────── */
const C = {
  bg: "#020B16", surf1: "#061220", surf2: "#0A1B2E", card: "rgba(8,22,40,0.9)",
  glass: "rgba(255,255,255,0.03)", border: "rgba(0,212,255,0.15)",
  borderW: "rgba(255,255,255,0.07)", borderH: "rgba(255,255,255,0.12)",
  cyan: "#00D4FF", cyanDim: "rgba(0,212,255,0.1)",
  purple: "#7B2FFF", purpleDim: "rgba(123,47,255,0.12)", green: "#00E5A0",
  greenDim: "rgba(0,229,160,0.1)", orange: "#FF6B35", red: "#FF3860",
  amber: "#FFB547", text: "#FFFFFF", textSub: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.32)",
  g1: "linear-gradient(135deg,#00D4FF,#7B2FFF)",
  g2: "linear-gradient(135deg,#00E5A0,#00D4FF)",
  g3: "linear-gradient(135deg,#FF6B35,#FF3860)",
  g4: "linear-gradient(135deg,#7B2FFF,#FF3860)",
  g5: "linear-gradient(135deg,#FFB547,#FF6B35)",
};
const FH = '"Exo 2","Rajdhani",system-ui,sans-serif';
const FB = '"Outfit","Nunito",system-ui,sans-serif';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
@keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 rgba(0,229,160,.45)}50%{box-shadow:0 0 0 7px rgba(0,229,160,0)}}
@keyframes fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}
@keyframes glow-border{0%,100%{border-color:rgba(0,212,255,.15)}50%{border-color:rgba(0,212,255,.45)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.sc{animation:fade-up .35s ease both}
.fade{animation:fade-in .35s ease both}
.float{animation:float 3s ease-in-out infinite}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,212,255,.2);border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:rgba(0,212,255,.4)}
.hover-card:hover{border-color:rgba(0,212,255,.35)!important;transform:translateY(-2px)}
.hover-card{transition:all .25s ease!important}
.nav-link:hover{color:#00D4FF!important;background:rgba(0,212,255,.07)!important}
.btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px)}
.btn-primary{transition:all .2s}
.btn-ghost:hover{background:rgba(0,212,255,.14)!important;border-color:rgba(0,212,255,.5)!important}
.btn-ghost{transition:all .2s}
.sidebar-item:hover{background:rgba(0,212,255,.07)!important;color:#00D4FF!important}
.sidebar-item{transition:all .2s}
.cat-card:hover{transform:translateY(-3px) scale(1.02);border-color:rgba(255,255,255,.18)!important}
.cat-card{transition:all .22s ease}
.worker-card:hover{border-color:rgba(0,212,255,.3)!important;box-shadow:0 8px 40px rgba(0,212,255,.08)!important}
.worker-card{transition:all .25s ease}
input,textarea{outline:none}
input::placeholder,textarea::placeholder{color:rgba(255,255,255,.28)}
button{cursor:pointer}
`;

/* ─── Primitives ─────────────────────────── */
const Pill = ({ children, color = C.cyan, s = {} }) => (
  <span style={{
    display:"inline-flex",alignItems:"center",gap:3,padding:"3px 10px",borderRadius:20,
    background:`${color}1E`,border:`1px solid ${color}3A`,color,fontSize:11,fontWeight:700,
    fontFamily:FB,letterSpacing:".04em",whiteSpace:"nowrap",...s
  }}>{children}</span>
);

const GCard = ({ children, style={}, onClick, className="" }) => (
  <div onClick={onClick} className={className} style={{
    background:C.card,backdropFilter:"blur(20px)",border:`1px solid ${C.borderW}`,
    borderRadius:16,padding:20,cursor:onClick?"pointer":"default",...style
  }}>{children}</div>
);

const Avatar = ({ name="U", size=44, online, grad=C.g1 }) => {
  const ini = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{position:"relative",display:"inline-block",flexShrink:0}}>
      <div style={{
        width:size,height:size,borderRadius:"50%",background:grad,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:size*.33,fontWeight:800,color:"#fff",fontFamily:FH,
        border:`2px solid ${C.borderW}`,flexShrink:0
      }}>{ini}</div>
      {online!==undefined&&<div style={{
        position:"absolute",bottom:1,right:1,width:size*.25,height:size*.25,
        borderRadius:"50%",background:online?C.green:C.textMuted,
        border:`2px solid ${C.surf1}`,animation:online?"pulse-dot 2s infinite":"none"
      }}/>}
    </div>
  );
};

const Stars = ({ r=4.5, sz=13 }) => (
  <div style={{display:"flex",gap:1}}>
    {[1,2,3,4,5].map(i=>(
      <span key={i} style={{fontSize:sz,color:i<=Math.round(r)?C.amber:C.textMuted}}>
        {i<=r?"★":"☆"}
      </span>
    ))}
  </div>
);

const Btn = ({ children, grad=C.g1, small, style={}, onClick }) => (
  <button onClick={onClick} className="btn-primary" style={{
    background:grad,border:"none",borderRadius:small?10:12,color:"#fff",fontFamily:FB,
    fontWeight:700,padding:small?"7px 16px":"11px 24px",fontSize:small?12:14,
    letterSpacing:".02em",...style
  }}>{children}</button>
);

const GhostBtn = ({ children, style={}, onClick, color=C.cyan }) => (
  <button onClick={onClick} className="btn-ghost" style={{
    background:`${color}10`,border:`1px solid ${color}44`,borderRadius:12,color,
    fontFamily:FB,fontWeight:700,padding:"11px 24px",fontSize:14,...style
  }}>{children}</button>
);

const Toggle = ({ on, toggle }) => (
  <div onClick={toggle} style={{
    width:48,height:26,borderRadius:13,background:on?C.green:"rgba(255,255,255,.08)",
    border:`1px solid ${on?C.green:C.borderW}`,position:"relative",cursor:"pointer",
    transition:"all .3s",flexShrink:0
  }}>
    <div style={{
      position:"absolute",top:3,left:on?25:3,width:20,height:20,borderRadius:"50%",
      background:"#fff",transition:"left .3s",boxShadow:"0 2px 6px rgba(0,0,0,.4)"
    }}/>
  </div>
);

const SHead = ({ title, action, onAction, large }) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
    <span style={{fontFamily:FH,fontWeight:700,fontSize:large?20:15,color:C.text,letterSpacing:".02em"}}>{title}</span>
    {action&&<span onClick={onAction} style={{fontFamily:FB,fontSize:13,color:C.cyan,cursor:"pointer",fontWeight:600}}>{action}</span>}
  </div>
);

const Divider = () => <div style={{height:1,background:C.borderW,margin:"16px 0"}}/>;

/* ─── Data ─────────────────────────────── */
const CATS = [
  {id:"pl",label:"Plumbing",em:"🔧",col:"#00D4FF",desc:"Leak, pipe, drainage"},
  {id:"el",label:"Electrical",em:"⚡",col:"#FFB547",desc:"Wiring, switches, boards"},
  {id:"cl",label:"Cleaning",em:"🧹",col:"#00E5A0",desc:"Home, sofa, deep clean"},
  {id:"ac",label:"AC Repair",em:"❄️",col:"#7B2FFF",desc:"Service, gas filling"},
  {id:"ca",label:"Carpentry",em:"🪚",col:"#FF6B35",desc:"Furniture, doors, fix"},
  {id:"pa",label:"Painting",em:"🖌️",col:"#FF3860",desc:"Interior, exterior"},
  {id:"pe",label:"Pest Control",em:"🐛",col:"#00D4FF",desc:"Termite, cockroach"},
  {id:"ga",label:"Gardening",em:"🌿",col:"#00E5A0",desc:"Lawn, plants, trim"},
];

const WORKERS = [
  {id:1,name:"Rajesh Kumar",cat:"Plumber",rating:4.9,jobs:312,price:"₹200–500",online:true,exp:8,v:true,grad:C.g1,city:"Meerut"},
  {id:2,name:"Priya Sharma",cat:"Cleaner",rating:4.8,jobs:567,price:"₹150–350",online:true,exp:5,v:true,grad:C.g2,city:"Meerut"},
  {id:3,name:"Amit Singh",cat:"Electrician",rating:4.7,jobs:234,price:"₹300–800",online:false,exp:10,v:true,grad:C.g4,city:"Delhi NCR"},
  {id:4,name:"Meena Patel",cat:"Painter",rating:4.6,jobs:189,price:"₹250–600",online:true,exp:6,v:false,grad:C.g3,city:"Meerut"},
  {id:5,name:"Suresh Yadav",cat:"Carpenter",rating:4.8,jobs:423,price:"₹400–1200",online:true,exp:12,v:true,grad:C.g5,city:"Agra"},
  {id:6,name:"Kavita Joshi",cat:"AC Repair",rating:4.9,jobs:198,price:"₹500–1500",online:false,exp:7,v:true,grad:C.g4,city:"Noida"},
];

const MSGS = [
  {from:"w",txt:"Hello! I'm Rajesh. How can I help you today? 😊",t:"2:20 PM"},
  {from:"u",txt:"Hi! I have a pipe leak under my kitchen sink 🚿",t:"2:21 PM"},
  {from:"w",txt:"I see! Can you share a photo of the problem area?",t:"2:22 PM"},
  {from:"sys",txt:"📸 Photo uploaded — AI detected: Minor pipe joint leak"},
  {from:"w",txt:"I can fix this within 1 hour.\n💰 Estimate: ₹350–450\n⏱ Arrival: 45 min",t:"2:23 PM",estimate:true},
  {from:"u",txt:"Can you come at 3 PM today?",t:"2:24 PM"},
];

const STEPS = [
  {label:"Request Sent",em:"📤",done:true},
  {label:"Worker Accepted",em:"✅",done:true},
  {label:"Scheduled",em:"📅",done:true},
  {label:"Worker on the Way",em:"🚗",done:true,active:true},
  {label:"Work in Progress",em:"🔧",done:false},
  {label:"Completed",em:"🏁",done:false},
  {label:"Payment Released",em:"💳",done:false},
];

/* ═══════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════ */
const NAV_ITEMS = [
  {id:"Home",em:"🏠",lbl:"Home"},
  {id:"Workers",em:"👷",lbl:"Browse Workers"},
  {id:"Chat",em:"💬",lbl:"Messages"},
  {id:"Booking",em:"📅",lbl:"Book Service"},
  {id:"Tracking",em:"📍",lbl:"Track Order"},
  {id:"Payment",em:"💳",lbl:"Payment"},
  {id:"Negotiation",em:"🤝",lbl:"Negotiation"},
  {id:"Rating",em:"⭐",lbl:"Reviews"},
  {id:"Dashboard",em:"⚡",lbl:"Worker Dashboard"},
  {id:"Admin",em:"🛡️",lbl:"Admin Panel"},
];

function Sidebar({ screen, go }) {
  return (
    <aside style={{
      width:240,flexShrink:0,background:C.surf1,borderRight:`1px solid ${C.borderW}`,
      display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",
      overflowY:"auto",
    }}>
      {/* Logo */}
      <div style={{padding:"24px 22px 20px",borderBottom:`1px solid ${C.borderW}`}}>
        <div style={{
          fontFamily:FH,fontWeight:900,fontSize:26,letterSpacing:".12em",
          background:C.g1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          lineHeight:1
        }}>FIXIFY</div>
        <div style={{color:C.textMuted,fontSize:9,letterSpacing:".2em",marginTop:4,fontFamily:FB,fontWeight:600}}>HOME SERVICES PLATFORM</div>
      </div>

      {/* User card */}
      <div style={{padding:"16px 18px",borderBottom:`1px solid ${C.borderW}`}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Avatar name="Arjun Dev" size={38} online grad={C.g1}/>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:FB}}>Arjun Dev</div>
            <div style={{fontSize:11,color:C.textMuted}}>📍 Meerut, UP</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{padding:"12px 10px",flex:1}}>
        {NAV_ITEMS.map(n=>(
          <div key={n.id} onClick={()=>go(n.id)} className="sidebar-item" style={{
            display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
            borderRadius:12,cursor:"pointer",marginBottom:3,
            background:screen===n.id?"rgba(0,212,255,.1)":"transparent",
            color:screen===n.id?C.cyan:C.textSub,
            fontFamily:FB,fontWeight:screen===n.id?700:500,fontSize:13,
            borderLeft:screen===n.id?`3px solid ${C.cyan}`:"3px solid transparent",
          }}>
            <span style={{fontSize:15,flexShrink:0}}>{n.em}</span>
            <span>{n.lbl}</span>
            {n.id==="Chat"&&<span style={{
              marginLeft:"auto",background:C.red,borderRadius:10,
              padding:"1px 7px",fontSize:10,fontWeight:800,color:"#fff"
            }}>3</span>}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{padding:"14px 18px",borderTop:`1px solid ${C.borderW}`}}>
        <div style={{display:"flex",gap:8}}>
          {["⚙️","🌙","❓"].map(em=>(
            <div key={em} style={{
              width:34,height:34,borderRadius:10,cursor:"pointer",
              background:C.glass,border:`1px solid ${C.borderW}`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
            }}>{em}</div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ─── TOP BAR ─────────────────────────────── */
function TopBar({ title, subtitle, actions }) {
  return (
    <div style={{
      padding:"20px 32px",borderBottom:`1px solid ${C.borderW}`,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      background:C.surf1,backdropFilter:"blur(20px)",
      position:"sticky",top:0,zIndex:10,
    }}>
      <div>
        <h1 style={{fontFamily:FH,fontWeight:800,fontSize:22,color:C.text,margin:0}}>{title}</h1>
        {subtitle&&<p style={{margin:"3px 0 0",fontSize:13,color:C.textMuted,fontFamily:FB}}>{subtitle}</p>}
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {actions}
        <div style={{
          width:38,height:38,borderRadius:12,background:C.glass,border:`1px solid ${C.borderW}`,
          display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
          position:"relative",fontSize:17,
        }}>🔔<div style={{position:"absolute",top:7,right:7,width:8,height:8,borderRadius:"50%",background:C.red}}/></div>
        <Avatar name="Arjun Dev" size={38} grad={C.g1}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOME SCREEN
════════════════════════════════════════════ */
function HomeScreen({go}) {
  const [q,setQ]=useState("");
  const RECENT=[
    {svc:"Pipe Leak Fix",worker:"Rajesh Kumar",status:"In Progress",price:"₹450",em:"🔧",col:C.green},
    {svc:"Room Painting",worker:"Meena Patel",status:"Completed",price:"₹2,200",em:"🖌️",col:C.cyan},
  ];
  const STATS=[
    {l:"Services Booked",v:"24",em:"📋",col:C.cyan},
    {l:"Money Saved",v:"₹3.2K",em:"💰",col:C.green},
    {l:"Fav Workers",v:"6",em:"❤️",col:C.red},
    {l:"Avg Rating Given",v:"4.8",em:"⭐",col:C.amber},
  ];

  return (
    <div className="sc">
      {/* Hero banner */}
      <div style={{
        margin:"28px 32px 24px",borderRadius:24,padding:"36px 40px",position:"relative",overflow:"hidden",
        background:"linear-gradient(135deg,rgba(0,212,255,.07) 0%,rgba(123,47,255,.14) 100%)",
        border:`1px solid ${C.border}`,
      }}>
        <div style={{position:"absolute",top:-60,right:-60,width:300,height:300,borderRadius:"50%",background:"rgba(0,212,255,.06)",filter:"blur(60px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-40,left:"40%",width:200,height:200,borderRadius:"50%",background:"rgba(123,47,255,.08)",filter:"blur(50px)",pointerEvents:"none"}}/>
        {/* Scan line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,rgba(0,212,255,.3),transparent)",animation:"scan 3s linear infinite"}}/>
        <div style={{position:"relative",maxWidth:600}}>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <Pill color={C.cyan}>📍 MEERUT, UP</Pill>
            <Pill color={C.green}>✦ AI-POWERED MATCHING</Pill>
          </div>
          <h2 style={{fontFamily:FH,fontWeight:900,fontSize:36,color:C.text,margin:"0 0 10px",lineHeight:1.15}}>
            Book trusted home services<br/>
            <span style={{background:C.g1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>instantly near you</span>
          </h2>
          <p style={{color:C.textSub,fontSize:15,margin:"0 0 22px",lineHeight:1.6}}>
            Verified professionals for plumbing, electrical, cleaning, AC repair and more — with live tracking and secure escrow payments.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={()=>go("Workers")} style={{padding:"13px 28px",fontSize:15}}>Browse Services →</Btn>
            <GhostBtn onClick={()=>go("Chat")} style={{padding:"13px 24px",fontSize:15}}>Upload Photo for AI Quote ✦</GhostBtn>
          </div>
        </div>
        <div style={{
          position:"absolute",right:40,top:"50%",transform:"translateY(-50%)",
          fontSize:80,animation:"float 3s ease-in-out infinite",display:"flex",gap:8,opacity:.8,
        }}>🏠</div>
      </div>

      {/* Search bar */}
      <div style={{padding:"0 32px 24px"}}>
        <div style={{
          background:C.glass,border:`1px solid ${C.border}`,borderRadius:16,
          display:"flex",alignItems:"center",gap:12,padding:"13px 18px",
          boxShadow:`0 0 30px rgba(0,212,255,.07)`,
        }}>
          <span style={{fontSize:18,opacity:.6}}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search 'electrician near me', 'AC repair', 'deep cleaning'…"
            style={{flex:1,background:"none",border:"none",color:C.text,fontFamily:FB,fontSize:14}}/>
          <div style={{
            padding:"8px 18px",borderRadius:11,background:C.g1,
            color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:".04em",
          }}>AI Search ✦</div>
        </div>
      </div>

      {/* User stats */}
      <div style={{padding:"0 32px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {STATS.map(s=>(
            <GCard key={s.l} style={{padding:"18px 20px",border:`1px solid ${s.col}18`,textAlign:"center"}}>
              <div style={{fontSize:26,marginBottom:8}}>{s.em}</div>
              <div style={{fontFamily:FH,fontWeight:900,fontSize:24,color:s.col,marginBottom:4}}>{s.v}</div>
              <div style={{fontSize:11,color:C.textMuted,fontWeight:600}}>{s.l}</div>
            </GCard>
          ))}
        </div>
      </div>

      <div style={{padding:"0 32px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        {/* Categories */}
        <div>
          <SHead title="Service Categories" action="View All →" large/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {CATS.map(c=>(
              <div key={c.id} onClick={()=>go("Workers")} className="cat-card hover-card" style={{
                background:C.glass,border:`1px solid ${C.borderW}`,borderRadius:16,
                padding:"16px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer",
              }}>
                <div style={{
                  width:48,height:48,borderRadius:14,background:`${c.col}18`,
                  border:`1px solid ${c.col}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
                }}>{c.em}</div>
                <span style={{fontSize:11,color:C.textSub,fontWeight:700,textAlign:"center"}}>{c.label}</span>
                <span style={{fontSize:10,color:C.textMuted,textAlign:"center",lineHeight:1.3}}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div>
          <SHead title="Recent Bookings" action="All Orders →" large/>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {RECENT.map((r,i)=>(
              <GCard key={i} onClick={()=>go("Tracking")} className="hover-card" style={{padding:"16px 18px"}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{
                    width:50,height:50,borderRadius:14,flexShrink:0,
                    background:`${r.col}18`,border:`1px solid ${r.col}40`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
                  }}>{r.em}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:FH,fontWeight:700,fontSize:16,color:C.text,marginBottom:3}}>{r.svc}</div>
                    <div style={{fontSize:12,color:C.textMuted}}>{r.worker} • Today</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <Pill color={r.status==="In Progress"?C.amber:C.green}>{r.status}</Pill>
                    <div style={{fontFamily:FH,fontWeight:800,fontSize:16,color:C.text,marginTop:6}}>{r.price}</div>
                  </div>
                </div>
                {r.status==="In Progress"&&(
                  <div style={{marginTop:12}}>
                    <div style={{height:4,background:C.borderW,borderRadius:4}}>
                      <div style={{height:"100%",width:"60%",borderRadius:4,background:C.g2,transition:"width 1s"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                      <span style={{fontSize:11,color:C.textMuted}}>Worker on the way</span>
                      <span style={{fontSize:11,color:C.green,fontWeight:700}}>60% done</span>
                    </div>
                  </div>
                )}
              </GCard>
            ))}
            <Btn grad={C.g1} style={{width:"100%"}} onClick={()=>go("Booking")}>+ Book New Service</Btn>
          </div>
        </div>
      </div>

      {/* Top rated workers */}
      <div style={{padding:"0 32px 32px"}}>
        <SHead title="Top Rated Workers Near You" action="See All Workers →" large/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {WORKERS.slice(0,3).map(w=>(
            <GCard key={w.id} onClick={()=>go("Workers")} className="hover-card worker-card" style={{padding:"20px"}}>
              <div style={{display:"flex",gap:13,marginBottom:14,alignItems:"flex-start"}}>
                <Avatar name={w.name} size={54} online={w.online} grad={w.grad}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontFamily:FH,fontWeight:700,fontSize:16,color:C.text}}>{w.name}</span>
                    {w.v&&<span style={{fontSize:14}}>✅</span>}
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                    <Pill color={C.cyan} s={{fontSize:10}}>{w.cat}</Pill>
                    <Pill color={C.green} s={{fontSize:10}}>{w.exp}y exp</Pill>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:10}}>
                <Stars r={w.rating} sz={13}/>
                <span style={{fontSize:14,color:C.amber,fontWeight:800}}>{w.rating}</span>
                <span style={{fontSize:12,color:C.textMuted}}>{w.jobs} jobs</span>
              </div>
              <Divider/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:14,fontWeight:700,color:C.cyan}}>{w.price}/hr</div>
                <Btn small onClick={e=>{e.stopPropagation();go("Booking")}}>Book Now</Btn>
              </div>
            </GCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WORKERS BROWSE
════════════════════════════════════════════ */
function WorkersScreen({go}) {
  const [cat,setCat]=useState("all");
  const [tab,setTab]=useState("about");
  const [sel,setSel]=useState(null);
  const filtered=cat==="all"?WORKERS:WORKERS.filter(w=>w.cat.toLowerCase().includes(cat));
  const w=sel||WORKERS[0];
  const skills=["Leak Detection","Pipe Fitting","Water Heater","Drainage","Tap Repair","Bathroom Fitting"];
  const revs=[
    {name:"Suresh M.",r:5,txt:"Excellent work! Fixed the leak very quickly and cleanly.",time:"2d ago"},
    {name:"Anita K.",r:4,txt:"Professional, on time, and reasonably priced.",time:"5d ago"},
    {name:"Ramesh P.",r:5,txt:"Best in town. Highly recommend!",time:"1w ago"},
  ];

  return (
    <div className="sc" style={{display:"flex",gap:0,minHeight:"calc(100vh - 67px)"}}>
      {/* Left: filters + list */}
      <div style={{flex:1,padding:"24px 24px 24px 32px",minWidth:0,borderRight:`1px solid ${C.borderW}`}}>
        {/* Category filter */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
          {[["all","All Workers"],["plumber","Plumbers"],["clean","Cleaners"],["electric","Electricians"],["paint","Painters"],["carpet","Carpenters"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setCat(id)} style={{
              padding:"7px 16px",borderRadius:20,border:"none",fontFamily:FB,fontWeight:700,fontSize:12,
              background:cat===id?C.g1:"rgba(255,255,255,.06)",
              color:cat===id?"#fff":C.textSub,cursor:"pointer",
              border:`1px solid ${cat===id?"transparent":C.borderW}`,transition:"all .2s",
            }}>{lbl}</button>
          ))}
        </div>
        {/* Search */}
        <div style={{
          background:C.glass,border:`1px solid ${C.border}`,borderRadius:12,
          display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:18,
        }}>
          <span style={{opacity:.5}}>🔍</span>
          <input placeholder="Search workers, skills…"
            style={{flex:1,background:"none",border:"none",color:C.text,fontFamily:FB,fontSize:13}}/>
        </div>
        {/* Worker list */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map(w2=>(
            <GCard key={w2.id} onClick={()=>setSel(w2)} className="hover-card worker-card" style={{
              padding:"16px 18px",
              border:`1px solid ${sel?.id===w2.id?C.cyan:C.borderW}`,
              background:sel?.id===w2.id?C.cyanDim:C.card,
            }}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <Avatar name={w2.name} size={50} online={w2.online} grad={w2.grad}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:4}}>
                    <span style={{fontFamily:FH,fontWeight:700,fontSize:15,color:C.text}}>{w2.name}</span>
                    {w2.v&&<span style={{fontSize:13}}>✅</span>}
                  </div>
                  <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                    <Pill color={C.cyan} s={{fontSize:10}}>{w2.cat}</Pill>
                    <Pill color={w2.online?C.green:C.textMuted} s={{fontSize:10}}>{w2.online?"● Online":"Offline"}</Pill>
                    <span style={{fontSize:11,color:C.textMuted}}>📍{w2.city}</span>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{display:"flex",gap:4,justifyContent:"flex-end",alignItems:"center",marginBottom:4}}>
                    <Stars r={w2.rating} sz={11}/>
                    <span style={{fontSize:12,color:C.amber,fontWeight:800}}>{w2.rating}</span>
                  </div>
                  <div style={{fontSize:13,color:C.cyan,fontWeight:700}}>{w2.price}</div>
                </div>
              </div>
            </GCard>
          ))}
        </div>
      </div>

      {/* Right: worker detail */}
      <div style={{width:380,flexShrink:0,padding:"24px 24px",overflowY:"auto"}}>
        {/* Profile header */}
        <div style={{textAlign:"center",marginBottom:20,padding:"24px 20px",
          background:"linear-gradient(180deg,rgba(0,212,255,.05),transparent)",
          borderRadius:20,border:`1px solid ${C.border}`,
        }}>
          <Avatar name={w.name} size={80} online={w.online} grad={w.grad}/>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:12,flexWrap:"wrap"}}>
            <span style={{fontFamily:FH,fontWeight:800,fontSize:20,color:C.text}}>{w.name}</span>
            {w.v&&<span style={{fontSize:18}}>✅</span>}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:7,marginTop:8,flexWrap:"wrap"}}>
            <Pill color={C.cyan}>{w.cat}</Pill>
            <Pill color={C.green}>{w.exp}y Exp</Pill>
            <Pill color={w.online?C.green:C.textMuted}>{w.online?"● Online":"Offline"}</Pill>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:10}}>
            <Stars r={w.rating}/><span style={{color:C.amber,fontWeight:800}}>{w.rating}</span>
            <span style={{color:C.textMuted,fontSize:13}}>({w.jobs} jobs)</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:16}}>
          {["about","reviews","portfolio"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              flex:1,padding:"8px 0",borderRadius:10,border:"none",
              background:tab===t?C.g1:"rgba(255,255,255,.05)",
              color:tab===t?"#fff":C.textSub,fontFamily:FB,fontWeight:700,fontSize:12,
              textTransform:"capitalize",cursor:"pointer",transition:"all .2s",
            }}>{t}</button>
          ))}
        </div>

        {tab==="about"&&(
          <div className="fade" style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[["💼",w.jobs,"Jobs"],["💰",w.price,"Price"],["⚡","<10m","Response"]].map(([em,v,l])=>(
                <GCard key={l} style={{padding:"12px 8px",textAlign:"center"}}>
                  <div style={{fontSize:18}}>{em}</div>
                  <div style={{fontFamily:FH,fontWeight:800,fontSize:13,color:C.cyan,margin:"5px 0 2px"}}>{v}</div>
                  <div style={{fontSize:10,color:C.textMuted}}>{l}</div>
                </GCard>
              ))}
            </div>
            <GCard style={{border:`1px solid ${C.green}33`}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:20}}>🏛️</span>
                <div>
                  <div style={{fontSize:12,color:C.textMuted}}>KYC Verified</div>
                  <div style={{fontSize:13,color:C.green,fontWeight:700}}>Aadhaar + Police Verification ✓</div>
                </div>
              </div>
            </GCard>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {skills.map(s=><Pill key={s} color={C.cyan}>{s}</Pill>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn style={{flex:1}} onClick={()=>go("Booking")}>📅 Book</Btn>
              <GhostBtn style={{flex:1}} onClick={()=>go("Chat")}>💬 Chat</GhostBtn>
            </div>
          </div>
        )}

        {tab==="reviews"&&(
          <div className="fade" style={{display:"flex",flexDirection:"column",gap:10}}>
            {revs.map((rv,i)=>(
              <GCard key={i}>
                <div style={{display:"flex",gap:9,marginBottom:8,alignItems:"center"}}>
                  <Avatar name={rv.name} size={32} grad={[C.g2,C.g4,C.g1][i]}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{rv.name}</div>
                    <div style={{display:"flex",gap:5,alignItems:"center",marginTop:2}}>
                      <Stars r={rv.r} sz={11}/>
                      <span style={{fontSize:10,color:C.textMuted}}>{rv.time}</span>
                    </div>
                  </div>
                </div>
                <p style={{margin:0,fontSize:12,color:C.textSub,lineHeight:1.6}}>{rv.txt}</p>
              </GCard>
            ))}
          </div>
        )}

        {tab==="portfolio"&&(
          <div className="fade" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
            {["🚿","🔩","🪣","🛁"].map((em,i)=>(
              <div key={i} style={{
                aspectRatio:"1",borderRadius:14,cursor:"pointer",
                background:[`#00D4FF12`,`#7B2FFF12`,`#00E5A012`,`#FF6B3512`][i],
                border:`1px solid ${C.borderW}`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,
              }}>{em}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHAT
════════════════════════════════════════════ */
function ChatScreen({go}) {
  const [msg,setMsg]=useState("");
  const CONTACTS=[
    {name:"Rajesh Kumar",cat:"Plumber",last:"Estimate sent: ₹350–450",t:"2:23 PM",unread:2,online:true,grad:C.g1},
    {name:"Priya Sharma",cat:"Cleaner",last:"See you tomorrow at 10 AM",t:"1:15 PM",unread:0,online:true,grad:C.g2},
    {name:"Amit Singh",cat:"Electrician",last:"Job completed ✓",t:"Yesterday",unread:0,online:false,grad:C.g4},
  ];
  const PRESETS=["What is the problem?","Share your location","Is it urgent?","Need photos?"];

  return (
    <div className="sc" style={{display:"flex",height:"calc(100vh - 67px)"}}>
      {/* Contact list */}
      <div style={{width:300,flexShrink:0,borderRight:`1px solid ${C.borderW}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"18px 18px 12px",borderBottom:`1px solid ${C.borderW}`}}>
          <div style={{
            background:C.glass,border:`1px solid ${C.borderW}`,borderRadius:11,
            display:"flex",alignItems:"center",gap:8,padding:"8px 12px",
          }}>
            <span style={{opacity:.5,fontSize:14}}>🔍</span>
            <input placeholder="Search chats…" style={{flex:1,background:"none",border:"none",color:C.text,fontFamily:FB,fontSize:13}}/>
          </div>
        </div>
        {CONTACTS.map((c,i)=>(
          <div key={i} style={{
            padding:"14px 18px",borderBottom:`1px solid ${C.borderW}`,cursor:"pointer",
            background:i===0?"rgba(0,212,255,.06)":"transparent",
            transition:"background .2s",
          }} className="nav-link">
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <Avatar name={c.name} size={44} online={c.online} grad={c.grad}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:14,color:C.text,fontFamily:FB}}>{c.name}</span>
                  <span style={{fontSize:11,color:C.textMuted}}>{c.t}</span>
                </div>
                <div style={{fontSize:11,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.last}</div>
              </div>
              {c.unread>0&&<div style={{
                width:20,height:20,borderRadius:"50%",background:C.cyan,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:800,color:"#00060d",flexShrink:0,
              }}>{c.unread}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Chat header */}
        <div style={{
          padding:"14px 24px",borderBottom:`1px solid ${C.borderW}`,
          display:"flex",alignItems:"center",gap:12,background:C.surf1,
        }}>
          <Avatar name="Rajesh Kumar" size={42} online grad={C.g1}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:FH,fontWeight:700,fontSize:16,color:C.text}}>Rajesh Kumar</div>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:"pulse-dot 2s infinite"}}/>
              <span style={{fontSize:12,color:C.green,fontWeight:600}}>Online • Plumber</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {["📞","📹","⋯"].map(ic=>(
              <div key={ic} style={{
                width:38,height:38,borderRadius:11,background:C.glass,border:`1px solid ${C.borderW}`,
                display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:17,
              }}>{ic}</div>
            ))}
          </div>
        </div>

        {/* Quick presets */}
        <div style={{
          padding:"10px 20px",borderBottom:`1px solid ${C.borderW}`,
          display:"flex",gap:8,flexWrap:"wrap",background:C.glass,
        }}>
          <span style={{fontSize:11,color:C.textMuted,alignSelf:"center",fontWeight:600}}>Quick:</span>
          {PRESETS.map(p=>(
            <div key={p} onClick={()=>setMsg(p)} style={{
              padding:"5px 13px",borderRadius:20,cursor:"pointer",
              background:C.cyanDim,border:`1px solid ${C.border}`,
              color:C.cyan,fontSize:12,fontWeight:600,
            }}>{p}</div>
          ))}
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:12}}>
          {MSGS.map((m,i)=>{
            if(m.from==="sys") return (
              <div key={i} style={{
                textAlign:"center",background:`${C.cyan}12`,borderRadius:10,
                padding:"9px 16px",fontSize:12,color:C.cyan,border:`1px solid ${C.border}`,
              }}>{m.txt}</div>
            );
            const isU=m.from==="u";
            return (
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:isU?"flex-end":"flex-start",gap:4}}>
                <div style={{
                  maxWidth:"68%",background:isU?C.g1:C.card,
                  border:isU?"none":`1px solid ${C.borderW}`,
                  borderRadius:isU?"18px 18px 4px 18px":"18px 18px 18px 4px",
                  padding:"12px 16px",color:"#fff",fontSize:14,lineHeight:1.55,whiteSpace:"pre-wrap",
                }}>
                  {m.txt}
                  {m.estimate&&(
                    <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,.2)",display:"flex",gap:8}}>
                      <button onClick={()=>go("Negotiation")} style={{
                        flex:1,padding:"9px 0",borderRadius:9,border:"none",
                        background:"rgba(255,255,255,.16)",color:"#fff",fontFamily:FB,fontWeight:700,cursor:"pointer",fontSize:12,
                      }}>Counter Offer</button>
                      <button onClick={()=>go("Booking")} style={{
                        flex:1,padding:"9px 0",borderRadius:9,border:"none",
                        background:"rgba(0,229,160,.25)",color:C.green,fontFamily:FB,fontWeight:700,cursor:"pointer",fontSize:12,
                      }}>Accept ✓</button>
                    </div>
                  )}
                </div>
                {m.t&&<span style={{fontSize:11,color:C.textMuted}}>{m.t}</span>}
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{padding:"14px 24px",borderTop:`1px solid ${C.borderW}`,background:C.surf1}}>
          <div style={{
            display:"flex",gap:10,alignItems:"center",background:C.glass,
            border:`1px solid ${C.border}`,borderRadius:14,padding:"10px 14px",
          }}>
            {["📷","📎","🎙️"].map(ic=>(
              <span key={ic} style={{cursor:"pointer",fontSize:18,opacity:.6}}>{ic}</span>
            ))}
            <input value={msg} onChange={e=>setMsg(e.target.value)}
              placeholder="Type a message…"
              style={{flex:1,background:"none",border:"none",color:C.text,fontFamily:FB,fontSize:14}}/>
            <div style={{
              width:38,height:38,borderRadius:11,background:C.g1,
              display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,
            }}>↗</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BOOKING
════════════════════════════════════════════ */
function BookingScreen({go}) {
  const [date,setDate]=useState(15);
  const [time,setTime]=useState("10:00 AM");
  const [urgent,setUrgent]=useState(false);
  const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const DATES=[13,14,15,16,17,18,19];
  const TIMES=["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];

  return (
    <div className="sc" style={{padding:"28px 32px",maxWidth:900}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:24}}>
        {/* Left: booking form */}
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {/* Service summary */}
          <GCard style={{border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:60,height:60,borderRadius:16,background:C.cyanDim,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30}}>🔧</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:FH,fontWeight:800,fontSize:20,color:C.text}}>Pipe Leak Repair</div>
                <div style={{fontSize:13,color:C.textMuted,marginTop:3}}>Plumbing • Rajesh Kumar • KYC Verified ✅</div>
              </div>
              <Btn small onClick={()=>go("Workers")}>Change Worker</Btn>
            </div>
          </GCard>

          {/* Urgent toggle */}
          <GCard>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{
                  width:48,height:48,borderRadius:14,
                  background:urgent?"rgba(255,56,96,.12)":C.glass,
                  border:`1px solid ${urgent?C.red:C.borderW}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
                }}>🚨</div>
                <div>
                  <div style={{fontWeight:700,fontSize:16,color:C.text}}>Urgent Booking</div>
                  <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>Worker dispatched within 60 minutes (+₹100 surge fee)</div>
                </div>
              </div>
              <Toggle on={urgent} toggle={()=>setUrgent(!urgent)}/>
            </div>
          </GCard>

          {/* Date */}
          <GCard>
            <SHead title="Select Date"/>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {DATES.map((d,i)=>(
                <div key={d} onClick={()=>setDate(d)} style={{
                  minWidth:60,borderRadius:14,padding:"12px 8px",textAlign:"center",
                  background:date===d?C.g1:C.glass,
                  border:`1px solid ${date===d?"transparent":C.borderW}`,
                  cursor:"pointer",transition:"all .2s",
                  boxShadow:date===d?`0 6px 22px rgba(0,212,255,.25)`:"none",
                }}>
                  <div style={{fontSize:11,color:date===d?"rgba(255,255,255,.7)":C.textMuted,marginBottom:5}}>{DAYS[i]}</div>
                  <div style={{fontSize:20,fontWeight:800,fontFamily:FH,color:"#fff"}}>{d}</div>
                  <div style={{fontSize:10,color:date===d?"rgba(255,255,255,.6)":C.textMuted,marginTop:3}}>Apr</div>
                </div>
              ))}
            </div>
          </GCard>

          {/* Time */}
          <GCard>
            <SHead title="Select Time Slot"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {TIMES.map(t=>(
                <div key={t} onClick={()=>setTime(t)} style={{
                  padding:"11px 0",borderRadius:12,textAlign:"center",cursor:"pointer",
                  background:time===t?C.g1:C.glass,
                  border:`1px solid ${time===t?"transparent":C.borderW}`,
                  fontSize:13,fontWeight:700,color:time===t?"#fff":C.textSub,transition:"all .2s",
                }}>{t}</div>
              ))}
            </div>
          </GCard>

          {/* Address */}
          <GCard>
            <SHead title="Service Address"/>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <span style={{fontSize:22}}>📍</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,color:C.text}}>Plot 45, Shastri Nagar</div>
                <div style={{fontSize:13,color:C.textMuted,marginTop:3}}>Meerut, Uttar Pradesh 250002</div>
              </div>
              <span style={{color:C.cyan,fontSize:13,fontWeight:700,cursor:"pointer"}}>Change →</span>
            </div>
            {/* Map placeholder */}
            <div style={{
              height:140,borderRadius:14,overflow:"hidden",
              background:"linear-gradient(135deg,#041422,#0C2840)",
              border:`1px solid ${C.borderW}`,position:"relative",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <div style={{
                position:"absolute",inset:0,
                backgroundImage:`linear-gradient(${C.borderW} 1px,transparent 1px),linear-gradient(90deg,${C.borderW} 1px,transparent 1px)`,
                backgroundSize:"38px 38px",
              }}/>
              <div style={{
                width:44,height:44,borderRadius:"50%",background:C.g1,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
                position:"relative",boxShadow:`0 0 22px ${C.cyanDim}`,
              }}>📍</div>
            </div>
          </GCard>
        </div>

        {/* Right: order summary */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <GCard style={{border:`1px solid ${C.border}`,position:"sticky",top:90}}>
            <div style={{fontFamily:FH,fontWeight:800,fontSize:18,color:C.text,marginBottom:16}}>Order Summary</div>
            {[["Service","Pipe Leak Repair"],["Worker","Rajesh Kumar"],["Date",`April ${date}, 2026`],["Time Slot",time],["Service Charge","₹350–450"],["Platform Fee","₹29"],urgent&&["Urgent Surcharge","₹100"]].filter(Boolean).map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.borderW}`}}>
                <span style={{fontSize:13,color:C.textMuted}}>{k}</span>
                <span style={{fontSize:13,fontWeight:700,color:["Platform Fee","Urgent Surcharge"].includes(k)?C.amber:C.text}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0 0"}}>
              <span style={{fontFamily:FH,fontWeight:700,fontSize:16,color:C.text}}>Estimated Total</span>
              <span style={{fontFamily:FH,fontWeight:900,fontSize:22,color:C.cyan}}>{urgent?"₹579":"₹479"}</span>
            </div>
            <GCard style={{marginTop:14,border:`1px solid ${C.green}33`,padding:"12px 14px"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:20}}>🔐</span>
                <div style={{fontSize:12,color:C.green,fontWeight:600}}>Escrow Protection: payment held until job is confirmed complete</div>
              </div>
            </GCard>
            <Btn style={{width:"100%",marginTop:16,padding:"14px",fontSize:15}} onClick={()=>go("Payment")}>Confirm & Pay →</Btn>
            <GhostBtn style={{width:"100%",marginTop:10,padding:"12px"}} onClick={()=>go("Chat")}>Ask Worker First</GhostBtn>
          </GCard>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TRACKING
════════════════════════════════════════════ */
function TrackingScreen({go}) {
  return (
    <div className="sc" style={{padding:"28px 32px",display:"grid",gridTemplateColumns:"1fr 360px",gap:24}}>
      {/* Left: map + details */}
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {/* Map */}
        <div style={{
          borderRadius:22,height:340,overflow:"hidden",
          background:"linear-gradient(135deg,#041422,#0C2840)",
          border:`1px solid ${C.border}`,position:"relative",
        }}>
          <div style={{
            position:"absolute",inset:0,
            backgroundImage:`linear-gradient(${C.borderW} 1px,transparent 1px),linear-gradient(90deg,${C.borderW} 1px,transparent 1px)`,
            backgroundSize:"50px 50px",
          }}/>
          {/* Roads */}
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,.04)" strokeWidth="2"/>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,.04)" strokeWidth="2"/>
            <path d="M 200 250 Q 400 200 550 130" stroke={C.cyan} strokeWidth="2.5" strokeDasharray="8,5" fill="none" opacity=".7"/>
          </svg>
          {/* Worker */}
          <div style={{position:"absolute",left:"38%",top:"62%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
            <div style={{
              width:52,height:52,borderRadius:"50%",background:C.g1,
              border:`3px solid ${C.bg}`,display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:24,animation:"pulse-dot 2s infinite",boxShadow:`0 0 24px ${C.cyanDim}`,
            }}>🚗</div>
            <div style={{fontSize:11,color:C.cyan,marginTop:4,fontWeight:700,background:"rgba(0,0,0,.6)",borderRadius:6,padding:"2px 6px"}}>RAJESH</div>
          </div>
          {/* Destination */}
          <div style={{position:"absolute",left:"62%",top:"34%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
            <div style={{
              width:46,height:46,borderRadius:"50%",background:C.greenDim,
              border:`3px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
            }}>🏠</div>
            <div style={{fontSize:11,color:C.green,marginTop:4,fontWeight:700,background:"rgba(0,0,0,.6)",borderRadius:6,padding:"2px 6px"}}>YOUR HOME</div>
          </div>
          {/* ETA badge */}
          <div style={{
            position:"absolute",top:18,right:18,
            background:"rgba(0,0,0,.8)",backdropFilter:"blur(12px)",
            borderRadius:14,padding:"12px 18px",border:`1px solid ${C.border}`,
          }}>
            <div style={{fontSize:12,color:C.textMuted}}>Estimated Arrival</div>
            <div style={{fontFamily:FH,fontWeight:900,fontSize:32,color:C.cyan,lineHeight:1}}>8 min</div>
          </div>
          {/* Booking ref */}
          <div style={{
            position:"absolute",top:18,left:18,
            background:"rgba(0,0,0,.8)",backdropFilter:"blur(12px)",
            borderRadius:10,padding:"8px 14px",border:`1px solid ${C.borderW}`,
          }}>
            <div style={{fontSize:11,color:C.textMuted}}>Booking</div>
            <div style={{fontFamily:FH,fontWeight:700,fontSize:14,color:C.text}}>#HS-2026-1847</div>
          </div>
        </div>

        {/* Worker info */}
        <GCard style={{border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Avatar name="Rajesh Kumar" size={56} online grad={C.g1}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:FH,fontWeight:700,fontSize:18,color:C.text}}>Rajesh Kumar</div>
              <div style={{fontSize:13,color:C.textMuted,marginTop:3}}>Plumber · ⭐ 4.9 · KA-01 AB 1234</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[["📞","Call",C.green],["💬","Chat",C.cyan]].map(([ic,l,col])=>(
                <button key={l} onClick={()=>l==="Chat"&&go("Chat")} style={{
                  padding:"10px 18px",borderRadius:11,border:`1px solid ${col}55`,
                  background:`${col}12`,color:col,fontFamily:FB,fontWeight:700,
                  cursor:"pointer",fontSize:13,display:"flex",gap:6,alignItems:"center",
                }}>{ic} {l}</button>
              ))}
            </div>
          </div>
        </GCard>
      </div>

      {/* Right: progress */}
      <div>
        <GCard>
          <SHead title="Job Progress" large/>
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:13,color:C.textMuted}}>Overall Progress</span>
              <span style={{fontSize:13,color:C.green,fontWeight:700}}>57%</span>
            </div>
            <div style={{height:6,background:C.borderW,borderRadius:4}}>
              <div style={{height:"100%",width:"57%",borderRadius:4,background:C.g2}}/>
            </div>
          </div>
          <Divider/>
          {STEPS.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:4}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:4}}>
                <div style={{
                  width:36,height:36,borderRadius:"50%",
                  background:s.done?(s.active?C.g1:C.greenDim):C.glass,
                  border:`2px solid ${s.done?(s.active?C.cyan:C.green):C.borderW}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
                  animation:s.active?"pulse-dot 2s infinite":"none",
                  boxShadow:s.active?`0 0 18px ${C.cyanDim}`:"none",
                  flexShrink:0,
                }}>{s.em}</div>
                {i<STEPS.length-1&&<div style={{width:2,height:28,margin:"4px 0",background:s.done?C.g2:C.borderW,borderRadius:2}}/>}
              </div>
              <div style={{paddingTop:8}}>
                <div style={{
                  fontSize:14,fontWeight:s.active?700:500,
                  color:s.done?(s.active?C.cyan:C.green):C.textMuted,
                }}>{s.label}</div>
                {s.active&&<div style={{fontSize:12,color:C.textMuted,marginTop:2}}>Worker is 8 minutes away from your location</div>}
              </div>
            </div>
          ))}
        </GCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAYMENT
════════════════════════════════════════════ */
function PaymentScreen({go}) {
  const [method,setMethod]=useState("upi");
  const [done,setDone]=useState(false);
  const METHODS=[
    {id:"upi",label:"UPI Payment",sub:"GPay · PhonePe · Paytm · BHIM",em:"📱"},
    {id:"card",label:"Credit / Debit Card",sub:"Visa · Mastercard · RuPay · Amex",em:"💳"},
    {id:"wallet",label:"Fixify Wallet",sub:"Balance: ₹1,250 available",em:"👛"},
  ];

  if(done) return (
    <div className="sc" style={{padding:"60px 32px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div style={{
        width:120,height:120,borderRadius:"50%",background:C.greenDim,
        border:`4px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:56,animation:"float 2.5s ease-in-out infinite",
        boxShadow:`0 0 60px ${C.greenDim}`,marginBottom:28,
      }}>✅</div>
      <h2 style={{fontFamily:FH,fontWeight:900,fontSize:36,color:C.text,margin:"0 0 12px",textAlign:"center"}}>Payment Successful!</h2>
      <p style={{color:C.textMuted,textAlign:"center",fontSize:15,lineHeight:1.7,margin:"0 0 32px",maxWidth:480}}>
        ₹479 held securely in escrow. Funds will be released to Rajesh Kumar only after you confirm the job is complete.
      </p>
      <GCard style={{width:"100%",maxWidth:440,border:`1px solid ${C.green}33`,marginBottom:24}}>
        {[["Transaction ID","#TXN-8842771"],["Payment Method","UPI · Google Pay"],["Amount Paid","₹479"],["Escrow Status","Holding — Safe"],["Booking Ref","#HS-2026-1847"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.borderW}`}}>
            <span style={{fontSize:13,color:C.textMuted}}>{k}</span>
            <span style={{fontSize:13,fontWeight:700,color:k==="Escrow Status"?C.green:C.text}}>{v}</span>
          </div>
        ))}
      </GCard>
      <Btn onClick={()=>go("Tracking")} style={{padding:"14px 36px",fontSize:15}}>Track Your Order →</Btn>
    </div>
  );

  return (
    <div className="sc" style={{padding:"28px 32px",display:"grid",gridTemplateColumns:"1fr 380px",gap:24,maxWidth:900}}>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {/* Escrow banner */}
        <GCard style={{border:`1px solid ${C.green}33`,background:C.greenDim}}>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <div style={{fontSize:36}}>🔐</div>
            <div>
              <div style={{fontFamily:FH,fontWeight:700,fontSize:18,color:C.green}}>Escrow Payment Protection</div>
              <div style={{fontSize:13,color:C.textSub,marginTop:4,lineHeight:1.6}}>
                Your payment is held securely. Worker receives funds ONLY when you confirm job completion. 100% refund if worker doesn't show.
              </div>
            </div>
          </div>
        </GCard>

        {/* Payment methods */}
        <GCard>
          <SHead title="Choose Payment Method" large/>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {METHODS.map(m=>(
              <div key={m.id} onClick={()=>setMethod(m.id)} style={{
                padding:"16px 18px",borderRadius:14,cursor:"pointer",
                background:method===m.id?C.cyanDim:C.glass,
                border:`1px solid ${method===m.id?C.cyan:C.borderW}`,transition:"all .2s",
                display:"flex",gap:14,alignItems:"center",
              }}>
                <span style={{fontSize:28}}>{m.em}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:C.text}}>{m.label}</div>
                  <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>{m.sub}</div>
                </div>
                <div style={{
                  width:22,height:22,borderRadius:"50%",
                  border:`2px solid ${method===m.id?C.cyan:C.borderW}`,
                  background:method===m.id?C.cyan:"transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                }}>
                  {method===m.id&&<div style={{width:9,height:9,borderRadius:"50%",background:"#fff"}}/>}
                </div>
              </div>
            ))}
          </div>
        </GCard>

        {method==="card"&&(
          <GCard className="fade">
            <SHead title="Card Details"/>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[["Card Number","1234 5678 9012 3456"],["Cardholder Name","ARJUN DEV"],["Expiry","12/28"],["CVV","•••"]].map(([l,p],i)=>(
                <div key={l}>
                  <div style={{fontSize:12,color:C.textMuted,marginBottom:6,fontWeight:600}}>{l}</div>
                  <div style={{
                    background:C.glass,border:`1px solid ${C.border}`,borderRadius:11,
                    padding:"11px 14px",color:C.textSub,fontFamily:FB,fontSize:14,
                  }}>{p}</div>
                </div>
              ))}
            </div>
          </GCard>
        )}
      </div>

      {/* Right: summary */}
      <div>
        <GCard style={{border:`1px solid ${C.border}`,position:"sticky",top:90}}>
          <div style={{
            textAlign:"center",padding:"24px 0 16px",borderBottom:`1px solid ${C.borderW}`,marginBottom:16,
          }}>
            <div style={{fontSize:14,color:C.textMuted,marginBottom:8,letterSpacing:".06em",fontWeight:600}}>TOTAL AMOUNT</div>
            <div style={{fontFamily:FH,fontWeight:900,fontSize:52,color:C.text,lineHeight:1}}>₹479</div>
            <div style={{fontSize:13,color:C.textMuted,marginTop:8}}>Pipe Leak Repair • Rajesh Kumar</div>
          </div>
          {[["Service Charge","₹450"],["Platform Fee","₹29"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.borderW}`}}>
              <span style={{fontSize:13,color:C.textMuted}}>{k}</span>
              <span style={{fontSize:13,fontWeight:700,color:C.text}}>{v}</span>
            </div>
          ))}
          <div style={{padding:"12px 0"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:method==="upi"?"#00D4FF":method==="card"?"#7B2FFF":C.green,flexShrink:0,animation:"pulse-dot 2s infinite"}}/>
              <span style={{fontSize:13,color:C.textSub}}>Paying via {method==="upi"?"UPI":method==="card"?"Card":"Wallet"}</span>
            </div>
          </div>
          <Btn style={{width:"100%",padding:"15px",fontSize:15}} onClick={()=>setDone(true)}>🔒 Pay ₹479 Securely</Btn>
          <div style={{textAlign:"center",marginTop:12,display:"flex",gap:12,justifyContent:"center"}}>
            {["🛡️ SSL Secure","✅ RBI Compliant","💰 Escrow Protected"].map(t=>(
              <span key={t} style={{fontSize:10,color:C.textMuted,fontWeight:600}}>{t}</span>
            ))}
          </div>
        </GCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NEGOTIATION
════════════════════════════════════════════ */
function NegotiationScreen({go}) {
  const [stage,setStage]=useState("offer");
  const [counter,setCounter]=useState("380");

  return (
    <div className="sc" style={{padding:"28px 32px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:900}}>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {/* AI Insight */}
        <GCard style={{border:`1px solid ${C.amber}33`,background:"rgba(255,181,71,.06)"}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{fontSize:32}}>🤖</div>
            <div>
              <Pill color={C.amber}>AI Price Intelligence</Pill>
              <div style={{fontFamily:FH,fontWeight:700,fontSize:17,color:C.text,margin:"8px 0 5px"}}>Market Rate Analysis</div>
              <div style={{fontSize:13,color:C.textSub,lineHeight:1.7}}>
                Based on 1,247 similar jobs in Meerut, the fair rate for <strong style={{color:C.text}}>Pipe Leak Repair</strong> is:
              </div>
              <div style={{display:"flex",gap:10,marginTop:12}}>
                <GCard style={{flex:1,padding:"12px",textAlign:"center",border:`1px solid ${C.green}33`}}>
                  <div style={{fontSize:11,color:C.textMuted}}>Budget</div>
                  <div style={{fontFamily:FH,fontWeight:900,fontSize:20,color:C.green}}>₹300</div>
                </GCard>
                <GCard style={{flex:1,padding:"12px",textAlign:"center",border:`1px solid ${C.cyan}33`}}>
                  <div style={{fontSize:11,color:C.textMuted}}>Average</div>
                  <div style={{fontFamily:FH,fontWeight:900,fontSize:20,color:C.cyan}}>₹400</div>
                </GCard>
                <GCard style={{flex:1,padding:"12px",textAlign:"center",border:`1px solid ${C.amber}33`}}>
                  <div style={{fontSize:11,color:C.textMuted}}>Premium</div>
                  <div style={{fontFamily:FH,fontWeight:900,fontSize:20,color:C.amber}}>₹600</div>
                </GCard>
              </div>
            </div>
          </div>
        </GCard>

        {/* Worker offer */}
        <GCard style={{border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
            <Avatar name="Rajesh Kumar" size={44} grad={C.g1}/>
            <div>
              <div style={{fontWeight:700,fontSize:15,color:C.text}}>Rajesh Kumar's Offer</div>
              <div style={{fontSize:12,color:C.textMuted}}>Pipe Leak Repair • 1–2 hrs</div>
            </div>
          </div>
          <div style={{fontFamily:FH,fontWeight:900,fontSize:56,color:C.cyan,textAlign:"center",margin:"10px 0"}}>₹450</div>
          <div style={{textAlign:"center",fontSize:13,color:C.textMuted,marginBottom:16}}>Includes parts + labour + 30-day warranty</div>
          {stage==="offer"&&(
            <div style={{display:"flex",gap:12}}>
              <GhostBtn style={{flex:1}} onClick={()=>setStage("counter")}>Counter Offer</GhostBtn>
              <Btn style={{flex:1}} onClick={()=>setStage("agreed")}>Accept ✓</Btn>
            </div>
          )}
          {stage!=="offer"&&<Pill color={C.green} s={{fontSize:12,padding:"6px 14px",width:"100%",justifyContent:"center"}}>Offer viewed</Pill>}
        </GCard>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {stage==="counter"&&(
          <GCard className="fade" style={{border:`1px solid ${C.purple}55`}}>
            <div style={{fontFamily:FH,fontWeight:700,fontSize:18,color:C.text,marginBottom:16}}>Your Counter Offer</div>
            <div style={{
              background:C.glass,border:`1px solid ${C.border}`,borderRadius:14,
              padding:"16px 20px",display:"flex",alignItems:"center",gap:8,marginBottom:14,
            }}>
              <span style={{fontSize:28,color:C.textSub,fontFamily:FH,fontWeight:700}}>₹</span>
              <input value={counter} onChange={e=>setCounter(e.target.value)} style={{
                flex:1,background:"none",border:"none",color:C.text,fontFamily:FH,fontWeight:900,fontSize:48,
              }}/>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {["280","300","350","380","400"].map(p=>(
                <div key={p} onClick={()=>setCounter(p)} style={{
                  flex:"1 0 auto",padding:"10px 0",borderRadius:11,textAlign:"center",
                  background:counter===p?C.cyanDim:C.glass,
                  border:`1px solid ${counter===p?C.cyan:C.borderW}`,
                  cursor:"pointer",fontSize:14,fontWeight:700,
                  color:counter===p?C.cyan:C.textSub,transition:"all .2s",
                }}>₹{p}</div>
              ))}
            </div>
            <Btn grad={C.g4} style={{width:"100%",padding:"14px"}} onClick={()=>setStage("agreed")}>Send Counter Offer →</Btn>
          </GCard>
        )}

        {stage==="agreed"&&(
          <GCard className="fade" style={{border:`1px solid ${C.green}55`,background:C.greenDim,textAlign:"center",padding:"40px 24px"}}>
            <div style={{fontSize:60,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>🤝</div>
            <div style={{fontFamily:FH,fontWeight:900,fontSize:26,color:C.green,marginBottom:8}}>Deal Confirmed!</div>
            <div style={{fontFamily:FH,fontWeight:900,fontSize:52,color:C.text,marginBottom:12}}>₹{counter}</div>
            <div style={{fontSize:14,color:C.textMuted,marginBottom:8}}>Final agreed price</div>
            {parseInt(counter)<450&&<Pill color={C.green} s={{fontSize:13,padding:"7px 16px",marginBottom:20}}>You saved ₹{450-parseInt(counter)} 🎉</Pill>}
            <div style={{marginTop:20}}>
              <Btn grad={C.g2} style={{width:"100%",padding:"14px",fontSize:15}} onClick={()=>go("Payment")}>Proceed to Secure Payment →</Btn>
            </div>
          </GCard>
        )}

        {stage==="offer"&&(
          <GCard style={{border:`1px solid ${C.borderW}`}}>
            <SHead title="Negotiation Tips"/>
            {["Workers usually accept 85–90% of their asking price","Be polite — workers are more flexible with friendly customers","Ultra-low offers (below ₹280) are often rejected","Consider value: Rajesh has ⭐ 4.9 and 312 completed jobs"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<3?`1px solid ${C.borderW}`:"none"}}>
                <span style={{color:C.cyan,fontSize:14,flexShrink:0}}>→</span>
                <span style={{fontSize:13,color:C.textSub,lineHeight:1.5}}>{t}</span>
              </div>
            ))}
          </GCard>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RATING
════════════════════════════════════════════ */
function RatingScreen({go}) {
  const [stars,setStars]=useState(5);
  const [rev,setRev]=useState("");
  const TAGS=["On Time","Professional","Clean Work","Good Value","Friendly","Expert","Would Rehire","Highly Recommended"];
  const [sel,setSel]=useState(new Set(["On Time","Professional","Expert"]));
  const toggle=t=>setSel(prev=>{const n=new Set(prev);n.has(t)?n.delete(t):n.add(t);return n;});
  const LABELS=["","Terrible 😞","Bad 😕","Okay 😐","Good 😊","Excellent 🤩"];

  return (
    <div className="sc" style={{padding:"28px 32px",display:"grid",gridTemplateColumns:"360px 1fr",gap:24,maxWidth:900}}>
      {/* Left: worker card */}
      <div>
        <GCard style={{textAlign:"center",padding:"32px 24px",border:`1px solid ${C.border}`}}>
          <Avatar name="Rajesh Kumar" size={80} grad={C.g1}/>
          <div style={{fontFamily:FH,fontWeight:800,fontSize:22,color:C.text,marginTop:14}}>Rajesh Kumar</div>
          <div style={{fontSize:13,color:C.textMuted,marginTop:4}}>Plumber • April 15, 2026</div>
          <div style={{fontFamily:FH,fontWeight:700,fontSize:16,color:C.cyan,marginTop:8}}>Pipe Leak Repair • ₹380</div>
          <Divider/>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:14,color:C.textSub,fontWeight:600,marginBottom:14}}>Tap to rate your experience</div>
            <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:10}}>
              {[1,2,3,4,5].map(i=>(
                <span key={i} onClick={()=>setStars(i)} style={{
                  fontSize:38,cursor:"pointer",transition:"all .15s",
                  color:i<=stars?C.amber:C.textMuted,
                  filter:i<=stars?`drop-shadow(0 0 10px ${C.amber}88)`:"none",
                  transform:i===stars?"scale(1.2)":"scale(1)",
                }}>★</span>
              ))}
            </div>
            <div style={{fontSize:18,color:C.textSub,fontWeight:700}}>{LABELS[stars]}</div>
          </div>
        </GCard>
      </div>

      {/* Right: review form */}
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <GCard>
          <SHead title="Quick Tags" large/>
          <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
            {TAGS.map(t=>(
              <div key={t} onClick={()=>toggle(t)} style={{
                padding:"9px 18px",borderRadius:24,cursor:"pointer",
                background:sel.has(t)?C.cyanDim:C.glass,
                border:`1px solid ${sel.has(t)?C.cyan:C.borderW}`,
                color:sel.has(t)?C.cyan:C.textSub,
                fontSize:13,fontWeight:700,transition:"all .15s",
              }}>{t}</div>
            ))}
          </div>
        </GCard>

        <GCard>
          <SHead title="Write a Review" large/>
          <textarea value={rev} onChange={e=>setRev(e.target.value)}
            placeholder="Share your experience to help other customers find great workers…"
            rows={5}
            style={{
              width:"100%",background:C.glass,border:`1px solid ${C.border}`,
              borderRadius:14,padding:"14px 16px",color:C.text,
              fontFamily:FB,fontSize:14,resize:"none",lineHeight:1.65,
              boxSizing:"border-box",
            }}/>
          <div style={{textAlign:"right",marginTop:6,fontSize:12,color:C.textMuted}}>{rev.length}/500 chars</div>
        </GCard>

        <GCard>
          <SHead title="Attach Photo Proof (Optional)" large/>
          <div style={{
            borderRadius:16,border:`2px dashed ${C.borderW}`,padding:"32px",
            textAlign:"center",cursor:"pointer",background:C.glass,transition:"border-color .2s",
          }} className="hover-card">
            <div style={{fontSize:40,marginBottom:12}}>📷</div>
            <div style={{fontSize:15,fontWeight:700,color:C.textSub}}>Upload photos of completed work</div>
            <div style={{fontSize:12,color:C.textMuted,marginTop:5}}>PNG, JPG or WEBP up to 10MB</div>
          </div>
        </GCard>

        <Btn style={{width:"100%",padding:"15px",fontSize:15}} onClick={()=>go("Home")}>Submit Review ✓</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WORKER DASHBOARD
════════════════════════════════════════════ */
function DashboardScreen({go}) {
  const [avail,setAvail]=useState(true);
  const [tab,setTab]=useState("jobs");
  const JOBS=[
    {name:"Arjun Dev",svc:"Pipe Leak Repair",time:"Today 3:00 PM",price:450,loc:"Shastri Nagar",urgent:true},
    {name:"Sunita Rao",svc:"Tap Fitting",time:"Today 5:00 PM",price:200,loc:"Civil Lines",urgent:false},
    {name:"Rakesh Gupta",svc:"Bathroom Repair",time:"Tomorrow 10 AM",price:600,loc:"Cantonment",urgent:false},
  ];
  const EARNINGS_DATA=[{d:"Mon",v:60},{d:"Tue",v:85},{d:"Wed",v:45},{d:"Thu",v:95},{d:"Fri",v:70},{d:"Sat",v:110},{d:"Sun",v:55}];

  return (
    <div className="sc">
      {/* Dashboard header */}
      <div style={{
        padding:"24px 32px",borderBottom:`1px solid ${C.borderW}`,
        background:"linear-gradient(135deg,rgba(0,212,255,.04),rgba(123,47,255,.06))",
        display:"flex",gap:20,alignItems:"center",flexWrap:"wrap",
      }}>
        <Avatar name="Rajesh Kumar" size={64} online={avail} grad={C.g1}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:FH,fontWeight:900,fontSize:24,color:C.text}}>Rajesh Kumar</div>
          <div style={{fontSize:13,color:C.textMuted,marginTop:3}}>Plumber · ⭐ 4.9 · Meerut, UP</div>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Pill color={C.green}>✅ KYC Verified</Pill>
            <Pill color={C.cyan}>312 Jobs</Pill>
            <Pill color={C.amber}>Top Rated</Pill>
          </div>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{textAlign:"right",marginRight:4}}>
            <div style={{fontSize:12,color:avail?C.green:C.textMuted,fontWeight:700}}>{avail?"AVAILABLE FOR JOBS":"OFFLINE"}</div>
            <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>Toggle availability</div>
          </div>
          <Toggle on={avail} toggle={()=>setAvail(!avail)}/>
        </div>
      </div>

      {/* Stats row */}
      <div style={{padding:"24px 32px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        {[
          {l:"Today's Earnings",v:"₹1,240",em:"💰",col:C.green,ch:"+12%"},
          {l:"This Month",v:"₹28,500",em:"📈",col:C.cyan,ch:"+8%"},
          {l:"Active Jobs",v:"3",em:"⏳",col:C.amber,ch:""},
          {l:"Rating",v:"4.9 ⭐",em:"🏆",col:C.purple,ch:""},
        ].map(s=>(
          <GCard key={s.l} style={{border:`1px solid ${s.col}1A`,padding:"20px 22px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{fontSize:28}}>{s.em}</div>
              {s.ch&&<Pill color={C.green} s={{fontSize:10}}>{s.ch}</Pill>}
            </div>
            <div style={{fontFamily:FH,fontWeight:900,fontSize:26,color:s.col,margin:"10px 0 4px"}}>{s.v}</div>
            <div style={{fontSize:12,color:C.textMuted}}>{s.l}</div>
          </GCard>
        ))}
      </div>

      {/* Tabs */}
      <div style={{padding:"0 32px 20px",display:"flex",gap:6,borderBottom:`1px solid ${C.borderW}`}}>
        {[["jobs","New Job Requests"],["earnings","Earnings"],["history","Job History"],["profile","Profile Settings"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            padding:"10px 22px",borderRadius:12,border:"none",
            background:tab===id?C.g1:"rgba(255,255,255,.05)",
            color:tab===id?"#fff":C.textSub,fontFamily:FB,fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s",
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{padding:"24px 32px"}}>
        {tab==="jobs"&&(
          <div className="fade" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
            {JOBS.map((j,i)=>(
              <GCard key={i} style={{border:`1px solid ${j.urgent?"rgba(255,181,71,.3)":C.borderW}`,padding:"20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{display:"flex",gap:10}}>
                    <div style={{
                      width:46,height:46,borderRadius:13,flexShrink:0,
                      background:C.cyanDim,border:`1px solid ${C.border}`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                    }}>🔧</div>
                    <div>
                      <div style={{fontFamily:FH,fontWeight:700,fontSize:16,color:C.text}}>{j.svc}</div>
                      <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{j.name} · {j.loc}</div>
                    </div>
                  </div>
                  {j.urgent&&<Pill color={C.amber}>⚡ URGENT</Pill>}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <span style={{fontSize:12,color:C.textMuted}}>📅 {j.time}</span>
                  <span style={{fontFamily:FH,fontWeight:900,fontSize:22,color:C.cyan}}>₹{j.price}</span>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button style={{
                    flex:1,padding:"10px 0",borderRadius:11,
                    background:"rgba(255,56,96,.1)",border:`1px solid ${C.red}44`,
                    color:C.red,fontFamily:FB,fontWeight:700,cursor:"pointer",fontSize:13,
                  }}>✕ Reject</button>
                  <Btn grad={C.g2} style={{flex:1,padding:"10px 0"}}>✓ Accept</Btn>
                </div>
              </GCard>
            ))}
          </div>
        )}

        {tab==="earnings"&&(
          <div className="fade" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <GCard style={{border:`1px solid ${C.green}33`}}>
              <SHead title="Wallet Balance" large/>
              <div style={{fontFamily:FH,fontWeight:900,fontSize:48,color:C.green,marginBottom:8}}>₹6,450</div>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:13,color:C.textMuted}}>Monthly target: ₹30,000</span>
                  <span style={{fontSize:13,color:C.green,fontWeight:700}}>72%</span>
                </div>
                <div style={{height:8,background:C.borderW,borderRadius:4}}>
                  <div style={{height:"100%",width:"72%",borderRadius:4,background:C.g2}}/>
                </div>
              </div>
              <Btn grad={C.g2} style={{width:"100%"}}>Withdraw to Bank</Btn>
            </GCard>
            <GCard>
              <SHead title="Last 7 Days" large/>
              <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120,marginTop:8}}>
                {EARNINGS_DATA.map((d,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <div style={{fontSize:11,color:i===5?C.cyan:C.textMuted,fontWeight:700}}>₹{d.v*10}</div>
                    <div style={{
                      width:"100%",height:`${d.v}%`,borderRadius:"5px 5px 0 0",
                      background:i===5?C.g2:`linear-gradient(to top,${C.surf2},${C.card})`,
                      border:i!==5?`1px solid ${C.borderW}`:"none",borderBottom:"none",
                    }}/>
                    <span style={{fontSize:11,color:i===5?C.cyan:C.textMuted}}>{d.d}</span>
                  </div>
                ))}
              </div>
            </GCard>
          </div>
        )}

        {tab==="profile"&&(
          <div className="fade" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,maxWidth:700}}>
            {[["📸","Update Profile Photo","Edit your worker profile picture"],["📋","Manage Services","Add or remove service categories"],["🏦","Bank Details","Update withdrawal account"],["🎓","Add Certifications","Upload skill certificates"],["⚙️","App Preferences","Notification & privacy settings"],["🚪","Sign Out","Sign out of your account",true]].map(([em,lbl,desc,danger])=>(
              <GCard key={lbl} className="hover-card" style={{padding:"18px 20px",cursor:"pointer",display:"flex",gap:14,alignItems:"center"}}>
                <div style={{
                  width:44,height:44,borderRadius:13,flexShrink:0,
                  background:danger?"rgba(255,56,96,.12)":C.glass,
                  border:`1px solid ${danger?C.red:C.borderW}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
                }}>{em}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:danger?C.red:C.text}}>{lbl}</div>
                  <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{desc}</div>
                </div>
                <span style={{marginLeft:"auto",color:C.textMuted,fontSize:18}}>›</span>
              </GCard>
            ))}
          </div>
        )}

        {tab==="history"&&(
          <div className="fade">
            {[
              {svc:"Bathroom Pipe Repair",client:"Kavita S.",date:"Apr 14",price:"₹580",rating:5},
              {svc:"Leak Fix + Tap Replace",client:"Mohan D.",date:"Apr 13",price:"₹750",rating:5},
              {svc:"Drainage Unblock",client:"Sheela R.",date:"Apr 12",price:"₹300",rating:4},
              {svc:"Water Heater Install",client:"Arun P.",date:"Apr 10",price:"₹1,200",rating:5},
            ].map((j,i)=>(
              <GCard key={i} className="hover-card" style={{marginBottom:12,padding:"16px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{
                      width:44,height:44,borderRadius:13,
                      background:C.greenDim,border:`1px solid ${C.green}44`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
                    }}>✅</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:15,color:C.text}}>{j.svc}</div>
                      <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{j.client} • {j.date}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:FH,fontWeight:800,fontSize:18,color:C.cyan}}>{j.price}</div>
                    <Stars r={j.rating} sz={11}/>
                  </div>
                </div>
              </GCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN PANEL
════════════════════════════════════════════ */
function AdminScreen({go}) {
  const [tab,setTab]=useState("overview");
  const PLATFORM_STATS=[
    {l:"Total Users",v:"12,450",em:"👥",col:C.cyan,ch:"+8.2%"},
    {l:"Active Workers",v:"847",em:"👷",col:C.green,ch:"+12%"},
    {l:"Jobs Today",v:"234",em:"⚡",col:C.purple,ch:"+5.1%"},
    {l:"Revenue Today",v:"₹45.2K",em:"💰",col:C.amber,ch:"+18%"},
    {l:"Escrow Held",v:"₹1.2L",em:"🔐",col:C.cyan,ch:""},
    {l:"Commission (10%)",v:"₹4,520",em:"💹",col:C.green,ch:""},
    {l:"Open Disputes",v:"7",em:"⚖️",col:C.red,ch:""},
    {l:"Fraud Alerts",v:"2",em:"🛡️",col:C.amber,ch:""},
  ];
  const PENDING=[
    {name:"Vikram Shah",cat:"Electrician",city:"Agra",id:"KYC-5891",date:"Apr 12",grad:C.g3},
    {name:"Deepa Nair",cat:"Cleaner",city:"Meerut",id:"KYC-5892",date:"Apr 12",grad:C.g4},
    {name:"Suraj Mehta",cat:"Plumber",city:"Noida",id:"KYC-5893",date:"Apr 11",grad:C.g5},
    {name:"Renu Verma",cat:"Painter",city:"Delhi",id:"KYC-5894",date:"Apr 11",grad:C.g1},
  ];
  const CHART=[{d:"Mon",v:52},{d:"Tue",v:68},{d:"Wed",v:41},{d:"Thu",v:85},{d:"Fri",v:62},{d:"Sat",v:92},{d:"Sun",v:74}];

  return (
    <div className="sc">
      {/* Admin tabs */}
      <div style={{padding:"20px 32px 0",display:"flex",gap:6,borderBottom:`1px solid ${C.borderW}`}}>
        {[["overview","Overview"],["workers","Workers KYC"],["analytics","Analytics"],["settings","Settings"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            padding:"11px 24px",borderRadius:"12px 12px 0 0",border:"none",
            background:tab===id?C.card:"transparent",
            borderTop:`2px solid ${tab===id?C.cyan:"transparent"}`,
            color:tab===id?C.cyan:C.textSub,fontFamily:FB,fontWeight:700,fontSize:13,cursor:"pointer",
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{padding:"28px 32px"}}>
        {tab==="overview"&&(
          <div className="fade">
            {/* Stats grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
              {PLATFORM_STATS.map(s=>(
                <GCard key={s.l} style={{border:`1px solid ${s.col}18`,padding:"20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <span style={{fontSize:24}}>{s.em}</span>
                    {s.ch&&<Pill color={C.green} s={{fontSize:10}}>{s.ch}</Pill>}
                  </div>
                  <div style={{fontFamily:FH,fontWeight:900,fontSize:24,color:s.col,marginBottom:4}}>{s.v}</div>
                  <div style={{fontSize:11,color:C.textMuted,fontWeight:600}}>{s.l}</div>
                </GCard>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:24}}>
              {/* Revenue chart */}
              <GCard>
                <SHead title="Weekly Revenue" large/>
                <div style={{display:"flex",alignItems:"flex-end",gap:10,height:130,marginTop:8}}>
                  {CHART.map((d,i)=>(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                      <div style={{
                        fontSize:11,color:i===5?C.cyan:C.textMuted,fontWeight:700,
                      }}>₹{(d.v*460).toLocaleString()}</div>
                      <div style={{
                        width:"100%",height:`${d.v}%`,borderRadius:"6px 6px 0 0",
                        background:i===5?C.g1:`linear-gradient(to top,${C.surf2},${C.card})`,
                        border:i!==5?`1px solid ${C.borderW}`:"none",borderBottom:"none",
                        transition:"height .6s ease",
                      }}/>
                      <span style={{fontSize:11,color:i===5?C.cyan:C.textMuted}}>{d.d}</span>
                    </div>
                  ))}
                </div>
                <Divider/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,color:C.textMuted}}>Total this week</span>
                  <span style={{fontFamily:FH,fontWeight:900,fontSize:22,color:C.green}}>₹2,14,600</span>
                </div>
              </GCard>

              {/* Category breakdown */}
              <GCard>
                <SHead title="Jobs by Category" large/>
                {[["🔧","Plumbing",35,C.cyan],["⚡","Electrical",28,C.amber],["🧹","Cleaning",20,C.green],["❄️","AC Repair",12,C.purple],["🖌️","Painting",5,C.red]].map(([em,cat,pct,col])=>(
                  <div key={cat} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13,color:C.textSub}}>{em} {cat}</span>
                      <span style={{fontSize:13,fontWeight:700,color:col}}>{pct}%</span>
                    </div>
                    <div style={{height:6,background:C.borderW,borderRadius:4}}>
                      <div style={{height:"100%",width:`${pct}%`,borderRadius:4,background:col,transition:"width .8s ease"}}/>
                    </div>
                  </div>
                ))}
              </GCard>
            </div>
          </div>
        )}

        {tab==="workers"&&(
          <div className="fade">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={{fontFamily:FH,fontWeight:700,fontSize:20,color:C.text}}>KYC Pending Approvals</div>
                <div style={{fontSize:13,color:C.textMuted,marginTop:3}}>{PENDING.length} workers awaiting verification</div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <GhostBtn small style={{padding:"9px 18px",fontSize:12}}>Bulk Approve</GhostBtn>
                <Btn small>Export CSV</Btn>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
              {PENDING.map((w,i)=>(
                <GCard key={i} style={{border:`1px solid ${C.amber}22`,padding:"20px"}}>
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
                    <Avatar name={w.name} size={50} grad={w.grad}/>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:FH,fontWeight:700,fontSize:16,color:C.text}}>{w.name}</div>
                      <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>{w.cat} · {w.city}</div>
                      <div style={{display:"flex",gap:6,marginTop:6}}>
                        <Pill color={C.amber} s={{fontSize:10}}>{w.id}</Pill>
                        <Pill color={C.textMuted} s={{fontSize:10}}>{w.date}</Pill>
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{
                      flex:1,padding:"10px 0",borderRadius:11,
                      background:"rgba(255,56,96,.1)",border:`1px solid ${C.red}44`,
                      color:C.red,fontFamily:FB,fontWeight:700,cursor:"pointer",fontSize:13,
                    }}>✕ Reject</button>
                    <button style={{
                      flex:1,padding:"10px 0",borderRadius:11,
                      background:C.greenDim,border:`1px solid ${C.green}44`,
                      color:C.green,fontFamily:FB,fontWeight:700,cursor:"pointer",fontSize:13,
                    }}>✓ Approve</button>
                    <div style={{
                      width:42,height:42,borderRadius:11,
                      background:C.glass,border:`1px solid ${C.borderW}`,
                      display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:17,
                    }}>👁️</div>
                  </div>
                </GCard>
              ))}
            </div>
          </div>
        )}

        {tab==="analytics"&&(
          <div className="fade" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            {[["Customer Signups","+234 this week","📈"],["Job Completion Rate","94.2%","✅"],["Avg Response Time","8.3 min","⚡"],["Refund Rate","1.2%","🔄"]].map(([lbl,val,em])=>(
              <GCard key={lbl} style={{padding:"28px 32px",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:36,marginBottom:12}}>{em}</div>
                <div style={{fontFamily:FH,fontWeight:900,fontSize:38,color:C.cyan,marginBottom:6}}>{val}</div>
                <div style={{fontSize:14,color:C.textMuted}}>{lbl}</div>
              </GCard>
            ))}
          </div>
        )}

        {tab==="settings"&&(
          <div className="fade" style={{maxWidth:600,display:"flex",flexDirection:"column",gap:14}}>
            {[["💹","Commission Rate","10% per booking",true],["🔔","Push Notifications","Enabled for all events"],["🛡️","Fraud Detection","AI monitoring active"],["📣","Promotional Banners","3 active banners"],["⚖️","Dispute Resolution","Auto-escalation after 48h"],["🚨","Emergency Support","24/7 team online"]].map(([em,lbl,desc,accent])=>(
              <GCard key={lbl} className="hover-card" style={{padding:"18px 22px",display:"flex",gap:14,alignItems:"center",cursor:"pointer"}}>
                <div style={{
                  width:46,height:46,borderRadius:14,flexShrink:0,
                  background:accent?C.cyanDim:C.glass,border:`1px solid ${accent?C.cyan:C.borderW}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                }}>{em}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:C.text}}>{lbl}</div>
                  <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{desc}</div>
                </div>
                <span style={{color:C.cyan,fontWeight:700,fontSize:14}}>Edit →</span>
              </GCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════ */
const SCREEN_META = {
  Home:       {title:"Home",sub:"Welcome back, Arjun"},
  Workers:    {title:"Browse Workers",sub:"Find verified professionals near you"},
  Chat:       {title:"Messages",sub:"Chat with your service workers"},
  Booking:    {title:"Book a Service",sub:"Schedule at your convenience"},
  Tracking:   {title:"Order Tracking",sub:"Live status of your booking"},
  Payment:    {title:"Secure Payment",sub:"Escrow-protected payments"},
  Negotiation:{title:"Price Negotiation",sub:"Agree on the best price"},
  Rating:     {title:"Rate & Review",sub:"Share your experience"},
  Dashboard:  {title:"Worker Dashboard",sub:"Manage your jobs & earnings"},
  Admin:      {title:"Admin Panel",sub:"Platform overview & controls"},
};

export default function App() {
  const [screen,setScreen]=useState("Home");
  const go=s=>setScreen(s);
  const meta=SCREEN_META[screen]||{title:screen,sub:""};

  const renderScreen=()=>{
    const props={go};
    switch(screen){
      case"Home":return <HomeScreen {...props}/>;
      case"Workers":return <WorkersScreen {...props}/>;
      case"Chat":return <ChatScreen {...props}/>;
      case"Booking":return <BookingScreen {...props}/>;
      case"Tracking":return <TrackingScreen {...props}/>;
      case"Payment":return <PaymentScreen {...props}/>;
      case"Negotiation":return <NegotiationScreen {...props}/>;
      case"Rating":return <RatingScreen {...props}/>;
      case"Dashboard":return <DashboardScreen {...props}/>;
      case"Admin":return <AdminScreen {...props}/>;
      default:return <HomeScreen {...props}/>;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        background:C.bg,minHeight:"100vh",display:"flex",
        fontFamily:FB,color:C.text,
      }}>
        {/* Ambient glows */}
        <div style={{position:"fixed",top:-100,left:200,width:500,height:500,borderRadius:"50%",background:"rgba(0,212,255,.03)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"fixed",bottom:-100,right:200,width:400,height:400,borderRadius:"50%",background:"rgba(123,47,255,.04)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>

        {/* Sidebar */}
        <div style={{position:"relative",zIndex:1}}>
          <Sidebar screen={screen} go={go}/>
        </div>

        {/* Main content */}
        <main style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,position:"relative",zIndex:1,overflowY:"auto",maxHeight:"100vh"}}>
          <TopBar title={meta.title} subtitle={meta.sub}/>
          <div style={{flex:1,overflowY:"auto"}}>
            {renderScreen()}
          </div>
        </main>
      </div>
    </>
  );
}

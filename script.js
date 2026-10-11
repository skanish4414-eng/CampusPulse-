// CampusPulse — interactive features by SK Anisur Rahaman
const EVENTS = [
  {id:1,name:"InnovateX 2026",category:"Technical",date:"2026-11-20T10:00:00",venue:"Main Auditorium",description:"A high-energy showcase for student innovation, prototypes and bold engineering ideas.",accent:"#d9fa65",icon:"✳"},
  {id:2,name:"CodeSprint",category:"Technical",date:"2026-11-25T09:30:00",venue:"Computer Lab 2",description:"Solve real-world coding challenges, collaborate in teams and sharpen your problem-solving skills.",accent:"#65e2db",icon:"⌘"},
  {id:3,name:"Design Lab",category:"Workshop",date:"2026-12-02T11:00:00",venue:"Innovation Studio",description:"Explore interface design, rapid prototyping and the craft of building better digital experiences.",accent:"#ffc1b2",icon:"✎"},
  {id:4,name:"Rhythm & Roots",category:"Cultural",date:"2026-12-08T16:00:00",venue:"Open Air Stage",description:"An evening of music, dance and performances celebrating the creativity of our campus.",accent:"#d8c4ff",icon:"♫"},
  {id:5,name:"Future Forum",category:"Talk",date:"2026-12-14T12:00:00",venue:"Seminar Hall",description:"Hear fresh perspectives on careers, emerging technology and turning student ideas into impact.",accent:"#ffdb8a",icon:"↗"},
  {id:6,name:"Build with AI",category:"Workshop",date:"2026-12-19T10:00:00",venue:"Digital Learning Hub",description:"A beginner-friendly hands-on session exploring responsible AI tools and creative prototypes.",accent:"#b8c5ff",icon:"✦"},
  {id:7,name:"Campus Photography Walk",category:"Cultural",date:"2027-01-08T08:30:00",venue:"Main Gate",description:"Discover campus details, practise composition and capture the stories hidden in everyday moments.",accent:"#ffc1b2",icon:"◎"},
  {id:8,name:"Startup Spark",category:"Talk",date:"2027-01-15T13:00:00",venue:"Seminar Hall",description:"A student founder meetup about validating ideas, pitching clearly and learning from experiments.",accent:"#d9fa65",icon:"↗"},
  {id:9,name:"Robotics Arena",category:"Technical",date:"2027-01-22T10:00:00",venue:"Workshop Block",description:"Watch student-built robots tackle fun challenges and learn how teams turn concepts into machines.",accent:"#65e2db",icon:"⚙"},
  {id:10,name:"Portfolio Clinic",category:"Workshop",date:"2027-02-03T11:00:00",venue:"Library Collaboration Room",description:"Get practical tips for presenting projects, documenting process and preparing a strong portfolio.",accent:"#d8c4ff",icon:"▤"},
  {id:11,name:"Open Mic Night",category:"Cultural",date:"2027-02-12T17:30:00",venue:"Student Courtyard",description:"Bring poetry, music, comedy or a story and share the stage with the campus community.",accent:"#ffdb8a",icon:"♫"},
  {id:12,name:"Research Remix",category:"Talk",date:"2027-02-20T14:00:00",venue:"Main Auditorium",description:"A friendly research showcase where students explain projects, methods and discoveries in plain language.",accent:"#b8c5ff",icon:"✧"}
];
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const dateOptions = {day:"numeric",month:"short",year:"numeric"};
function formatDate(date){return new Date(date).toLocaleDateString("en-IN",dateOptions);}
function formatDateParts(date){const d=new Date(date);return {day:d.getDate(),month:d.toLocaleDateString("en-IN",{month:"short"}).toUpperCase()};}
function renderEvents(filter="All",showAll=false){
  const now=Date.now();
  let chosen=EVENTS.filter(event=>filter==="All"||event.category===filter);
  if(!showAll && filter==="All") chosen=chosen.slice(0,6);
  $("#eventsGrid").innerHTML=chosen.map(event=>{
    const part=formatDateParts(event.date);
    return `<article class="event-card" style="--card-accent:${event.accent}">
      <div class="event-card-top"><span class="event-category">${event.icon} &nbsp; ${event.category}</span><span class="event-date"><b>${part.day}</b><small>${part.month}</small></span></div>
      <h3>${event.name}</h3><p>${event.description}</p>
      <div class="event-meta"><span>◷ ${new Date(event.date).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span><span>⌖ ${event.venue}</span></div>
      <a href="#register" class="event-link" data-register-event="${event.id}">Reserve your spot <span>↗</span></a>
    </article>`;
  }).join("");
  $("#eventCount").textContent=EVENTS.length;
  $("#showAllEvents").style.display=(filter==="All"&&showAll)?"none":"inline-flex";
  if(chosen.length===0) $("#eventsGrid").innerHTML='<p>No events in this category yet. Try another filter.</p>';
}
$("#eventFilters").addEventListener("click",e=>{
  const chip=e.target.closest("[data-filter]"); if(!chip)return;
  $$(".filter-chip").forEach(btn=>btn.classList.toggle("selected",btn===chip));
  renderEvents(chip.dataset.filter,false);
});
$("#showAllEvents").addEventListener("click",()=>renderEvents("All",true));
$("#eventsGrid").addEventListener("click",e=>{
  const link=e.target.closest("[data-register-event]"); if(!link)return;
  const event=EVENTS.find(item=>item.id===Number(link.dataset.registerEvent));
  if(event) $("#eventSelect").value=event.name;
});
function updateNextEvent(){
  const next=EVENTS.filter(e=>new Date(e.date).getTime()>Date.now()).sort((a,b)=>new Date(a.date)-new Date(b.date))[0];
  if(!next){$("#nextEventName").textContent="More events soon";$("#nextEventDate").textContent="Stay tuned";$("#countdown").innerHTML="<span><b>✦</b><small>SEE YOU</small></span>";return;}
  $("#nextEventName").textContent=next.name;$("#nextEventDate").textContent=formatDate(next.date);
  const diff=Math.max(0,new Date(next.date).getTime()-Date.now());
  const days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000),mins=Math.floor(diff%3600000/60000),secs=Math.floor(diff%60000/1000);
  $("#countdown").innerHTML=[[days,"DAYS"],[hours,"HRS"],[mins,"MIN"],[secs,"SEC"]].map(([n,label])=>`<span><b>${String(n).padStart(2,"0")}</b><small>${label}</small></span>`).join("<i>:</i>");
}
function initTheme(){
  let saved=null;
  try{saved=localStorage.getItem("campuspulse-theme");}
  catch(error){console.warn("Theme preference cannot be read from browser storage.",error);}
  const dark=saved? saved==="dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(dark);
}
function applyTheme(dark){
  document.body.classList.toggle("dark",dark);$("#themeToggle").textContent=dark?"☀":"☾";
  $("#themeToggle").setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
  try{localStorage.setItem("campuspulse-theme",dark?"dark":"light");}
  catch(error){console.warn("Theme preference cannot be saved to browser storage.",error);}
}
$("#themeToggle").addEventListener("click",()=>applyTheme(!document.body.classList.contains("dark")));
const menuToggle=$("#menuToggle"),navLinks=$("#navLinks");
menuToggle.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.textContent=open?"×":"☰";});
$$(".nav-link").forEach(link=>link.addEventListener("click",()=>{navLinks.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.textContent="☰";}));
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$(".nav-link").forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#${entry.target.id}`));}}),{rootMargin:"-35% 0px -55% 0px"});
$$("main section[id]").forEach(section=>sectionObserver.observe(section));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target);}}),{threshold:.12});
$$(".reveal").forEach(el=>revealObserver.observe(el));
const statObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const target=Number(el.dataset.count);let start=0;const step=Math.max(1,Math.ceil(target/45));const timer=setInterval(()=>{start=Math.min(target,start+step);el.textContent=start.toLocaleString("en-IN")+(target===850?"+":"");if(start>=target)clearInterval(timer);},24);statObserver.unobserve(el);}),{threshold:.5});
$$("[data-count]").forEach(el=>statObserver.observe(el));
function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),3500);}
function setFieldError(input,message){const field=input.closest(".field");if(!field)return;field.classList.toggle("invalid",Boolean(message));const error=field.querySelector(".error-message");if(error)error.textContent=message||"";}
const REGISTRATIONS_KEY="campuspulse-registrations";
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function readRegistrations(){
  try{
    const saved=localStorage.getItem(REGISTRATIONS_KEY);
    if(!saved)return [];
    const records=JSON.parse(saved);
    if(!Array.isArray(records))throw new Error("Saved registrations are not a list.");
    return records;
  }catch(error){
    console.error("Could not read registrations from this browser.",error);
    showToast("Could not load saved registrations. Browser storage may be unavailable or invalid.");
    return null;
  }
}
function writeRegistrations(records){
  try{localStorage.setItem(REGISTRATIONS_KEY,JSON.stringify(records));return true;}
  catch(error){
    console.error("Could not save registrations to this browser.",error);
    $("#formStatus").textContent="Your registration could not be saved in this browser. Check browser storage settings and try again.";
    $("#formStatus").style.color="#e04f55";
    showToast("Registration was not saved. Browser storage may be unavailable.");
    return false;
  }
}
function registrationDetails(record){
  const values=[
    ["Full name",record.studentName],["Roll number",record.rollNumber],["Email address",record.email],
    ["Contact number",record.phone],["Department",record.department],["Event",record.event],
    ["Gender",record.gender||"Not provided"],["Note",record.message||"Not provided"],
    ["Registered",record.registeredAt?new Date(record.registeredAt).toLocaleString("en-IN"):"Not available"]
  ];
  return `<dl>${values.map(([label,value])=>`<dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd>`).join("")}</dl>`;
}
function renderStudentResults(records){
  $("#studentResults").innerHTML=records.map(record=>`<article class="student-registration"><h3>${escapeHTML(record.event)}</h3>${registrationDetails(record)}</article>`).join("");
}
function renderAdmin(){
  const records=readRegistrations(),body=$("#adminRegistrations");
  if(!records){$("#adminStatus").textContent="Registration data could not be loaded; no changes were made.";return;}
  const rollIds=new Set(records.map(record=>String(record.rollNumber||"").trim().toLowerCase()).filter(Boolean));
  const eventNames=new Set(records.map(record=>record.event).filter(Boolean));
  $("#adminTotal").textContent=records.length.toLocaleString("en-IN");
  $("#adminStudents").textContent=rollIds.size.toLocaleString("en-IN");
  $("#adminEvents").textContent=eventNames.size.toLocaleString("en-IN");
  const currentFilter=$("#adminEventFilter").value;
  const search=$("#adminSearch").value.trim().toLowerCase();
  const visible=records.filter(record=>{
    const matchesEvent=!currentFilter||record.event===currentFilter;
    const fields=[record.studentName,record.rollNumber,record.email,record.phone,record.department,record.event];
    return matchesEvent&&(!search||fields.some(value=>String(value||"").toLowerCase().includes(search)));
  });
  body.innerHTML=visible.length?visible.map(record=>`<tr>
    <td>${escapeHTML(record.studentName)}</td><td>${escapeHTML(record.rollNumber)}</td>
    <td><a href="mailto:${escapeHTML(record.email)}">${escapeHTML(record.email)}</a></td>
    <td><a href="tel:${escapeHTML(record.phone)}">${escapeHTML(record.phone)}</a></td>
    <td>${escapeHTML(record.department)}</td><td>${escapeHTML(record.event)}</td>
    <td>${escapeHTML(record.registeredAt?new Date(record.registeredAt).toLocaleDateString("en-IN"):"—")}</td>
    <td><button class="admin-delete" type="button" data-delete-registration="${escapeHTML(record.id)}" aria-label="Delete registration for ${escapeHTML(record.studentName)}">Delete</button></td>
  </tr>`).join(""):'<tr><td class="empty-state" colspan="8">No matching registrations found.</td></tr>';
  $("#adminStatus").textContent=records.length?`${visible.length} of ${records.length} registration${records.length===1?"":"s"} shown.`:"";
}
function initPortal(){
  const eventFilter=$("#adminEventFilter");
  eventFilter.innerHTML='<option value="">All events</option>'+[...new Set(EVENTS.map(event=>event.name))].map(name=>`<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`).join("");
  $("#studentLookupForm").addEventListener("submit",event=>{
    event.preventDefault();
    const roll=$("#lookupRoll").value.trim().toLowerCase(),email=$("#lookupEmail").value.trim().toLowerCase();
    const status=$("#studentLookupStatus");
    if(!roll||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){
      status.textContent="Enter both your roll number and a valid registration email.";
      status.style.color="#e04f55";$("#studentResults").replaceChildren();return;
    }
    const records=readRegistrations();
    if(!records){status.textContent="Your details could not be loaded from this browser.";status.style.color="#e04f55";return;}
    const matches=records.filter(record=>String(record.rollNumber||"").trim().toLowerCase()===roll&&String(record.email||"").trim().toLowerCase()===email);
    renderStudentResults(matches);
    status.textContent=matches.length?`Found ${matches.length} registration${matches.length===1?"":"s"} for this student.`:"No registrations matched. Check the roll number and email, or register for an event.";
    status.style.color=matches.length?"#24885e":"#6d7085";
  });
  $("#adminSearch").addEventListener("input",renderAdmin);
  eventFilter.addEventListener("change",renderAdmin);
  $("#adminRegistrations").addEventListener("click",event=>{
    const button=event.target.closest("[data-delete-registration]");
    if(!button)return;
    if(!window.confirm("Delete this student registration from this browser?"))return;
    const records=readRegistrations();
    if(!records)return;
    const next=records.filter(record=>String(record.id)!==button.dataset.deleteRegistration);
    if(writeRegistrations(next)){renderAdmin();showToast("Registration deleted from this browser.");}
  });
  $("#clearRegistrations").addEventListener("click",()=>{
    const records=readRegistrations();
    if(!records)return;
    if(!records.length){showToast("There are no registrations to clear.");return;}
    if(!window.confirm(`Permanently clear all ${records.length} registrations from this browser?`))return;
    if(writeRegistrations([])){renderAdmin();$("#studentResults").replaceChildren();$("#studentLookupStatus").textContent="Registrations were cleared from this browser.";showToast("All local registrations cleared.");}
  });
  $("#exportRegistrations").addEventListener("click",()=>{
    const records=readRegistrations();
    if(!records)return;
    const currentFilter=$("#adminEventFilter").value,search=$("#adminSearch").value.trim().toLowerCase();
    const visible=records.filter(record=>{
      const fields=[record.studentName,record.rollNumber,record.email,record.phone,record.department,record.event];
      return (!currentFilter||record.event===currentFilter)&&(!search||fields.some(value=>String(value||"").toLowerCase().includes(search)));
    });
    if(!visible.length){$("#adminStatus").textContent="There are no matching registrations to export.";return;}
    const columns=["studentName","rollNumber","email","phone","department","event","gender","message","registeredAt"];
    const csvCell=value=>{
      let safe=String(value??"");
      if(/^[\s]*[=+\-@]/.test(safe))safe="'"+safe;
      return `"${safe.replace(/"/g,'""')}"`;
    };
    const csv=[columns.map(csvCell).join(","),...visible.map(record=>columns.map(column=>csvCell(record[column])).join(","))].join("\r\n");
    const url=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));
    const link=document.createElement("a");
    link.href=url;link.download="campuspulse-registrations.csv";link.click();URL.revokeObjectURL(url);
    $("#adminStatus").textContent=`Exported ${visible.length} registration${visible.length===1?"":"s"} to CSV.`;
  });
  renderAdmin();
}
const validators={
  studentName:v=>/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v.trim())?"":"Enter a name with at least 2 letters.",
  rollNumber:v=>v.trim().length>=3?"":"Enter a valid roll number (at least 3 characters).",
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())?"":"Enter a valid email address.",
  phone:v=>/^[6-9]\d{9}$/.test(v.trim())?"":"Enter a valid 10-digit Indian mobile number.",
  department:v=>v?"":"Please choose your department.",
  eventSelect:v=>v?"":"Please choose an event."
};
Object.entries(validators).forEach(([id,validate])=>{const input=$("#"+id);input.addEventListener("blur",()=>setFieldError(input,validate(input.value)));input.addEventListener("input",()=>{if(input.closest(".field").classList.contains("invalid"))setFieldError(input,validate(input.value));});input.addEventListener("change",()=>setFieldError(input,validate(input.value)));});
$("#registrationForm").addEventListener("submit",e=>{
  e.preventDefault();let valid=true;
  Object.entries(validators).forEach(([id,validate])=>{const input=$("#"+id),error=validate(input.value);setFieldError(input,error);if(error)valid=false;});
  const consent=$("#consent"),consentField=consent.closest(".field");consentField.classList.toggle("invalid",!consent.checked);consentField.querySelector(".error-message").textContent=consent.checked?"":"Please confirm your information.";
  if(!consent.checked)valid=false;
  if(!valid){$("#formStatus").textContent="Please correct the highlighted fields.";$("#formStatus").style.color="#e04f55";const first=$(".field.invalid input,.field.invalid select");if(first)first.focus();return;}
  const record={
    id:`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`,
    studentName:$("#studentName").value.trim(),rollNumber:$("#rollNumber").value.trim(),
    email:$("#email").value.trim(),phone:$("#phone").value.trim(),department:$("#department").value,
    event:$("#eventSelect").value,gender:$("#registrationForm input[name='gender']:checked")?.value||"",
    message:$("#message").value.trim(),registeredAt:new Date().toISOString()
  };
  const records=readRegistrations();
  if(!records){$("#formStatus").textContent="Saved registration data could not be read. No new registration was added.";$("#formStatus").style.color="#e04f55";return;}
  if(records.some(item=>String(item.rollNumber||"").trim().toLowerCase()===record.rollNumber.toLowerCase()&&item.event===record.event)){
    $("#formStatus").textContent="This roll number is already registered for that event in this browser.";
    $("#formStatus").style.color="#e04f55";return;
  }
  if(!writeRegistrations([...records,record]))return;
  $("#formStatus").textContent=`Thanks, ${record.studentName}! Your registration for ${record.event} has been saved in this browser.`;
  $("#formStatus").style.color="#24885e";
  renderAdmin();
  showToast("Registration saved in this browser. It has not been sent to a server.");
  e.target.reset();$$(".field.invalid",e.target).forEach(f=>{f.classList.remove("invalid");const err=f.querySelector(".error-message");if(err)err.textContent="";});
});
$("#feedbackForm").addEventListener("submit",e=>{
  e.preventDefault();const name=$("#feedbackName"),email=$("#feedbackEmail"),message=$("#feedbackMessage");
  const checks=[[name,name.value.trim().length>=2?"":"Enter your name."],[email,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())?"":"Enter a valid email."],[message,message.value.trim().length>=15?"":"Please write at least 15 characters."]];
  let valid=true;checks.forEach(([input,error])=>{setFieldError(input,error);if(error)valid=false;});
  if(!valid){$("#feedbackStatus").textContent="Please review the highlighted fields.";$("#feedbackStatus").style.color="#e04f55";return;}
  $("#feedbackStatus").textContent=`Thank you, ${name.value.trim()} — your message preview is ready.`;$("#feedbackStatus").style.color="#24885e";
  showToast("Feedback checked locally. No message was transmitted.");e.target.reset();
});
const eventSelect=$("#eventSelect");
eventSelect.innerHTML+=[...EVENTS].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(e=>`<option value="${e.name}">${e.name} — ${formatDate(e.date)}</option>`).join("");
renderEvents();updateNextEvent();setInterval(updateNextEvent,1000);initTheme();initPortal();

// Local-demo account system: browser storage only, not secure production authentication.
const ACCOUNTS_KEY="campuspulse-demo-accounts";
const SESSION_KEY="campuspulse-demo-session";
function readAccounts(){try{const v=JSON.parse(localStorage.getItem(ACCOUNTS_KEY)||"[]");return Array.isArray(v)?v:[]}catch{return [];}}
function saveAccounts(v){try{localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(v));return true}catch{return false;}}
function setAuthTab(tab){
  $$(".auth-tab").forEach(b=>b.classList.toggle("active",b.dataset.authTab===tab));
  $("#loginForm").hidden=tab!=="login";$("#signupForm").hidden=tab!=="signup";
}
$$("[data-auth-tab]").forEach(b=>b.addEventListener("click",()=>setAuthTab(b.dataset.authTab)));
$$("[data-toggle-password]").forEach(b=>b.addEventListener("click",()=>{
  const input=$("#"+b.dataset.togglePassword);const reveal=input.type==="password";
  input.type=reveal?"text":"password";b.textContent=reveal?"Hide":"Show";b.setAttribute("aria-label",reveal?"Hide password":"Show password");
}));
function showAccount(account){
  $("#loginForm").hidden=true;$("#signupForm").hidden=true;
  $$(".auth-tab").forEach(b=>b.classList.remove("active"));
  $("#accountDashboard").hidden=false;
  $("#accountGreeting").textContent=`Hello, ${account.name.split(/\s+/)[0]}!`;
  $("#accountEmail").textContent=account.email;
  $("#accountAvatar").textContent=(account.name.trim()[0]||"C").toUpperCase();
  try{sessionStorage.setItem(SESSION_KEY,account.email)}catch{}
}
function resetAccountView(){ $("#accountDashboard").hidden=true;setAuthTab("login"); }
function authError(input,message){setFieldError(input,message);if(message)input.setAttribute("aria-invalid","true");else input.removeAttribute("aria-invalid");}
$("#signupForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#signupName"),email=$("#signupEmail"),password=$("#signupPassword"),confirm=$("#signupConfirm");
  const checks=[
    [name,name.value.trim().length>=2?"":"Enter your full name."],
    [email,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())?"":"Enter a valid email address."],
    [password,password.value.length>=6?"":"Use at least 6 characters."],
    [confirm,confirm.value===password.value&&confirm.value?"":"Passwords do not match."]
  ];
  let valid=true;checks.forEach(([input,msg])=>{authError(input,msg);if(msg)valid=false;});
  const consent=$("#signupConsent");
  if(!consent.checked){$("#signupStatus").textContent="Please confirm to create your demo profile.";$ ("#signupStatus").style.color="#e04f55";valid=false;}
  if(!valid){$("#signupStatus").textContent="Please check the highlighted fields.";$("#signupStatus").style.color="#e04f55";return;}
  const accounts=readAccounts(),normalized=email.value.trim().toLowerCase();
  if(accounts.some(a=>a.email===normalized)){authError(email,"An account with this email already exists.");$("#signupStatus").textContent="Try logging in with this email." ;$("#signupStatus").style.color="#e04f55";return;}
  const account={name:name.value.trim(),email:normalized,password:password.value,createdAt:new Date().toISOString()};
  if(!saveAccounts([...accounts,account])){$("#signupStatus").textContent="Could not save this demo account. Check browser storage.";$("#signupStatus").style.color="#e04f55";return;}
  $("#signupStatus").textContent="Account created successfully! You're signed in.";$("#signupStatus").style.color="#24885e";
  showAccount(account);showToast("Welcome to CampusPulse!");
});
$("#loginForm").addEventListener("submit",e=>{
  e.preventDefault();const email=$("#loginEmail"),password=$("#loginPassword");
  const emailError=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())?"":"Enter a valid email address.";
  const passError=password.value?"":"Enter your password.";
  authError(email,emailError);authError(password,passError);
  if(emailError||passError){$("#loginStatus").textContent="Please enter a valid email and password." ;$("#loginStatus").style.color="#e04f55";return;}
  const account=readAccounts().find(a=>a.email===email.value.trim().toLowerCase()&&a.password===password.value);
  if(!account){$("#loginStatus").textContent="Account not found or password is incorrect. Create an account if you're new.";$("#loginStatus").style.color="#e04f55";return;}
  $("#loginStatus").textContent="Login successful.";$("#loginStatus").style.color="#24885e";showAccount(account);showToast("You're logged in!");
});
$("#logoutButton").addEventListener("click",()=>{
  try{sessionStorage.removeItem(SESSION_KEY)}catch{}
  resetAccountView();$("#loginForm").reset();$("#signupForm").reset();showToast("You've logged out.");
});
try{
  const activeEmail=sessionStorage.getItem(SESSION_KEY);
  if(activeEmail){const account=readAccounts().find(a=>a.email===activeEmail);if(account)showAccount(account);}
}catch{}

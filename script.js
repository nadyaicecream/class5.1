let classData = null;
let ytPlayer = null;
let ytReady = false;
let pendingPlay = false;
const $ = (id) => document.getElementById(id);
const safeText = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const initialsEmoji = ["👩🏻‍🎓","👩🏼‍🎓","👩🏽‍🎓","👩🏻‍🎓","👩🏼‍🎓"];
const getEmoji = (i) => initialsEmoji[i % initialsEmoji.length];

async function init() {
  try {
    const response = await fetch("assets/data.json");
    if (!response.ok) throw new Error("Data file not found");
    classData = await response.json();
  } catch (error) {
    console.error(error);
    document.querySelector("main").innerHTML = '<section class="section-wrap section-block"><h2>Oops! Data belum bisa dimuat.</h2><p>Pastikan folder assets ikut di-upload ke GitHub.</p></section>';
    return;
  }
  $("slogan").textContent = classData.slogan;
  $("announcement").textContent = classData.announcement;
  renderMembers(); renderCleaning(); renderLessons(); renderCategories(); renderBirthdays(); renderGuestbook();
  startClock(); startCountdown(); showDailyQuote();
  bindEvents();
}
function startClock() {
  const tick = () => {
    const now = new Date();
    $("liveClock").textContent = now.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
    $("liveDate").textContent = now.toLocaleDateString("id-ID",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  };
  tick(); setInterval(tick,1000);
}
function startCountdown() {
  const target = new Date(classData.countdown.date).getTime();
  const tick = () => {
    const diff = target - Date.now();
    if (!Number.isFinite(target) || diff <= 0) { $("countdown").textContent = diff <= 0 ? "It's today!" : "Set date"; return; }
    const days = Math.floor(diff/86400000), hours = Math.floor(diff%86400000/3600000);
    $("countdown").textContent = `${days}d ${hours}h`;
    $("countdownLabel").textContent = `menuju ${classData.countdown.label}`;
  };
  tick(); setInterval(tick,60000);
}
function showDailyQuote() {
  const q = classData.quotes[Math.floor(Math.random()*classData.quotes.length)];
  $("dailyQuote").textContent = q;
}
function renderMembers() {
  const search = $("memberSearch").value.toLowerCase();
  const sort = $("memberSort").value;
  let list = [...classData.members].filter(m => m.name.toLowerCase().includes(search));
  if(sort==="az") list.sort((a,b)=>a.name.localeCompare(b.name));
  else list.sort((a,b)=>a.number-b.number);
  $("memberCount").textContent = `${list.length} anggota`;
  $("memberGrid").innerHTML = list.map(m=>`<button class="member-card" data-member="${m.number}" aria-label="Lihat profil ${safeText(m.name)}"><span class="member-number">#${m.number}</span><span class="avatar">${getEmoji(m.number-1)}</span><b>${safeText(m.name)}</b><small>Classmate · 5.1</small></button>`).join("") || '<p class="small-note">Nama tidak ditemukan.</p>';
  document.querySelectorAll("[data-member]").forEach(el=>el.addEventListener("click",()=>showProfile(Number(el.dataset.member))));
}
function showProfile(number) {
  const m = classData.members.find(x=>x.number===number); if(!m)return;
  const facts = [["Motto",m.motto],["Hobi",m.hobby],["Makanan favorit",m.favoriteFood],["Minuman favorit",m.favoriteDrink],["Warna favorit",m.favoriteColor],["Fun fact",m.funFact],["Cita-cita",m.dream],["Quote",m.quote]];
  $("profileContent").innerHTML = `<div class="profile-top"><span class="avatar">${getEmoji(number-1)}</span><h3>${safeText(m.name)}</h3><p>Nomor absen ${m.number} · Class 5.1</p></div><div class="profile-facts">${facts.map(([k,v])=>`<div class="profile-fact"><small>${safeText(k)}</small><b>${safeText(v)}</b></div>`).join("")}</div>`;
  $("profileDialog").showModal();
}
function renderCleaning() {
  const days = Object.entries(classData.cleaningSchedule);
  const decos = ["🧹","🪣","✨","🧽","🧹"];
  $("cleaningGrid").innerHTML = days.map(([day,names],i)=>`<article class="day-card"><div class="day-top"><b>${day}</b><span>${["✦","☁","★","✧","♡"][i]}</span></div><div class="name-list">${names.map(n=>`<span>${safeText(n)}</span>`).join("")}</div><div class="day-deco">${decos[i]}</div></article>`).join("");
}
function renderLessons() {
  $("lessonGrid").innerHTML = Object.entries(classData.subjects).map(([day,subjects])=>`<article class="lesson-card"><h3>📘 ${day}</h3>${subjects.map(s=>`<span class="subject-chip">${safeText(s)}</span>`).join("")}</article>`).join("");
}
function renderCategories() {
  $("memoryCategories").innerHTML = classData.memoryCategories.map((c,i)=>`<button class="category-pill ${i===0?"active":""}" data-category="${safeText(c)}">${safeText(c)}</button>`).join("");
  document.querySelectorAll(".category-pill").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".category-pill").forEach(x=>x.classList.remove("active"));b.classList.add("active");}));
}
function renderBirthdays() {
  $("birthdayList").innerHTML = classData.birthdays.map(b=>`<div class="birthday-row"><b>🎂 ${safeText(b.name)}</b><span>${safeText(b.date)}</span></div>`).join("");
}
function renderGuestbook() {
  let messages = [];
  try { messages = JSON.parse(localStorage.getItem("class51Guestbook") || "[]"); } catch {}
  $("guestMessages").innerHTML = messages.length ? messages.slice(0,20).map(m=>`<article class="guest-message"><b>♡ ${safeText(m.name)}</b><p>${safeText(m.message)}</p><small>${safeText(m.date)}</small></article>`).join("") : '<div class="memory-empty">💌<b>No messages yet</b><span>Be the first to leave a little note!</span></div>';
}
function bindEvents() {
  $("memberSearch").addEventListener("input",renderMembers);
  $("memberSort").addEventListener("change",renderMembers);
  $("newQuote").addEventListener("click",showDailyQuote);
  $("menuToggle").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
  document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",()=>$("mainNav").classList.remove("open")));
  $("closeDialog").addEventListener("click",()=>$("profileDialog").close());
  $("guestMessage").addEventListener("input",e=>$("charCount").textContent=e.target.value.length);
  $("guestForm").addEventListener("submit",e=>{
    e.preventDefault();
    const entry={name:$("guestName").value.trim(),message:$("guestMessage").value.trim(),date:new Date().toLocaleDateString("id-ID")};
    if(!entry.name||!entry.message)return;
    let messages=[];try{messages=JSON.parse(localStorage.getItem("class51Guestbook")||"[]")}catch{}
    messages.unshift(entry); localStorage.setItem("class51Guestbook",JSON.stringify(messages.slice(0,40)));
    $("guestForm").reset();$("charCount").textContent="0";renderGuestbook();
  });
  $("openJar").addEventListener("click",()=>{
    const notes=["Terima kasih sudah menjadi bagian dari cerita kelas ini. ♡","Jangan lupa, kamu lebih hebat dari yang kamu kira!","Satu hari biasa bersama teman bisa jadi kenangan luar biasa.","Semangat belajar, semangat bertumbuh. We got this!","Senyummu adalah bagian kecil dari hangatnya kelas kita."];
    $("jarMessage").textContent=notes[Math.floor(Math.random()*notes.length)];
  });
  $("moodOptions").addEventListener("click",e=>{
    const btn=e.target.closest("button[data-mood]");if(!btn)return;
    document.querySelectorAll("#moodOptions button").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");localStorage.setItem("class51Mood",btn.dataset.mood);
    $("moodFeedback").textContent=`Mood kamu hari ini: ${btn.dataset.mood}. Thanks for sharing! ♡`;
  });
  $("memoryUpload").addEventListener("change",e=>{
    const files=[...e.target.files]; if(!files.length)return;
    const grid=$("memoryGrid");grid.innerHTML="";
    files.forEach(file=>{
      if(!file.type.startsWith("image/")&&!file.type.startsWith("video/"))return;
      const url=URL.createObjectURL(file), isVideo=file.type.startsWith("video/");
      const card=document.createElement("article");card.className="memory-item";
      const media=document.createElement(isVideo?"video":"img");media.src=url;if(isVideo)media.controls=true;else media.alt=file.name;
      const title=document.createElement("p");title.textContent=file.name.replace(/\.[^.]+$/,"");
      const sub=document.createElement("small");sub.textContent="Your class memory ♡";
      card.append(media,title,sub);grid.append(card);
    });
    e.target.value="";
  });
  $("enterBtn").addEventListener("click",()=>{
    $("entryScreen").classList.add("hidden");
    pendingPlay=true; playMusic();
  });
  $("playPause").addEventListener("click",()=>{
    if(!ytReady){pendingPlay=true;return;}
    if(ytPlayer.getPlayerState()===1){ytPlayer.pauseVideo();setMusicStatus(false)}else{ytPlayer.playVideo();setMusicStatus(true)}
  });
  $("muteBtn").addEventListener("click",()=>{
    if(!ytReady)return;
    if(ytPlayer.isMuted()){ytPlayer.unMute();$("muteBtn").textContent="🔊"}else{ytPlayer.mute();$("muteBtn").textContent="🔇"}
  });
}
function setMusicStatus(playing){$("playPause").textContent=playing?"Ⅱ":"▶";$("playPause").setAttribute("aria-label",playing?"Pause music":"Play music");$("musicStatus").textContent=playing?"Playing · loop on":"Music is paused";}
function playMusic(){
  if(ytReady){ytPlayer.playVideo();setMusicStatus(true)}else{pendingPlay=true;$("musicStatus").textContent="Connecting to official audio…";}
}
window.onYouTubeIframeAPIReady=function(){
  ytPlayer=new YT.Player("youtubePlayer",{height:"1",width:"1",videoId:"oOXba6xE41Q",playerVars:{autoplay:0,controls:0,disablekb:1,loop:1,playlist:"oOXba6xE41Q",playsinline:1,rel:0},events:{
    onReady:()=>{ytReady=true;if(pendingPlay){ytPlayer.playVideo();setMusicStatus(true)}},
    onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING)setMusicStatus(true);if(e.data===YT.PlayerState.PAUSED||e.data===YT.PlayerState.ENDED)setMusicStatus(false)},
    onError:()=>{$("musicStatus").textContent="Audio tidak tersedia · buka video resmi ↗"}
  }});
};
init();

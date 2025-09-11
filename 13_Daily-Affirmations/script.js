/* script.js — shared between index.html & favorites.html */

/* Affirmations source */
const AFFIRMATIONS = [
  "You are capable of achieving great things.",
  "Every day is a new opportunity to grow.",
  "Believe in yourself and your abilities.",
  "Your potential is limitless.",
  "Positive thoughts create positive outcomes.",
  "You are stronger than you think.",
  "Gratitude turns what we have into enough.",
  "Small steps every day lead to big results.",
  "You deserve time for yourself and your wellbeing.",
  "You learn and improve with every experience.",
  "You radiate confidence and kindness.",
  "You attract opportunities through effort and patience."
];

const STORAGE = {
  TODAY_AFF: 'uplift_todayAffirmation',
  AFF_DATE: 'uplift_affirmationDate',
  FAVORITES: 'uplift_favorites',
  THEME: 'uplift_dark'
};

/* Utility functions */
function $(id){ return document.getElementById(id); }
function showToast(msg, timeout=2200, elId='toast'){
  const t = document.getElementById(elId) || createToastEl(elId);
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(()=> t.classList.remove('show'), timeout);
}
function createToastEl(id){
  const d = document.createElement('div'); d.id=id; d.className='toast'; document.body.appendChild(d); return d;
}

/* THEME handling (shared) */
function applyThemeFromStorage(){
  const dark = localStorage.getItem(STORAGE.THEME);
  if (dark) document.documentElement.classList.add('dark');
}
function toggleTheme(){
  const isDark = document.documentElement.classList.toggle('dark');
  if (isDark) localStorage.setItem(STORAGE.THEME, '1'); else localStorage.removeItem(STORAGE.THEME);
}

/* FAVORITES helpers */
function getFavorites(){ return JSON.parse(localStorage.getItem(STORAGE.FAVORITES) || '[]'); }
function saveFavorites(list){ localStorage.setItem(STORAGE.FAVORITES, JSON.stringify(list)); }
function updateFavCount(){
  const a = document.querySelectorAll('.fav-count');
  const c = getFavorites().length;
  a.forEach(el => el.textContent = c);
}

/* INDEX page logic */
function initIndex(){
  applyThemeFromStorage();
  // header elements
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) darkToggle.addEventListener('click', ()=>{ toggleTheme(); darkToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙'; });

  // elements
  const affTextEl = $('affirmationText');
  const saveBtn = $('saveBtn');
  const nextBtn = $('nextBtn');
  const copyBtn = $('copyBtn');
  const waBtn = $('waShare');
  const twBtn = $('twShare');
  const fbBtn = $('fbShare');

  // load or set today's affirmation
  const todayKey = new Date().toDateString();
  const storedDate = localStorage.getItem(STORAGE.AFF_DATE);
  let todayAff = localStorage.getItem(STORAGE.TODAY_AFF);

  if (storedDate !== todayKey || !todayAff){
    // pick random base affirmation for the day
    todayAff = AFFIRMATIONS[Math.floor(Math.random()*AFFIRMATIONS.length)];
    localStorage.setItem(STORAGE.TODAY_AFF, todayAff);
    localStorage.setItem(STORAGE.AFF_DATE, todayKey);
  }
  // currentDisplayed may be alternative; initialize to day's main
  let currentDisplayed = todayAff;
  affTextEl.textContent = currentDisplayed;

  // Next button: show alternative affirmation (not change day's main)
  nextBtn.addEventListener('click', ()=>{
    // pick random different affirmation
    const alternatives = AFFIRMATIONS.filter(a => a !== todayAff);
    if (!alternatives.length) return;
    // shuffle pick
    currentDisplayed = alternatives[Math.floor(Math.random()*alternatives.length)];
    affTextEl.textContent = currentDisplayed;
    showToast('Showing another affirmation for today');
  });

  // Save button: add currentDisplayed to favorites if not exists
  saveBtn.addEventListener('click', ()=>{
    let favs = getFavorites();
    if (favs.includes(currentDisplayed)){
      saveBtn.textContent = 'Saved!';
      showToast('Already in favorites');
      return;
    }
    favs.push(currentDisplayed);
    saveFavorites(favs);
    updateFavCount();
    saveBtn.textContent = 'Saved!';
    showToast('Saved to favorites');
    // small animation
    saveBtn.classList.add('flash');
    setTimeout(()=> saveBtn.classList.remove('flash'), 700);
  });

  // Copy
  if (copyBtn){
    copyBtn.addEventListener('click', async ()=> {
      try{
        await navigator.clipboard.writeText(currentDisplayed);
        showToast('Copied to clipboard');
      }catch(err){
        showToast('Copy failed');
      }
    });
  }

  // Sharing
  const shareText = ()=> encodeURIComponent(currentDisplayed + " — via Uplift");
  if (waBtn) waBtn.addEventListener('click', ()=> {
    const url = 'https://wa.me/?text=' + shareText();
    window.open(url,'_blank');
  });
  if (twBtn) twBtn.addEventListener('click', ()=> {
    const url = 'https://twitter.com/intent/tweet?text=' + shareText();
    window.open(url,'_blank');
  });
  if (fbBtn) fbBtn.addEventListener('click', ()=> {
    // Facebook sharer uses a URL; we'll use the text as quote and a fallback URL
    const shareUrl = 'https://example.com'; // replace with real app URL if available
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${shareText()}`;
    window.open(url,'_blank');
  });

  // update favorites count
  updateFavCount();

  // Reset Save button text when user navigates back or after some time
  window.addEventListener('visibilitychange', ()=> {
    if (document.visibilityState === 'visible') { $('saveBtn').textContent = 'Save'; }
  });
}

/* FAVORITES page logic */
function initFavorites(){
  applyThemeFromStorage();
  const darkToggleFav = document.getElementById('darkToggleFav');
  if (darkToggleFav) darkToggleFav.addEventListener('click', ()=>{ toggleTheme(); darkToggleFav.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙'; });

  const listEl = $('favoritesList');
  const noFavsEl = $('noFavs');
  const clearFavsBtn = $('clearFavs');

  function renderFavs(){
    const favs = getFavorites();
    updateFavCount();
    listEl.innerHTML = '';
    if (!favs.length){ noFavsEl.style.display='block'; return; }
    noFavsEl.style.display='none';
    favs.forEach((f, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span style="font-style:italic">${f}</span>
        <div style="display:flex;gap:8px">
          <button class="icon-btn" onclick="copyFav(${i})">📋</button>
          <button class="icon-btn" onclick="shareFav(${i}, 'wa')">🟢</button>
          <button class="icon-btn" onclick="shareFav(${i}, 'tw')">🐦</button>
          <button class="btn warn" onclick="removeFav(${i})">Delete</button>
        </div>`;
      listEl.appendChild(li);
    });
  }

  window.copyFav = function(i){
    const favs = getFavorites();
    navigator.clipboard.writeText(favs[i]).then(()=> showToast('Copied'));
  };
  window.shareFav = function(i, where){
    const favs = getFavorites();
    const text = encodeURIComponent(favs[i] + ' — via Uplift');
    if (where==='wa') window.open('https://wa.me/?text='+text,'_blank');
    if (where==='tw') window.open('https://twitter.com/intent/tweet?text='+text,'_blank');
  };
  window.removeFav = function(i){
    const favs = getFavorites();
    favs.splice(i,1);
    saveFavorites(favs);
    renderFavs();
    showToast('Removed');
  };
  clearFavsBtn.addEventListener('click', ()=>{
    if (!confirm('Clear all favorites?')) return;
    saveFavorites([]);
    renderFavs();
    showToast('All cleared');
  });

  // initial render
  renderFavs();
}

/* init loader to detect which page */
document.addEventListener('DOMContentLoaded', ()=>{
  applyThemeFromStorage();
  if (document.getElementById('affirmationText')) initIndex();
  if (document.getElementById('favoritesList')) initFavorites();
  // make sure toast exists
  createToastEl('toast');
  createToastEl('toastFav');
  updateFavCount();
});

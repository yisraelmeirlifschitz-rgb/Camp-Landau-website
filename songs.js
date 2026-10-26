// Camp songs player, shared by the home page and /music.
// Fills #audioList with every song in /audio: play it right on the page, or download it.
// When the list is built it fires a "songsready" event, so a #songs link can jump to it.
(function(){
const list=document.getElementById('audioList');
if(!list)return;

const SONG_API='https://api.github.com/repos/yisraelmeirlifschitz-rgb/Camp-Landau-website/contents/audio';
const ICON_PLAY='<svg class="ico-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const ICON_PAUSE='<svg class="ico-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
const ICON_DL='<svg viewBox="0 0 24 24"><path d="M12 16l-6-6h4V4h4v6h4l-6 6zm-7 2h14v2H5v-2z"/></svg>';

// GitHub's API allows 60 requests an hour per network, which a busy shared
// connection can use up. When it refuses, fall back to the songs that were here
// at the last update, so the player never comes up empty.
// When you add a song to /audio, add its file name here too.
const SONGS_FALLBACK=['Camp Landau 2025 Kululam.mp3','Camp Landau Remix #1.mp3','Camp Landau remix #2.mp3','See The Good.mp3'];

// One element for every song, so starting one always stops the other
const audio=new Audio();
audio.preload='none';
let currentRow=null;

function fmt(s){
  if(!isFinite(s))return '0:00';
  const m=Math.floor(s/60), r=Math.floor(s%60);
  return m+':'+String(r).padStart(2,'0');
}
function paintSeek(el){
  const pct=el.max>0 ? (el.value/el.max)*100 : 0;
  el.style.background='linear-gradient(to right,var(--primary) '+pct+'%,#dfe2e6 '+pct+'%)';
}
function clearRow(){
  if(!currentRow)return;
  currentRow.classList.remove('playing');
  currentRow=null;
}

// A video starting on the page calls this, so a song never plays under it
window.pauseSongs=()=>{audio.pause();clearRow();};

fetch(SONG_API)
  .then(r=>{if(!r.ok)throw new Error('api');return r.json();})
  .catch(()=>SONGS_FALLBACK.map(name=>({name})))
  .then(files=>{
    const songs=files.filter(f=>f.name.match(/\.(mp3|wav|m4a|ogg|flac)$/i));
    if(!songs.length){list.textContent='No songs uploaded yet.';return;}
    list.innerHTML='';

    songs.forEach(song=>{
      const name=song.name.replace(/\.[^.]+$/,'');
      // The files deploy with the site, so play and download them from here.
      // Same origin also lets the download attribute actually download.
      const url='/audio/'+encodeURIComponent(song.name);
      const row=document.createElement('div');
      row.className='song';

      const btn=document.createElement('button');
      btn.className='song-btn';
      btn.type='button';
      btn.setAttribute('aria-label','Play '+name);
      btn.innerHTML=ICON_PLAY+ICON_PAUSE;

      const main=document.createElement('div');
      main.className='song-main';
      const nm=document.createElement('div');
      nm.className='song-name';
      nm.textContent=name;
      const bar=document.createElement('div');
      bar.className='song-bar';
      const seek=document.createElement('input');
      seek.type='range';seek.className='song-seek';
      seek.min=0;seek.max=0;seek.value=0;seek.step='any';
      seek.setAttribute('aria-label','Seek');
      const time=document.createElement('span');
      time.className='song-time';
      time.textContent='0:00';
      bar.appendChild(seek);bar.appendChild(time);
      main.appendChild(nm);main.appendChild(bar);

      const dl=document.createElement('a');
      dl.className='song-dl';
      dl.href=url;
      dl.download=song.name;
      dl.title='Download '+name;
      dl.setAttribute('aria-label','Download '+name);
      dl.innerHTML=ICON_DL;

      row.appendChild(btn);row.appendChild(main);row.appendChild(dl);
      list.appendChild(row);

      row._src=url;
      row._seek=seek;
      row._time=time;

      btn.addEventListener('click',()=>{
        if(currentRow===row){
          if(audio.paused){audio.play();}else{audio.pause();}
          return;
        }
        clearRow();
        currentRow=row;
        row.classList.add('playing');
        audio.src=row._src;
        audio.play();
      });

      seek.addEventListener('input',()=>{
        if(currentRow===row&&isFinite(audio.duration)){
          audio.currentTime=seek.value;
          paintSeek(seek);
        }
      });
    });

    audio.addEventListener('loadedmetadata',()=>{
      if(!currentRow)return;
      currentRow._seek.max=audio.duration||0;
      paintSeek(currentRow._seek);
    });
    audio.addEventListener('timeupdate',()=>{
      if(!currentRow)return;
      currentRow._seek.value=audio.currentTime;
      paintSeek(currentRow._seek);
      currentRow._time.textContent=fmt(audio.currentTime)+' / '+fmt(audio.duration);
    });
    audio.addEventListener('ended',()=>{
      if(!currentRow)return;
      currentRow._seek.value=0;
      paintSeek(currentRow._seek);
      clearRow();
    });
    audio.addEventListener('error',()=>{
      if(!currentRow)return;
      currentRow._time.textContent='Could not play';
    });

    document.dispatchEvent(new Event('songsready'));
  })
  .catch(()=>{list.textContent='Could not load songs.';});
})();

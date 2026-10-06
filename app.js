const state={mode:'IDLE',tv:false,avr:false,volume:-28,input:null,scene:'off',muted:false};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];

function clock(){
  const d=new Date();
  $('#clock').textContent=d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  $('#date').textContent=d.toLocaleDateString([], {weekday:'short',month:'short',day:'numeric'}).toUpperCase();
}
setInterval(clock,1000);clock();

function render(){
  $('#tvStatus').textContent=state.tv?'ON':'OFF';
  $('#avrStatus').textContent=state.avr?'ON':'OFF';
  $('#devTv').style.background=state.tv?'var(--green)':'#59616d';
  $('#devAvr').style.background=state.avr?'var(--green)':'#59616d';
  $('#volumeValue').textContent=state.muted?'MUTE':state.volume;
  $('#volumeValue').classList.toggle('muted-value',state.muted);
  $('#muteBtn').textContent=state.muted?'MUTED':'MUTE';
  $('#muteBtn').classList.toggle('active',state.muted);
  $('#modeValue').textContent=state.mode;
  $$('.activity').forEach(b=>b.classList.toggle('active',b.dataset.activity===state.mode.toLowerCase()));
  $$('.inputs button').forEach(b=>b.classList.toggle('active',b.dataset.input===state.input));
  $$('.mini-grid button').forEach(b=>b.classList.toggle('active',b.dataset.scene===state.scene));
  const rot=-28+Math.max(0,Math.min(56,(state.volume+60)*1.35));
  $('#meterL').style.transform=`rotate(${state.muted?-28:rot}deg)`;
  $('#meterR').style.transform=`rotate(${state.muted?-28:rot-4}deg)`;
}
function tars(line){$('#tarsLine').textContent=line}
function tapFeedback(el){
  el.classList.add('pressed');
  setTimeout(()=>el.classList.remove('pressed'),140);
}

$$('.activity').forEach(btn=>btn.addEventListener('click',()=>{
  state.mode=btn.dataset.activity.toUpperCase(); state.tv=true; state.avr=true;
  const map={movie:'TV',tv:'TV',pc:'PC',music:'AUX'}; state.input=map[btn.dataset.activity];
  if(btn.dataset.activity==='movie') state.scene='movie';
  tars(`${state.mode} mode selected. Simulated for now, but the bones are alive.`); render();
}));
$('#volDown').onclick=e=>{tapFeedback(e.currentTarget);state.volume=Math.max(-60,state.volume-1);state.muted=false;render()};
$('#volUp').onclick=e=>{tapFeedback(e.currentTarget);state.volume=Math.min(0,state.volume+1);state.muted=false;render()};
$('#muteBtn').onclick=()=>{state.muted=!state.muted;tars(state.muted?'Audio muted. Enjoy the silence.':'Audio restored. Back to business.');render()};
$$('.inputs button').forEach(b=>b.onclick=()=>{state.input=b.dataset.input;state.tv=true;state.avr=true;render()});
$$('.mini-grid button').forEach(b=>b.onclick=()=>{state.scene=b.dataset.scene;render();tars(`Lighting scene: ${state.scene}.`)});
$('#allOff').onclick=()=>{state.mode='IDLE';state.tv=false;state.avr=false;state.input=null;state.scene='off';state.muted=false;tars('Everything off. Quiet room. Mission accomplished.');render()};
render();

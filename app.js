(() => {
'use strict';

const KEY='fitCalculatorPro.v1';
const defaultState={profile:null,plan:null,measurements:[],proteinLogs:[],workouts:[],theme:'auto'};
let state=loadState();
let deferredPrompt=null;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const num=(id)=>{const v=parseFloat($('#'+id).value);return Number.isFinite(v)?v:null};
const round=(v,d=0)=>Number(v.toFixed(d));
const fmt=(v,d=0)=>Number(v).toLocaleString('es-PE',{minimumFractionDigits:d,maximumFractionDigits:d});
const today=()=>new Date().toISOString().slice(0,10);

const EXERCISES={
 press_banca:{name:'Press de banca',step:2.5},press_inclinado:{name:'Press inclinado',step:2.5},fondos:{name:'Fondos',step:2.5},
 remo_barra:{name:'Remo con barra',step:2.5},jalon_pecho:{name:'Jalón al pecho',step:5},dominadas:{name:'Dominadas',step:2.5},
 sentadilla:{name:'Sentadilla',step:5},peso_muerto:{name:'Peso muerto',step:5},prensa:{name:'Prensa de piernas',step:5},hip_thrust:{name:'Hip thrust',step:5},
 press_militar:{name:'Press militar',step:2.5},curl_biceps:{name:'Curl de bíceps',step:1},extension_triceps:{name:'Extensión de tríceps',step:1}
};
let trainingMetric='e1rm';
const e1rm=(weight,reps)=>weight>0&&reps>0?weight*(1+reps/30):0;
const sessionStats=w=>{
 const valid=(w.sets||[]).filter(s=>s.weight>=0&&s.reps>0);
 return{
   volume:valid.reduce((a,s)=>a+s.weight*s.reps,0),
   topWeight:valid.reduce((a,s)=>Math.max(a,s.weight),0),
   e1rm:valid.reduce((a,s)=>Math.max(a,e1rm(s.weight,s.reps)),0),
   avgRir:valid.length?valid.reduce((a,s)=>a+s.rir,0)/valid.length:0
 };
};


function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaultState}}}
function saveState(){localStorage.setItem(KEY,JSON.stringify(state))}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2400)}
function setText(id,val){const el=$('#'+id);if(el)el.textContent=val}

function applyTheme(){
  const useDark=state.theme==='dark'||(state.theme==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme=useDark?'dark':'light';
  setText('themeLabel',state.theme==='auto'?'Automática':state.theme==='dark'?'Oscura':'Clara');
  const meta=$('meta[name=theme-color]');if(meta)meta.content=useDark?'#0c1411':'#101b17';
  requestAnimationFrame(renderCharts);
}
function cycleTheme(){
  state.theme=state.theme==='auto'?'light':state.theme==='light'?'dark':'auto';saveState();applyTheme();toast('Apariencia: '+(state.theme==='auto'?'automática':state.theme==='light'?'clara':'oscura'));
}

function showView(name){
  $$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+name));
  $$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  scrollTo({top:0,behavior:'smooth'});
  if(name==='home'||name==='progress'||name==='training')requestAnimationFrame(renderCharts);
  if(name==='history')renderHistory();
}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));

function bmiCategory(v){
 if(v<18.5)return['Bajo peso','low'];if(v<25)return['Rango saludable','healthy'];if(v<30)return['Sobrepeso','high'];
 if(v<35)return['Obesidad clase I','high'];if(v<40)return['Obesidad clase II','high'];return['Obesidad clase III','high'];
}
function bodyFatCategory(v,sex,age){
 const male=sex==='male';
 let ranges;
 if(male) ranges=age<40?[8,20,25]:age<60?[11,22,28]:[13,25,30];
 else ranges=age<40?[21,33,39]:age<60?[23,35,40]:[24,36,42];
 if(v<ranges[0])return'Muy bajo';if(v<=ranges[1])return'Rango habitual';if(v<=ranges[2])return'Elevado';return'Muy elevado';
}
function calculate(p){
 const bmi=p.weight/((p.height/100)**2);
 const bmr=10*p.weight+6.25*p.height-5*p.age+(p.sex==='male'?5:-161);
 const tdee=bmr*p.activity;
 const desiredWeekly=p.goal==='maintain'?0:p.weeklyRate*(p.goal==='lose'?-1:1);
 let delta=desiredWeekly*7700/7;
 const maxDelta=p.goal==='lose'?-tdee*.25:p.goal==='gain'?tdee*.15:0;
 if(p.goal==='lose')delta=Math.max(delta,maxDelta);
 if(p.goal==='gain')delta=Math.min(delta,maxDelta);
 let target=tdee+delta;
 const floor=p.sex==='male'?1500:1200;
 let safetyAdjusted=false;
 if(target<floor){target=floor;delta=target-tdee;safetyAdjusted=true}
 let proteinPerKg=p.training==='strength'?2.0:p.goal==='lose'?1.8:p.training==='endurance'?1.6:1.5;
 let protein=round(p.weight*proteinPerKg);
 let fats=round(p.weight*(p.goal==='lose'?.8:p.goal==='gain'?1:0.9));
 const remaining=Math.max(0,target-protein*4-fats*9);
 let carbs=round(remaining/4);
 const water=p.weight*35+(p.activity>=1.55?350:0)+(p.activity>=1.725?250:0);
 const healthyMin=18.5*(p.height/100)**2,healthyMax=24.9*(p.height/100)**2;
 let bodyFat=null;
 if(p.waist&&p.neck&&p.waist>p.neck){
   if(p.sex==='male')bodyFat=495/(1.0324-0.19077*Math.log10(p.waist-p.neck)+0.15456*Math.log10(p.height))-450;
   else if(p.hip&&p.waist+p.hip>p.neck)bodyFat=495/(1.29579-0.35004*Math.log10(p.waist+p.hip-p.neck)+0.22100*Math.log10(p.height))-450;
   if(bodyFat!==null&&(bodyFat<2||bodyFat>70))bodyFat=null;
 }
 const leanMass=bodyFat!==null?p.weight*(1-bodyFat/100):null;
 const whtr=p.waist?p.waist/p.height:null;
 let weeks=null,goalDate=null;
 if(p.goal!=='maintain'&&p.targetWeight&&Math.abs(p.targetWeight-p.weight)>.05){
   const actualWeekly=Math.abs(delta)*7/7700;
   if(actualWeekly>0){weeks=Math.ceil(Math.abs(p.targetWeight-p.weight)/actualWeekly);const d=new Date();d.setDate(d.getDate()+weeks*7);goalDate=d.toISOString().slice(0,10)}
 }
 return {bmi,bmr,tdee,target,delta,protein,carbs,fats,water,healthyMin,healthyMax,bodyFat,leanMass,whtr,weeks,goalDate,safetyAdjusted,createdAt:new Date().toISOString()};
}

function gatherProfile(){
 return{name:$('#name').value.trim(),sex:$('#sex').value,age:num('age'),weight:num('weight'),height:num('height'),activity:num('activity'),
 goal:$('#goal').value,targetWeight:num('targetWeight'),weeklyRate:num('weeklyRate')||.5,waist:num('waist'),neck:num('neck'),hip:num('hip'),training:$('#training').value};
}
function validateProfile(p){
 if(!p.sex||!p.age||!p.weight||!p.height||!p.activity)return'Completa todos los campos obligatorios.';
 if(p.age<20||p.age>100)return'La calculadora está diseñada para adultos de 20 a 100 años.';
 if(p.weight<35||p.weight>350||p.height<130||p.height>230)return'Revisa que peso y estatura estén dentro de rangos válidos.';
 if(p.goal==='lose'&&p.targetWeight&&p.targetWeight>=p.weight)return'Para perder grasa, el peso objetivo debe ser menor al actual.';
 if(p.goal==='gain'&&p.targetWeight&&p.targetWeight<=p.weight)return'Para ganar masa, el peso objetivo debe ser mayor al actual.';
 if(p.sex==='female'&&p.waist&&p.neck&&!p.hip)return'Para estimar grasa corporal en mujeres también se necesita la medida de cadera.';
 return'';
}
$('#calcForm').addEventListener('submit',e=>{
 e.preventDefault();const p=gatherProfile(),err=validateProfile(p);setText('formMessage',err);if(err){toast(err);return}
 state.profile=p;state.plan=calculate(p);
 if(!state.measurements.length)state.measurements.push({id:crypto.randomUUID?.()||Date.now().toString(),date:today(),weight:p.weight,waist:p.waist,fat:state.plan.bodyFat,note:'Medición inicial'});
 saveState();renderAll();toast('Plan calculado y guardado');showView('plan');
});
$('#sex').addEventListener('change',()=>{$('#hipField').style.display=$('#sex').value==='female'?'block':'none'});
$$('#goalSegment button').forEach(b=>b.addEventListener('click',()=>{
 $$('#goalSegment button').forEach(x=>x.classList.toggle('selected',x===b));$('#goal').value=b.dataset.value;
 $('.goal-fields').style.opacity=b.dataset.value==='maintain'?.45:1;
}));

function hydrateForm(){
 const p=state.profile;if(!p)return;
 Object.entries(p).forEach(([k,v])=>{const el=$('#'+k);if(el&&v!==null&&v!==undefined)el.value=v});
 $$('#goalSegment button').forEach(b=>b.classList.toggle('selected',b.dataset.value===p.goal));
 $('#hipField').style.display=p.sex==='female'?'block':'none';
}

function renderAll(){
 renderHome();renderPlan();renderHistory();renderProgress();renderTraining();renderCharts();hydrateForm();
}
function renderHome(){
 const p=state.profile,r=state.plan;
 setText('helloTitle',p?.name?`Hola, ${p.name}.`:'Tu progreso, con claridad.');
 setText('heroText',r?goalSentence(p,r):'Completa tu perfil para obtener un plan estimado y personalizado.');
 if(!r){['mBmi','mTdee','mTarget','mProtein','dailyCal','dailyProtein','dailyWater','goalRingValue'].forEach(id=>setText(id,'—'));return}
 const cat=bmiCategory(r.bmi)[0];
 setText('mBmi',fmt(r.bmi,1));setText('mBmiLabel',cat);setText('mTdee',fmt(r.tdee));setText('mTarget',fmt(r.target));setText('mProtein',fmt(r.protein));
 setText('dailyCal',fmt(r.target)+' kcal');setText('dailyProtein',fmt(r.protein)+' g');setText('dailyWater',fmt(r.water/1000,1)+' L');
 setText('dailyCalText',p.goal==='maintain'?'Mantenimiento estimado':'Objetivo energético');setText('dailyProteinText',`${round(r.protein/p.weight,1)} g por kg`);
 setText('dailyWaterText','Incluye bebidas y parte de alimentos');setText('goalRingValue',p.goal==='lose'?'↓ grasa':p.goal==='gain'?'↑ masa':'estable');
 $('#dailyCalBar').style.width='100%';$('#dailyProteinBar').style.width='100%';$('#dailyWaterBar').style.width='100%';
}
function goalSentence(p,r){
 if(p.goal==='maintain')return`Tu mantenimiento estimado es ${fmt(r.tdee)} kcal al día.`;
 const action=p.goal==='lose'?'déficit':'superávit';return`Plan con ${action} de ${fmt(Math.abs(r.delta))} kcal/día y ${fmt(r.protein)} g de proteína.`;
}
function renderPlan(){
 const p=state.profile,r=state.plan;$('#planEmpty').hidden=!!r;$('#planContent').hidden=!r;if(!r)return;
 setText('planSubtitle',p.name?`Estimación personalizada para ${p.name}.`:'Estimación personalizada según tus datos.');
 setText('rTarget',fmt(r.target));setText('rDelta',p.goal==='maintain'?'Mantenimiento':`${r.delta>0?'+':''}${fmt(r.delta)} kcal frente al mantenimiento${r.safetyAdjusted?' · ajustado por seguridad':''}`);
 setText('rBmr',fmt(r.bmr));setText('rTdee',fmt(r.tdee));setText('rBmi',fmt(r.bmi,1));setText('rBmiLabel',bmiCategory(r.bmi)[0]);
 setText('rWhr',r.whtr?fmt(r.whtr,2):'—');setText('rWhrLabel',r.whtr?(r.whtr<.5?'Por debajo de 0.50':'0.50 o más; interprétalo con contexto'):'Requiere cintura');
 setText('rProtein',fmt(r.protein)+' g');setText('rProteinCal',fmt(r.protein*4)+' kcal');
 setText('rCarbs',fmt(r.carbs)+' g');setText('rCarbsCal',fmt(r.carbs*4)+' kcal');
 setText('rFats',fmt(r.fats)+' g');setText('rFatsCal',fmt(r.fats*9)+' kcal');setText('macroTotal',fmt(r.target));
 const pc=r.protein*4/r.target*100,cc=r.carbs*4/r.target*100;$('#macroChart').style.background=`conic-gradient(#26795b 0 ${pc}%,#6f9e8b ${pc}% ${pc+cc}%,#c8d9d1 ${pc+cc}% 100%)`;
 if(r.bodyFat!==null){setText('rBodyFat',fmt(r.bodyFat,1)+' %');setText('rBodyFatLabel',bodyFatCategory(r.bodyFat,p.sex,p.age));setText('rLeanMass',fmt(r.leanMass,1)+' kg')}else{setText('rBodyFat','—');setText('rBodyFatLabel','Requiere medidas completas');setText('rLeanMass','—')}
 setText('rWater',fmt(r.water/1000,1)+' L');setText('rHealthyRange',`${fmt(r.healthyMin,1)}–${fmt(r.healthyMax,1)} kg`);
 if(r.weeks){setText('rWeeks',`${r.weeks} semanas`);setText('rDate',new Date(r.goalDate+'T12:00:00').toLocaleDateString('es-PE',{month:'long',year:'numeric'}));setText('rProjectionText',`Proyección lineal aproximada desde ${fmt(p.weight,1)} kg hasta ${fmt(p.targetWeight,1)} kg. El progreso real no suele ser lineal y debe reevaluarse cada 2–4 semanas.`)}
 else{setText('rWeeks','Sin plazo');setText('rDate',p.goal==='maintain'?'Objetivo de mantenimiento':'Añade un peso objetivo');setText('rProjectionText','Registra mediciones periódicas y ajusta el plan según tu tendencia, rendimiento, hambre y recuperación.')}
}
function renderProgress(){
 $('#progressDate').value=$('#progressDate').value||today();if(state.profile&&!$('#progressWeight').value)$('#progressWeight').value=state.profile.weight||'';
 const a=[...state.measurements].sort((x,y)=>x.date.localeCompare(y.date));
 if(a.length<2){setText('trendTotal','—');setText('trendWeekly','—')}
 else {
 const first=a[0],last=a.at(-1),diff=last.weight-first.weight,days=Math.max(1,(new Date(last.date)-new Date(first.date))/86400000);
 setText('trendTotal',`${diff>0?'+':''}${fmt(diff,1)} kg`);setText('trendWeekly',`${diff/days*7>0?'+':''}${fmt(diff/days*7,2)} kg`);
 }
 const logs=state.proteinLogs||[],target=state.plan?.protein||null;
 setText('proteinTargetDisplay',target?fmt(target)+' g/día':'Calcula tu plan');
 if(logs.length){
   const avg=logs.reduce((a,x)=>a+x.grams,0)/logs.length;
   const adherence=target?logs.filter(x=>x.grams>=target*.9).length/logs.length*100:null;
   setText('proteinAverage',fmt(avg)+' g');setText('proteinAdherence',adherence!==null?fmt(adherence)+' %':'—');
 }else{setText('proteinAverage','—');setText('proteinAdherence','—')}
}
$('#progressForm').addEventListener('submit',e=>{
 e.preventDefault();const date=$('#progressDate').value,weight=num('progressWeight');if(!date||!weight){toast('Fecha y peso son obligatorios');return}
 const item={id:crypto.randomUUID?.()||Date.now().toString(),date,weight,waist:num('progressWaist'),fat:num('progressFat'),note:$('#progressNote').value.trim()};
 state.measurements.push(item);state.measurements.sort((a,b)=>a.date.localeCompare(b.date));saveState();e.target.reset();$('#progressDate').value=today();renderAll();toast('Medición guardada');
});


$('#proteinForm').addEventListener('submit',e=>{
 e.preventDefault();
 const date=$('#proteinDate').value,grams=num('proteinActual');
 if(!date||grams===null||grams<0){toast('Ingresa una fecha y una cantidad válida');return}
 const existing=(state.proteinLogs||[]).find(x=>x.date===date);
 const item={id:existing?.id||crypto.randomUUID?.()||Date.now().toString(),date,grams,note:$('#proteinNote').value.trim(),target:state.plan?.protein||null};
 state.proteinLogs=(state.proteinLogs||[]).filter(x=>x.date!==date);
 state.proteinLogs.push(item);state.proteinLogs.sort((a,b)=>a.date.localeCompare(b.date));
 saveState();e.target.reset();$('#proteinDate').value=today();renderAll();toast(existing?'Proteína actualizada':'Proteína guardada');
});

function addSet(values={weight:'',reps:'',rir:2}){
 const list=$('#setsList'),row=document.createElement('div');row.className='set-row';
 row.innerHTML=`<span class="set-number">${list.children.length+1}</span><input class="set-weight" type="number" inputmode="decimal" min="0" max="1000" step="0.5" placeholder="kg" value="${values.weight}"><input class="set-reps" type="number" inputmode="numeric" min="1" max="100" placeholder="reps" value="${values.reps}"><input class="set-rir" type="number" inputmode="numeric" min="0" max="10" value="${values.rir}"><button type="button" class="remove-set" aria-label="Eliminar serie">×</button>`;
 row.querySelector('.remove-set').addEventListener('click',()=>{row.remove();renumberSets()});
 list.appendChild(row);
}
function renumberSets(){$$('.set-number',$('#setsList')).forEach((x,i)=>x.textContent=i+1)}
function latestWorkout(exercise){
 return [...(state.workouts||[])].filter(w=>w.exercise===exercise).sort((a,b)=>(b.date+b.createdAt).localeCompare(a.date+a.createdAt))[0]||null;
}
function smartRecommendation(exercise,range){
 const last=latestWorkout(exercise),box=$('#smartSuggestion'),[low,high]=range.split('-').map(Number),step=EXERCISES[exercise]?.step||2.5;
 if(!last){box.innerHTML='<span>RECOMENDACIÓN INTELIGENTE</span><strong>Registra tu primera sesión</strong><p>Usa una carga que te permita terminar el rango con 2–3 repeticiones en reserva.</p>';return}
 const stats=sessionStats(last),sets=last.sets.filter(s=>s.reps>0),allTop=sets.length&&sets.every(s=>s.reps>=high),avgReps=sets.reduce((a,s)=>a+s.reps,0)/Math.max(1,sets.length);
 let title,detail;
 if(allTop&&stats.avgRir>=1.5){title=`Prueba ${fmt(stats.topWeight+step,1)} kg`;detail=`Completaste el rango alto con RIR ${fmt(stats.avgRir,1)}. Sube ${fmt(step,1)} kg y vuelve al extremo bajo del rango.`}
 else if(avgReps<low||stats.avgRir<.5){title=`Mantén o baja a ${fmt(Math.max(0,stats.topWeight-step),1)} kg`;detail='El rendimiento quedó por debajo del rango o muy cerca del fallo. Prioriza técnica y recuperación.'}
 else{title=`Mantén ${fmt(stats.topWeight,1)} kg`;detail=`Intenta sumar 1 repetición total antes de aumentar la carga. Último 1RM estimado: ${fmt(stats.e1rm,1)} kg.`}
 box.innerHTML=`<span>RECOMENDACIÓN INTELIGENTE</span><strong>${title}</strong><p>${detail}</p>`;
}
function populateTrainingSelect(){
 const chart=$('#trainingChartExercise'),current=chart.value;
 chart.innerHTML=Object.entries(EXERCISES).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('');
 chart.value=current&&EXERCISES[current]?current:$('#exerciseSelect').value;
}
function renderTraining(){
 state.workouts=state.workouts||[];
 const stats=state.workouts.map(sessionStats);
 setText('trainingSessions',state.workouts.length);
 setText('trainingVolume',fmt(stats.reduce((a,x)=>a+x.volume,0)));
 const prs=new Set();
 Object.keys(EXERCISES).forEach(ex=>{const vals=state.workouts.filter(w=>w.exercise===ex).map(sessionStats).map(x=>x.e1rm);if(vals.length&&Math.max(...vals)>0)prs.add(ex)});
 setText('trainingPrs',prs.size);
 populateTrainingSelect();
 smartRecommendation($('#exerciseSelect').value,$('#repRange').value);
 const list=$('#workoutHistory');list.innerHTML='';
 const items=[...state.workouts].sort((a,b)=>(b.date+b.createdAt).localeCompare(a.date+a.createdAt)).slice(0,12);
 $('#workoutEmpty').hidden=items.length>0;
 items.forEach(w=>{
   const s=sessionStats(w),el=document.createElement('article');el.className='workout-item card';
   el.innerHTML=`<div class="workout-item-header"><div><h3>${EXERCISES[w.exercise]?.name||w.exercise}</h3><small>${escapeHtml(w.note||'Sin nota')}</small></div><time>${new Date(w.date+'T12:00:00').toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric'})}</time></div><div class="workout-stats"><div><strong>${fmt(s.e1rm,1)} kg</strong><small>1RM estimado</small></div><div><strong>${fmt(s.volume)} kg</strong><small>Volumen</small></div><div><strong>${fmt(s.avgRir,1)}</strong><small>RIR medio</small></div></div><div class="workout-sets">${w.sets.map((x,i)=>`S${i+1}: ${fmt(x.weight,1)} kg × ${x.reps} · RIR ${x.rir}`).join(' &nbsp;|&nbsp; ')}</div><button class="workout-delete" data-workout-delete="${w.id}">Eliminar sesión</button>`;
   list.appendChild(el);
 });
 $$('[data-workout-delete]',list).forEach(b=>b.addEventListener('click',()=>{state.workouts=state.workouts.filter(x=>x.id!==b.dataset.workoutDelete);saveState();renderAll();toast('Sesión eliminada')}));
}
$('#addSetBtn').addEventListener('click',()=>addSet());
$('#exerciseSelect').addEventListener('change',()=>{smartRecommendation($('#exerciseSelect').value,$('#repRange').value);$('#trainingChartExercise').value=$('#exerciseSelect').value;renderCharts()});
$('#repRange').addEventListener('change',()=>smartRecommendation($('#exerciseSelect').value,$('#repRange').value));
$('#trainingChartExercise').addEventListener('change',renderCharts);
$$('#trainingMetricTabs button').forEach(b=>b.addEventListener('click',()=>{$$('#trainingMetricTabs button').forEach(x=>x.classList.toggle('selected',x===b));trainingMetric=b.dataset.metric;renderCharts()}));
$('#saveWorkoutBtn').addEventListener('click',()=>{
 const exercise=$('#exerciseSelect').value,date=$('#workoutDate').value;
 const sets=$$('.set-row',$('#setsList')).map(row=>({weight:parseFloat($('.set-weight',row).value)||0,reps:parseInt($('.set-reps',row).value)||0,rir:Math.max(0,Math.min(10,parseFloat($('.set-rir',row).value)||0))})).filter(s=>s.reps>0);
 if(!date||!exercise||!sets.length){toast('Completa la fecha y al menos una serie');return}
 state.workouts.push({id:crypto.randomUUID?.()||Date.now().toString(),date,exercise,repRange:$('#repRange').value,sets,note:$('#workoutNote').value.trim(),createdAt:new Date().toISOString()});
 saveState();$('#setsList').innerHTML='';sets.slice(0,Math.min(3,sets.length)).forEach(s=>addSet({weight:s.weight,reps:'',rir:2}));$('#workoutNote').value='';renderAll();toast('Entrenamiento guardado');
});

function renderHistory(){
 const list=$('#historyList'),items=[...state.measurements].sort((a,b)=>b.date.localeCompare(a.date));list.innerHTML='';$('#historyEmpty').hidden=items.length>0;
 items.forEach(x=>{const el=document.createElement('article');el.className='history-item card';el.innerHTML=`<div><h3>${new Date(x.date+'T12:00:00').toLocaleDateString('es-PE',{day:'2-digit',month:'long',year:'numeric'})}</h3><p>${[x.waist?`Cintura ${fmt(x.waist,1)} cm`:'',x.fat?`Grasa ${fmt(x.fat,1)}%`:'',escapeHtml(x.note||'')].filter(Boolean).join(' · ')||'Sin datos adicionales'}</p></div><strong>${fmt(x.weight,1)} kg</strong><button data-delete="${x.id}">Eliminar</button>`;list.appendChild(el)});
 $$('[data-delete]',list).forEach(b=>b.addEventListener('click',()=>{state.measurements=state.measurements.filter(x=>x.id!==b.dataset.delete);saveState();renderAll();toast('Registro eliminado')}));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function drawSeriesChart(canvas,emptyId,items,valueGetter,options={}){
 const clean=[...items].sort((a,b)=>a.date.localeCompare(b.date)).filter(x=>Number.isFinite(valueGetter(x)));
 const empty=$('#'+emptyId);empty.style.display=clean.length<2?'grid':'none';if(clean.length<2)return;
 const ctx=canvas.getContext('2d'),rect=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1;canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.scale(dpr,dpr);
 const w=rect.width,h=rect.height,p={l:38,r:12,t:18,b:30};ctx.clearRect(0,0,w,h);
 const vals=clean.map(valueGetter),target=options.target||null,minBase=Math.min(...vals,target??Infinity),maxBase=Math.max(...vals,target??-Infinity),padding=Math.max(1,(maxBase-minBase)*.15);
 const min=Math.max(0,minBase-padding),max=maxBase+padding,range=max-min||1;
 const css=getComputedStyle(document.documentElement),line=css.getPropertyValue('--line').trim(),muted=css.getPropertyValue('--muted').trim(),accent=css.getPropertyValue('--accent').trim(),surface=css.getPropertyValue('--surface').trim();
 ctx.font='10px system-ui';ctx.textAlign='right';ctx.fillStyle=muted;ctx.strokeStyle=line;ctx.lineWidth=1;
 for(let i=0;i<4;i++){const y=p.t+(h-p.t-p.b)*i/3,val=max-range*i/3;ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();ctx.fillText(fmt(val,options.decimals||0),p.l-7,y+3)}
 if(target){const y=p.t+(max-target)/range*(h-p.t-p.b);ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.strokeStyle=muted;ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=muted;ctx.textAlign='left';ctx.fillText('Meta',p.l+4,y-5)}
 const pts=clean.map((x,i)=>({x:p.l+(w-p.l-p.r)*(clean.length===1?.5:i/(clean.length-1)),y:p.t+(max-valueGetter(x))/range*(h-p.t-p.b)}));
 ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.lineTo(pts.at(-1).x,h-p.b);ctx.lineTo(pts[0].x,h-p.b);ctx.closePath();const grad=ctx.createLinearGradient(0,p.t,0,h-p.b);grad.addColorStop(0,accent+'44');grad.addColorStop(1,accent+'00');ctx.fillStyle=grad;ctx.fill();
 ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.lineJoin='round';ctx.stroke();
 pts.forEach(q=>{ctx.beginPath();ctx.arc(q.x,q.y,4,0,Math.PI*2);ctx.fillStyle=surface;ctx.fill();ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.stroke()});
 ctx.fillStyle=muted;ctx.textAlign='center';const labels=[0,Math.floor((clean.length-1)/2),clean.length-1].filter((v,i,a)=>a.indexOf(v)===i);labels.forEach(i=>ctx.fillText(new Date(clean[i].date+'T12:00:00').toLocaleDateString('es-PE',{day:'2-digit',month:'short'}),pts[i].x,h-8));
}
function renderCharts(){
 drawSeriesChart($('#weightChart'),'emptyChart',state.measurements,x=>x.weight,{decimals:1});
 drawSeriesChart($('#progressChart'),'emptyProgressChart',state.measurements,x=>x.weight,{decimals:1});
 drawSeriesChart($('#proteinChart'),'emptyProteinChart',state.proteinLogs||[],x=>x.grams,{target:state.plan?.protein||null});
 drawSeriesChart($('#progressProteinChart'),'emptyProgressProteinChart',state.proteinLogs||[],x=>x.grams,{target:state.plan?.protein||null});
 const exercise=$('#trainingChartExercise')?.value||$('#exerciseSelect')?.value;
 const sessions=(state.workouts||[]).filter(w=>w.exercise===exercise);
 drawSeriesChart($('#trainingChart'),'emptyTrainingChart',sessions,w=>sessionStats(w)[trainingMetric],{decimals:trainingMetric==='volume'?0:1});
}
addEventListener('resize',()=>{clearTimeout(window._resize);window._resize=setTimeout(renderCharts,150)});

function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$('#exportJsonBtn').addEventListener('click',()=>download(`fit-respaldo-${today()}.json`,JSON.stringify(state,null,2),'application/json'));
$('#exportCsvBtn').addEventListener('click',()=>{
 const rows=[['Fecha','Peso_kg','Cintura_cm','Grasa_pct','Nota'],...state.measurements.map(x=>[x.date,x.weight,x.waist??'',x.fat??'',x.note??''])];
 const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(';')).join('\n');download(`fit-progreso-${today()}.csv`,csv,'text/csv;charset=utf-8');
});
$('#importJson').addEventListener('change',async e=>{try{const x=JSON.parse(await e.target.files[0].text());if(!x||!Array.isArray(x.measurements))throw Error();state={...defaultState,...x};saveState();applyTheme();renderAll();toast('Respaldo restaurado')}catch{toast('El archivo no es un respaldo válido')}e.target.value=''});
$('#sharePlanBtn').addEventListener('click',async()=>{
 if(!state.plan)return;const p=state.profile,r=state.plan,text=`Fit Calculator Pro\nObjetivo: ${fmt(r.target)} kcal/día\nProteína: ${fmt(r.protein)} g · Carbohidratos: ${fmt(r.carbs)} g · Grasas: ${fmt(r.fats)} g\nMantenimiento estimado: ${fmt(r.tdee)} kcal/día`;
 try{if(navigator.share)await navigator.share({title:'Mi plan Fit',text});else{await navigator.clipboard.writeText(text);toast('Resumen copiado')}}catch{}
});

$('#themeBtn').addEventListener('click',cycleTheme);$('#settingsTheme').addEventListener('click',cycleTheme);
$('#resetBtn').addEventListener('click',()=>$('#confirmModal').hidden=false);$('#cancelReset').addEventListener('click',()=>$('#confirmModal').hidden=true);
$('#confirmReset').addEventListener('click',()=>{localStorage.removeItem(KEY);state={...defaultState,measurements:[]};$('#confirmModal').hidden=true;location.reload()});
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').hidden=false});
$('#installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').hidden=true});

if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.theme==='auto')applyTheme()});
$('#proteinDate').value=today();$('#workoutDate').value=today();
if(!$('#setsList').children.length){addSet();addSet();addSet()}
applyTheme();hydrateForm();renderAll();renderProgress();
})();
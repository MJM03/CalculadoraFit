(() => {
'use strict';

const KEY='fitCalculatorPro.v1';
const defaultState={profile:null,plan:null,measurements:[],proteinLogs:[],workouts:[],splits:[],activeSplitId:null,activeSession:null,theme:'auto'};
let state=loadState();
let deferredPrompt=null;

const $=(s,r=document)=>r.querySelector(s);
const on=(selector,event,handler)=>{const el=typeof selector==='string'?$(selector):selector;if(el)el.addEventListener(event,handler);return el};
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const num=(id)=>{const v=parseFloat($('#'+id).value);return Number.isFinite(v)?v:null};
const round=(v,d=0)=>Number(v.toFixed(d));
const fmt=(v,d=0)=>Number(v).toLocaleString('es-PE',{minimumFractionDigits:d,maximumFractionDigits:d});
const today=()=>new Date().toISOString().slice(0,10);

const EXERCISES={"press_banca":{"name":"Press de banca","muscle":"Pecho","secondary":"Tríceps, hombro anterior","equipment":"Barra","pattern":"press","step":2.5,"instructions":"Apoya pies y espalda, baja la barra con control hacia la parte media del pecho y empuja sin perder tensión.","tip":"Mantén los omóplatos retraídos y evita abrir demasiado los codos."},"press_inclinado":{"name":"Press inclinado con barra","muscle":"Pecho","secondary":"Hombro anterior, tríceps","equipment":"Barra","pattern":"press","step":2.5,"instructions":"Ajusta el banco a 20–35°, baja la barra hacia la parte superior del pecho y empuja de forma estable.","tip":"Una inclinación excesiva desplaza trabajo hacia los hombros."},"press_mancuernas":{"name":"Press de pecho con mancuernas","muscle":"Pecho","secondary":"Tríceps, hombro anterior","equipment":"Mancuernas","pattern":"press","step":2,"instructions":"Baja las mancuernas junto al pecho manteniendo muñecas neutras y vuelve a extender.","tip":"No choques las mancuernas arriba; conserva tensión."},"aperturas_mancuernas":{"name":"Aperturas con mancuernas","muscle":"Pecho","secondary":"Hombro anterior","equipment":"Mancuernas","pattern":"press","step":1,"instructions":"Con codos levemente flexionados, abre los brazos hasta sentir estiramiento y vuelve cerrando en arco.","tip":"Usa menos peso que en un press y evita bajar en exceso."},"fondos":{"name":"Fondos en paralelas","muscle":"Pecho","secondary":"Tríceps, hombros","equipment":"Peso corporal","pattern":"pushup","step":2.5,"instructions":"Desciende flexionando codos y empuja hasta extenderlos sin perder control del tronco.","tip":"Inclínate ligeramente para más pecho; vertical para más tríceps."},"flexiones":{"name":"Flexiones","muscle":"Pecho","secondary":"Tríceps, core","equipment":"Peso corporal","pattern":"pushup","step":1,"instructions":"Mantén el cuerpo alineado, baja el pecho entre las manos y empuja el suelo.","tip":"Evita que la cadera caiga o se eleve."},"cruce_poleas":{"name":"Cruce de poleas","muscle":"Pecho","secondary":"Hombro anterior","equipment":"Polea","pattern":"machine","step":1,"instructions":"Con ligera inclinación, lleva las manos al frente describiendo un arco y controla la vuelta.","tip":"Piensa en acercar los bíceps, no solo las manos."},"dominadas":{"name":"Dominadas","muscle":"Espalda","secondary":"Bíceps, core","equipment":"Peso corporal","pattern":"pull","step":2.5,"instructions":"Desde suspensión activa, lleva el pecho hacia la barra y baja con control.","tip":"Inicia con depresión escapular antes de flexionar los codos."},"jalon_pecho":{"name":"Jalón al pecho","muscle":"Espalda","secondary":"Bíceps","equipment":"Polea","pattern":"pull","step":5,"instructions":"Tira de la barra hacia la parte alta del pecho manteniendo el torso estable.","tip":"Evita convertirlo en un remo inclinándote demasiado."},"remo_barra":{"name":"Remo con barra","muscle":"Espalda","secondary":"Bíceps, lumbar","equipment":"Barra","pattern":"row","step":2.5,"instructions":"Inclina el torso, lleva la barra hacia el abdomen y baja sin perder la posición.","tip":"Mantén la espalda neutra y no uses impulso excesivo."},"remo_mancuerna":{"name":"Remo con mancuerna","muscle":"Espalda","secondary":"Bíceps","equipment":"Mancuernas","pattern":"row","step":2,"instructions":"Apoya una mano, lleva el codo hacia la cadera y controla el descenso.","tip":"Evita rotar el tronco para levantar más peso."},"remo_cable":{"name":"Remo sentado en polea","muscle":"Espalda","secondary":"Bíceps","equipment":"Polea","pattern":"row","step":5,"instructions":"Tira del agarre hacia el abdomen, junta escápulas y vuelve extendiendo los brazos.","tip":"No balancees el torso hacia atrás."},"pullover_polea":{"name":"Pullover en polea","muscle":"Espalda","secondary":"Tríceps largo","equipment":"Polea","pattern":"pull","step":2.5,"instructions":"Con brazos casi rectos, lleva la barra desde arriba hasta los muslos.","tip":"Mantén costillas controladas para aislar dorsales."},"face_pull":{"name":"Face pull","muscle":"Hombros","secondary":"Espalda alta","equipment":"Polea","pattern":"row","step":1,"instructions":"Tira de la cuerda hacia la cara separando las manos y rotando externamente.","tip":"Prioriza control y rango, no carga."},"sentadilla":{"name":"Sentadilla trasera","muscle":"Cuádriceps","secondary":"Glúteos, core","equipment":"Barra","pattern":"squat","step":5,"instructions":"Desciende flexionando cadera y rodillas, mantén el pie completo apoyado y sube empujando el suelo.","tip":"Las rodillas pueden avanzar si permanecen alineadas con los pies."},"sentadilla_frontal":{"name":"Sentadilla frontal","muscle":"Cuádriceps","secondary":"Core, glúteos","equipment":"Barra","pattern":"squat","step":2.5,"instructions":"Sostén la barra al frente, baja con torso erguido y sube manteniendo codos altos.","tip":"Trabaja movilidad de tobillo y muñeca progresivamente."},"goblet_squat":{"name":"Sentadilla goblet","muscle":"Cuádriceps","secondary":"Glúteos, core","equipment":"Mancuernas","pattern":"squat","step":2,"instructions":"Sostén una mancuerna frente al pecho, baja entre las piernas y vuelve a extender.","tip":"Úsala para aprender profundidad y control."},"prensa":{"name":"Prensa de piernas","muscle":"Cuádriceps","secondary":"Glúteos","equipment":"Máquina","pattern":"machine","step":5,"instructions":"Baja la plataforma hasta un rango cómodo y empuja sin bloquear agresivamente las rodillas.","tip":"Evita despegar la zona lumbar del respaldo."},"zancadas":{"name":"Zancadas caminando","muscle":"Cuádriceps","secondary":"Glúteos","equipment":"Mancuernas","pattern":"lunge","step":2,"instructions":"Da un paso amplio, baja ambas rodillas y avanza manteniendo control.","tip":"Mantén la rodilla delantera alineada con el pie."},"bulgaras":{"name":"Sentadilla búlgara","muscle":"Cuádriceps","secondary":"Glúteos","equipment":"Mancuernas","pattern":"lunge","step":2,"instructions":"Apoya el pie trasero elevado y baja sobre la pierna delantera.","tip":"Ajusta la distancia para no perder equilibrio."},"extension_cuadriceps":{"name":"Extensión de cuádriceps","muscle":"Cuádriceps","secondary":"","equipment":"Máquina","pattern":"machine","step":2.5,"instructions":"Extiende las rodillas hasta contraer cuádriceps y baja controlando.","tip":"Alinea el eje de la máquina con la rodilla."},"peso_muerto":{"name":"Peso muerto convencional","muscle":"Isquiotibiales","secondary":"Glúteos, espalda","equipment":"Barra","pattern":"hinge","step":5,"instructions":"Empuja el suelo manteniendo la barra cerca del cuerpo y termina extendiendo cadera.","tip":"No conviertas el cierre en una hiperextensión lumbar."},"peso_muerto_rumano":{"name":"Peso muerto rumano","muscle":"Isquiotibiales","secondary":"Glúteos","equipment":"Barra","pattern":"hinge","step":2.5,"instructions":"Lleva la cadera atrás con rodillas suaves, baja la barra cerca de las piernas y vuelve apretando glúteos.","tip":"Detente cuando pierdas neutralidad o tensión posterior."},"curl_femoral":{"name":"Curl femoral tumbado","muscle":"Isquiotibiales","secondary":"","equipment":"Máquina","pattern":"machine","step":2.5,"instructions":"Flexiona las rodillas llevando los talones hacia los glúteos y vuelve lentamente.","tip":"Mantén la cadera pegada al banco."},"hip_thrust":{"name":"Hip thrust","muscle":"Glúteos","secondary":"Isquiotibiales","equipment":"Barra","pattern":"hinge","step":5,"instructions":"Extiende la cadera hasta alinear rodillas, cadera y hombros; baja con control.","tip":"Mira al frente y evita hiperextender la espalda."},"puente_gluteo":{"name":"Puente de glúteos","muscle":"Glúteos","secondary":"Isquiotibiales","equipment":"Peso corporal","pattern":"hinge","step":2.5,"instructions":"Desde el suelo, empuja con los pies y eleva la cadera apretando glúteos.","tip":"Mantén costillas abajo durante el cierre."},"abduccion_maquina":{"name":"Abducción en máquina","muscle":"Glúteos","secondary":"","equipment":"Máquina","pattern":"machine","step":2.5,"instructions":"Abre las piernas contra la resistencia y vuelve lentamente.","tip":"Evita rebotes y controla el final del recorrido."},"press_militar":{"name":"Press militar","muscle":"Hombros","secondary":"Tríceps","equipment":"Barra","pattern":"overhead","step":2.5,"instructions":"Empuja la barra sobre la cabeza manteniendo glúteos y abdomen activos.","tip":"La barra debe viajar cerca del rostro."},"press_hombro_mancuernas":{"name":"Press de hombro con mancuernas","muscle":"Hombros","secondary":"Tríceps","equipment":"Mancuernas","pattern":"overhead","step":2,"instructions":"Desde hombros, empuja las mancuernas arriba y baja con control.","tip":"No arquees la zona lumbar."},"elevaciones_laterales":{"name":"Elevaciones laterales","muscle":"Hombros","secondary":"","equipment":"Mancuernas","pattern":"lateral","step":1,"instructions":"Eleva los brazos hacia los lados hasta aproximadamente la altura del hombro.","tip":"Usa carga moderada y dirige con los codos."},"pajaros":{"name":"Pájaros / reverse fly","muscle":"Hombros","secondary":"Espalda alta","equipment":"Mancuernas","pattern":"lateral","step":1,"instructions":"Inclina el torso y abre los brazos hacia los lados manteniendo codos suaves.","tip":"Evita encoger los hombros."},"curl_biceps":{"name":"Curl de bíceps con barra","muscle":"Bíceps","secondary":"Antebrazo","equipment":"Barra","pattern":"curl","step":1,"instructions":"Flexiona los codos sin moverlos hacia delante y baja completamente.","tip":"Mantén el torso quieto."},"curl_mancuernas":{"name":"Curl alterno con mancuernas","muscle":"Bíceps","secondary":"Antebrazo","equipment":"Mancuernas","pattern":"curl","step":1,"instructions":"Flexiona un brazo a la vez girando la palma hacia arriba.","tip":"Evita balancear el cuerpo."},"curl_martillo":{"name":"Curl martillo","muscle":"Bíceps","secondary":"Braquial, antebrazo","equipment":"Mancuernas","pattern":"curl","step":1,"instructions":"Flexiona con agarre neutro manteniendo los codos pegados.","tip":"Controla especialmente la bajada."},"extension_triceps":{"name":"Extensión de tríceps en polea","muscle":"Tríceps","secondary":"","equipment":"Polea","pattern":"machine","step":1,"instructions":"Extiende los codos llevando la cuerda hacia abajo sin mover los brazos.","tip":"Separa ligeramente la cuerda al final."},"press_frances":{"name":"Press francés","muscle":"Tríceps","secondary":"","equipment":"Barra","pattern":"press","step":1,"instructions":"Flexiona los codos llevando la barra hacia la frente y vuelve a extender.","tip":"Mantén los codos apuntando hacia arriba."},"fondos_banco":{"name":"Fondos en banco","muscle":"Tríceps","secondary":"Hombros","equipment":"Peso corporal","pattern":"pushup","step":1,"instructions":"Baja el cuerpo cerca del banco y empuja extendiendo los codos.","tip":"No fuerces profundidad si molesta el hombro."},"gemelos_pie":{"name":"Elevación de gemelos de pie","muscle":"Pantorrillas","secondary":"","equipment":"Máquina","pattern":"machine","step":2.5,"instructions":"Sube sobre la punta de los pies y baja hasta sentir estiramiento.","tip":"Haz una pausa arriba y evita rebotes."},"gemelos_sentado":{"name":"Elevación de gemelos sentado","muscle":"Pantorrillas","secondary":"","equipment":"Máquina","pattern":"machine","step":2.5,"instructions":"Eleva los talones contra la carga y baja lentamente.","tip":"Busca rango completo."},"plancha":{"name":"Plancha frontal","muscle":"Core","secondary":"Hombros","equipment":"Peso corporal","pattern":"plank","step":1,"instructions":"Mantén cuerpo alineado apoyado en antebrazos y pies.","tip":"Aprieta glúteos y abdomen; no aguantes la respiración."},"crunch":{"name":"Crunch abdominal","muscle":"Core","secondary":"","equipment":"Peso corporal","pattern":"plank","step":1,"instructions":"Acerca costillas a pelvis elevando ligeramente el torso.","tip":"No tires del cuello."},"elevacion_piernas":{"name":"Elevación de piernas","muscle":"Core","secondary":"Flexores de cadera","equipment":"Peso corporal","pattern":"plank","step":1,"instructions":"Eleva las piernas manteniendo la zona lumbar controlada.","tip":"Reduce el rango si la espalda se arquea."},"pallof_press":{"name":"Pallof press","muscle":"Core","secondary":"Oblicuos","equipment":"Polea","pattern":"machine","step":1,"instructions":"Empuja el agarre al frente resistiendo la rotación del tronco.","tip":"Mantén pelvis y costillas alineadas."}};
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
window.addEventListener('error',e=>{console.error(e.error||e.message);const t=$('#toast');if(t){t.textContent='Ocurrió un error en la interfaz. Recarga la aplicación.';t.classList.add('show')}});
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


const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const DAY_KEYS=['mon','tue','wed','thu','fri','sat','sun'];
const TEMPLATE_SPLITS={
 fullbody3:{name:'Full Body 3 días',days:[
  {day:'mon',name:'Full Body A',exercises:['sentadilla','press_banca','remo_barra','peso_muerto_rumano','elevaciones_laterales','plancha']},
  {day:'wed',name:'Full Body B',exercises:['peso_muerto','press_militar','jalon_pecho','bulgaras','curl_biceps','extension_triceps']},
  {day:'fri',name:'Full Body C',exercises:['prensa','press_inclinado','remo_cable','hip_thrust','face_pull','crunch']}
 ]},
 upperlower4:{name:'Upper / Lower 4 días',days:[
  {day:'mon',name:'Upper A',exercises:['press_banca','remo_barra','press_militar','jalon_pecho','curl_biceps','extension_triceps']},
  {day:'tue',name:'Lower A',exercises:['sentadilla','peso_muerto_rumano','prensa','curl_femoral','gemelos_pie','plancha']},
  {day:'thu',name:'Upper B',exercises:['press_inclinado','dominadas','press_hombro_mancuernas','remo_cable','curl_martillo','press_frances']},
  {day:'fri',name:'Lower B',exercises:['peso_muerto','bulgaras','hip_thrust','extension_cuadriceps','gemelos_sentado','pallof_press']}
 ]},
 ppl6:{name:'Push Pull Legs 6 días',days:[
  {day:'mon',name:'Push A',exercises:['press_banca','press_inclinado','press_militar','elevaciones_laterales','extension_triceps']},
  {day:'tue',name:'Pull A',exercises:['dominadas','remo_barra','jalon_pecho','face_pull','curl_biceps']},
  {day:'wed',name:'Legs A',exercises:['sentadilla','peso_muerto_rumano','prensa','curl_femoral','gemelos_pie']},
  {day:'thu',name:'Push B',exercises:['press_mancuernas','fondos','press_hombro_mancuernas','elevaciones_laterales','press_frances']},
  {day:'fri',name:'Pull B',exercises:['remo_mancuerna','jalon_pecho','pullover_polea','pajaros','curl_martillo']},
  {day:'sat',name:'Legs B',exercises:['peso_muerto','bulgaras','hip_thrust','extension_cuadriceps','gemelos_sentado']}
 ]},
 bro5:{name:'Torso por grupos 5 días',days:[
  {day:'mon',name:'Pecho',exercises:['press_banca','press_inclinado','press_mancuernas','cruce_poleas','fondos']},
  {day:'tue',name:'Espalda',exercises:['dominadas','remo_barra','jalon_pecho','remo_cable','pullover_polea']},
  {day:'wed',name:'Piernas',exercises:['sentadilla','prensa','peso_muerto_rumano','curl_femoral','gemelos_pie']},
  {day:'thu',name:'Hombros',exercises:['press_militar','press_hombro_mancuernas','elevaciones_laterales','pajaros','face_pull']},
  {day:'fri',name:'Brazos',exercises:['curl_biceps','curl_mancuernas','curl_martillo','extension_triceps','press_frances']}
 ]}
};
let selectedExerciseId=null, editingSplitId=null, draftSplit=null, trainingTab='week', splitPickerDay=null, splitPickerSelection=[];

function demoFor(ex){return `demo-${EXERCISES[ex]?.pattern||'machine'}.gif`}
function todayKey(){return DAY_KEYS[(new Date().getDay()+6)%7]}
function activeSplit(){return (state.splits||[]).find(x=>x.id===state.activeSplitId)||null}
function latestWorkout(exercise){return [...(state.workouts||[])].filter(w=>w.exercise===exercise).sort((a,b)=>(b.date+b.createdAt).localeCompare(a.date+a.createdAt))[0]||null}
function recommendationFor(exercise,range='8-12'){
 const last=latestWorkout(exercise),[low,high]=range.split('-').map(Number),step=EXERCISES[exercise]?.step||2.5;
 if(!last)return{title:'Primera sesión',text:'Usa una carga que deje 2–3 repeticiones en reserva.'};
 const stats=sessionStats(last),sets=last.sets.filter(s=>s.reps>0),allTop=sets.length&&sets.every(s=>s.reps>=high),avg=sets.reduce((a,s)=>a+s.reps,0)/Math.max(1,sets.length);
 if(allTop&&stats.avgRir>=1.5)return{title:`Sube a ${fmt(stats.topWeight+step,1)} kg`,text:`Completaste el rango alto con RIR ${fmt(stats.avgRir,1)}.`};
 if(avg<low||stats.avgRir<.5)return{title:`Mantén o baja a ${fmt(Math.max(0,stats.topWeight-step),1)} kg`,text:'Prioriza técnica y recuperación.'};
 return{title:`Mantén ${fmt(stats.topWeight,1)} kg`,text:'Intenta sumar una repetición total antes de subir carga.'};
}
function setTrainingTab(tab){
 trainingTab=tab;
 $$('#trainingMainTabs button').forEach(b=>b.classList.toggle('selected',b.dataset.trainingTab===tab));
 $$('.training-panel').forEach(p=>p.classList.toggle('active',p.id===`training-panel-${tab}`));
 if(tab==='stats')requestAnimationFrame(renderCharts);
}
$$('#trainingMainTabs button').forEach(b=>b.addEventListener('click',()=>setTrainingTab(b.dataset.trainingTab)));

function populateFilters(){
 const muscles=[...new Set(Object.values(EXERCISES).map(x=>x.muscle))].sort();
 const equipment=[...new Set(Object.values(EXERCISES).map(x=>x.equipment))].sort();
 $('#exerciseMuscleFilter').innerHTML='<option value="">Todos los músculos</option>'+muscles.map(x=>`<option>${x}</option>`).join('');
 $('#exerciseEquipmentFilter').innerHTML='<option value="">Todo el equipo</option>'+equipment.map(x=>`<option>${x}</option>`).join('');
}
function renderExerciseLibrary(){
 const q=$('#exerciseSearch').value.toLowerCase().trim(),m=$('#exerciseMuscleFilter').value,e=$('#exerciseEquipmentFilter').value;
 const entries=Object.entries(EXERCISES).filter(([id,x])=>(!q||`${x.name} ${x.muscle} ${x.secondary} ${x.equipment}`.toLowerCase().includes(q))&&(!m||x.muscle===m)&&(!e||x.equipment===e));
 setText('exerciseCount',`${entries.length} ejercicios`);
 $('#exerciseLibrary').innerHTML=entries.map(([id,x])=>`<article class="exercise-card card" data-exercise="${id}"><img src="${demoFor(id)}" alt="${x.name}"><div class="exercise-card-body"><h3>${x.name}</h3><p>${x.muscle}${x.secondary?` · ${x.secondary}`:''}</p><div class="exercise-tags"><span>${x.equipment}</span><span>+ sesión</span></div></div></article>`).join('');
 $$('[data-exercise]',$('#exerciseLibrary')).forEach(c=>c.addEventListener('click',()=>openExerciseModal(c.dataset.exercise)));
}
['exerciseSearch','exerciseMuscleFilter','exerciseEquipmentFilter'].forEach(id=>$('#'+id).addEventListener(id==='exerciseSearch'?'input':'change',renderExerciseLibrary));

function openExerciseModal(id){
 selectedExerciseId=id;const x=EXERCISES[id];
 $('#exerciseDemo').src=demoFor(id);setText('exerciseModalMuscle',x.muscle.toUpperCase());setText('exerciseModalName',x.name);
 setText('exerciseModalMeta',`${x.equipment}${x.secondary?` · También trabaja ${x.secondary}`:''}`);
 setText('exerciseModalInstructions',x.instructions);setText('exerciseModalTip',x.tip);$('#exerciseModal').hidden=false;
}
function closeExerciseModal(){$('#exerciseModal').hidden=true}
$$('[data-close-sheet]').forEach(x=>x.addEventListener('click',closeExerciseModal));
$('#modalAddExerciseBtn').addEventListener('click',()=>{addExerciseToSession(selectedExerciseId);closeExerciseModal();setTrainingTab('session')});

function ensureSession(name='Entrenamiento libre'){
 if(!state.activeSession)state.activeSession={id:crypto.randomUUID?.()||Date.now().toString(),name,date:today(),exercises:[],startedAt:new Date().toISOString()};
}
function addExerciseToSession(id){
 ensureSession();if(!id)return;
 state.activeSession.exercises.push({exercise:id,repRange:'8-12',sets:[{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2}]});
 saveState();renderSession();toast(`${EXERCISES[id].name} añadido`);
}
function startRoutine(day){
 const split=activeSplit(),routine=split?.days.find(x=>x.day===day);if(!routine){ensureSession();setTrainingTab('session');renderSession();return}
 state.activeSession={id:crypto.randomUUID?.()||Date.now().toString(),name:routine.name,date:today(),splitId:split.id,day,startedAt:new Date().toISOString(),exercises:routine.exercises.map(id=>({exercise:id,repRange:'8-12',sets:[{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2}]}))};
 saveState();setTrainingTab('session');renderSession();
}
function renderSession(){
 const s=state.activeSession;setText('sessionRoutineName',s?.name||'Entrenamiento libre');setText('sessionProgressText',s?`${s.exercises.length} ejercicios · ${new Date(s.date+'T12:00:00').toLocaleDateString('es-PE',{day:'2-digit',month:'long'})}`:'Añade ejercicios para empezar.');
 const list=$('#sessionExerciseList');list.innerHTML='';
 if(!s)return;
 s.exercises.forEach((item,idx)=>{
  const x=EXERCISES[item.exercise],rec=recommendationFor(item.exercise,item.repRange),el=document.createElement('article');el.className='session-exercise card';
  el.innerHTML=`<div class="session-exercise-head"><img src="${demoFor(item.exercise)}" alt="${x.name}"><div><h3>${idx+1}. ${x.name}</h3><p>${x.muscle} · ${item.repRange} reps</p></div><button class="remove-exercise" data-remove-ex="${idx}">×</button></div><div class="exercise-recommendation"><strong>${rec.title}</strong>${rec.text}</div><div class="session-sets"><div class="session-set-head"><span>#</span><span>kg</span><span>reps</span><span>RIR</span><span></span></div>${item.sets.map((set,si)=>`<div class="session-set-row" data-set-row="${si}"><span class="set-number">${si+1}</span><input data-field="weight" type="number" inputmode="decimal" min="0" step="0.5" value="${set.weight}"><input data-field="reps" type="number" inputmode="numeric" min="0" value="${set.reps}"><input data-field="rir" type="number" inputmode="numeric" min="0" max="10" value="${set.rir}"><button data-check-set="${si}">✓</button></div>`).join('')}<button class="text-btn" data-add-set-session="${idx}">+ Serie</button></div>`;
  list.appendChild(el);
  $$('input',el).forEach(inp=>inp.addEventListener('input',()=>{const row=inp.closest('[data-set-row]'),si=+row.dataset.setRow;item.sets[si][inp.dataset.field]=inp.value;saveState()}));
 });
 $$('[data-remove-ex]',list).forEach(b=>b.addEventListener('click',()=>{s.exercises.splice(+b.dataset.removeEx,1);saveState();renderSession()}));
 $$('[data-add-set-session]',list).forEach(b=>b.addEventListener('click',()=>{s.exercises[+b.dataset.addSetSession].sets.push({weight:'',reps:'',rir:2});saveState();renderSession()}));
 $$('[data-check-set]',list).forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('done');b.textContent=b.classList.contains('done')?'✓':'○'}));
}
$('#addExerciseToSessionBtn').addEventListener('click',()=>setTrainingTab('library'));
$('#finishSessionBtn').addEventListener('click',()=>{
 const s=state.activeSession;if(!s||!s.exercises.length){toast('No hay ejercicios en la sesión');return}
 let saved=0;
 s.exercises.forEach(item=>{
  const sets=item.sets.map(x=>({weight:parseFloat(x.weight)||0,reps:parseInt(x.reps)||0,rir:Math.max(0,Math.min(10,parseFloat(x.rir)||0))})).filter(x=>x.reps>0);
  if(sets.length){state.workouts.push({id:crypto.randomUUID?.()||Date.now()+String(saved),date:s.date,exercise:item.exercise,repRange:item.repRange,sets,note:s.name,createdAt:new Date().toISOString()});saved++}
 });
 if(!saved){toast('Registra al menos una serie válida');return}
 state.activeSession=null;saveState();renderAll();setTrainingTab('stats');toast(`Sesión guardada · ${saved} ejercicios`);
});

function openSplitModal(split=null){
 editingSplitId=split?.id||null;draftSplit=split?JSON.parse(JSON.stringify(split)):{id:null,name:'Mi split',days:[]};
 setText('splitModalTitle',split?'Editar split':'Crear split');$('#splitName').value=draftSplit.name;renderSplitEditor();$('#splitModal').hidden=false;
}
function closeSplitModal(){$('#splitModal').hidden=true}
$$('[data-close-split]').forEach(x=>x.addEventListener('click',closeSplitModal));
function applyTemplate(key){const t=TEMPLATE_SPLITS[key];draftSplit={id:editingSplitId,name:t.name,days:JSON.parse(JSON.stringify(t.days))};$('#splitName').value=t.name;renderSplitEditor()}
$$('#splitTemplates button').forEach(b=>b.addEventListener('click',()=>applyTemplate(b.dataset.template)));

function populateSplitPickerFilters(){
 const muscles=[...new Set(Object.values(EXERCISES).map(x=>x.muscle))].sort();
 const equipment=[...new Set(Object.values(EXERCISES).map(x=>x.equipment))].sort();
 $('#splitExerciseMuscleFilter').innerHTML='<option value="">Todos los músculos</option>'+muscles.map(x=>`<option>${x}</option>`).join('');
 $('#splitExerciseEquipmentFilter').innerHTML='<option value="">Todo el equipo</option>'+equipment.map(x=>`<option>${x}</option>`).join('');
}
function openSplitExercisePicker(dayKey){
 splitPickerDay=dayKey;
 let day=draftSplit.days.find(x=>x.day===dayKey);
 if(!day){day={day:dayKey,name:'Entrenamiento',exercises:[]};draftSplit.days.push(day)}
 splitPickerSelection=[...day.exercises];
 const dayIndex=DAY_KEYS.indexOf(dayKey);
 setText('splitPickerTitle',`Ejercicios del ${DAYS[dayIndex]}`);
 $('#splitExerciseSearch').value='';
 $('#splitExerciseMuscleFilter').value='';
 $('#splitExerciseEquipmentFilter').value='';
 renderSplitExercisePicker();
 $('#splitExercisePicker').hidden=false;
}
function closeSplitExercisePicker(){$('#splitExercisePicker').hidden=true}
$$('[data-close-split-picker]').forEach(x=>x.addEventListener('click',closeSplitExercisePicker));
function toggleSplitExercise(id){
 const idx=splitPickerSelection.indexOf(id);
 if(idx>=0)splitPickerSelection.splice(idx,1);else splitPickerSelection.push(id);
 renderSplitExercisePicker();
}
function renderSplitSelected(){
 setText('splitSelectedCount',`${splitPickerSelection.length} ejercicio${splitPickerSelection.length===1?'':'s'}`);
 const wrap=$('#splitSelectedExercises');
 wrap.innerHTML=splitPickerSelection.length
  ? splitPickerSelection.map(id=>`<span class="split-selected-chip">${EXERCISES[id]?.name||id}<button type="button" data-remove-selected="${id}">×</button></span>`).join('')
  : '<span class="empty-selected">Aún no seleccionaste ejercicios.</span>';
 $$('[data-remove-selected]',wrap).forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();toggleSplitExercise(b.dataset.removeSelected)}));
}
function renderSplitExercisePicker(){
 const q=$('#splitExerciseSearch').value.toLowerCase().trim();
 const muscle=$('#splitExerciseMuscleFilter').value;
 const equipment=$('#splitExerciseEquipmentFilter').value;
 const entries=Object.entries(EXERCISES).filter(([id,x])=>
   (!q||`${x.name} ${x.muscle} ${x.secondary} ${x.equipment}`.toLowerCase().includes(q)) &&
   (!muscle||x.muscle===muscle) &&
   (!equipment||x.equipment===equipment)
 );
 $('#splitExerciseOptions').innerHTML=entries.map(([id,x])=>`
   <article class="split-exercise-option ${splitPickerSelection.includes(id)?'selected':''}" data-split-exercise="${id}">
     <img src="${demoFor(id)}" alt="${x.name}">
     <div><h3>${x.name}</h3><p>${x.muscle}${x.secondary?` · ${x.secondary}`:''} · ${x.equipment}</p></div>
     <span class="split-exercise-check">✓</span>
   </article>`).join('');
 $$('[data-split-exercise]',$('#splitExerciseOptions')).forEach(card=>card.addEventListener('click',()=>toggleSplitExercise(card.dataset.splitExercise)));
 renderSplitSelected();
}
['splitExerciseSearch','splitExerciseMuscleFilter','splitExerciseEquipmentFilter'].forEach(id=>{
 $('#'+id).addEventListener(id==='splitExerciseSearch'?'input':'change',renderSplitExercisePicker);
});
$('#saveSplitExercisesBtn').addEventListener('click',()=>{
 let day=draftSplit.days.find(x=>x.day===splitPickerDay);
 if(!day){day={day:splitPickerDay,name:'Entrenamiento',exercises:[]};draftSplit.days.push(day)}
 day.exercises=[...splitPickerSelection];
 if(day.name==='Descanso'&&day.exercises.length)day.name='Entrenamiento';
 closeSplitExercisePicker();renderSplitEditor();toast('Ejercicios actualizados');
});

function renderSplitEditor(){
 const map=Object.fromEntries((draftSplit.days||[]).map(x=>[x.day,x]));
 $('#splitDaysEditor').innerHTML=DAY_KEYS.map((key,i)=>{const d=map[key]||{day:key,name:'Descanso',exercises:[]};return `<article class="split-day-editor" data-day="${key}"><div class="split-day-editor-head"><strong>${DAYS[i]}</strong><input class="split-day-name" value="${d.name}"></div><div class="split-day-exercises">${d.exercises.map(id=>`<span>${EXERCISES[id]?.name||id}</span>`).join('')||'<span>Sin ejercicios</span>'}</div><button data-edit-day="${key}">Seleccionar ejercicios</button></article>`}).join('');
 $$('.split-day-name',$('#splitDaysEditor')).forEach(inp=>inp.addEventListener('input',()=>{const key=inp.closest('[data-day]').dataset.day;let d=draftSplit.days.find(x=>x.day===key);if(!d){d={day:key,name:inp.value,exercises:[]};draftSplit.days.push(d)}else d.name=inp.value}));
 $$('[data-edit-day]',$('#splitDaysEditor')).forEach(b=>b.addEventListener('click',()=>openSplitExercisePicker(b.dataset.editDay)));
}
$('#newSplitBtn').addEventListener('click',()=>openSplitModal());
$('#openTemplatesBtn').addEventListener('click',()=>openSplitModal());
$('#editSplitBtn').addEventListener('click',()=>{const s=activeSplit();if(s)openSplitModal(s);else openSplitModal()});
$('#duplicateSplitBtn').addEventListener('click',()=>{const s=activeSplit();if(!s)return;const copy=JSON.parse(JSON.stringify(s));copy.id=crypto.randomUUID?.()||Date.now().toString();copy.name+=' copia';state.splits.push(copy);state.activeSplitId=copy.id;saveState();renderTraining();toast('Split duplicado')});
$('#saveSplitBtn').addEventListener('click',()=>{
 draftSplit.name=$('#splitName').value.trim()||'Mi split';draftSplit.days=(draftSplit.days||[]).filter(d=>d.name!=='Descanso'||d.exercises.length);
 if(editingSplitId){const i=state.splits.findIndex(x=>x.id===editingSplitId);draftSplit.id=editingSplitId;state.splits[i]=draftSplit}else{draftSplit.id=crypto.randomUUID?.()||Date.now().toString();state.splits.push(draftSplit)}
 state.activeSplitId=draftSplit.id;saveState();closeSplitModal();renderTraining();toast('Split guardado');
});
$('#activeSplitSelect').addEventListener('change',()=>{state.activeSplitId=$('#activeSplitSelect').value||null;saveState();renderTraining()});
$('#startTodayBtn').addEventListener('click',()=>startRoutine(todayKey()));

function renderWeek(){
 const split=activeSplit();$('#splitEmpty').hidden=!!split;$('#weekSchedule').innerHTML='';if(!split)return;
 const byDay=Object.fromEntries(split.days.map(x=>[x.day,x])),today=todayKey();
 $('#weekSchedule').innerHTML=DAY_KEYS.map((key,i)=>{const r=byDay[key],isToday=key===today;return `<article class="week-day card ${isToday?'today':''}"><div class="day-badge"><strong>${DAYS[i].slice(0,3)}</strong><small>${isToday?'HOY':''}</small></div><div><h3>${r?.name||'Descanso'}</h3><p>${r?.exercises?.length?r.exercises.map(id=>EXERCISES[id]?.name).slice(0,3).join(' · ')+(r.exercises.length>3?'…':''):'Recuperación'}</p></div>${r?`<button data-start-day="${key}">Entrenar</button>`:''}</article>`}).join('');
 $$('[data-start-day]',$('#weekSchedule')).forEach(b=>b.addEventListener('click',()=>startRoutine(b.dataset.startDay)));
}
function populateTrainingSelect(){
 const chart=$('#trainingChartExercise'),current=chart.value;
 chart.innerHTML=Object.entries(EXERCISES).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('');
 chart.value=current&&EXERCISES[current]?current:'press_banca';
}
function renderTraining(){
 state.workouts=state.workouts||[];state.splits=state.splits||[];
 const stats=state.workouts.map(sessionStats);setText('trainingSessions',state.workouts.length);setText('trainingVolume',fmt(stats.reduce((a,x)=>a+x.volume,0)));
 const prs=new Set();Object.keys(EXERCISES).forEach(ex=>{if(state.workouts.some(w=>w.exercise===ex))prs.add(ex)});setText('trainingPrs',prs.size);
 $('#activeSplitSelect').innerHTML='<option value="">Sin split activo</option>'+state.splits.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');$('#activeSplitSelect').value=state.activeSplitId||'';
 const split=activeSplit(),routine=split?.days.find(x=>x.day===todayKey());setText('todayWorkoutTitle',routine?.name||'Día libre');setText('todayWorkoutText',routine?`${routine.exercises.length} ejercicios programados`:'Crea o activa un split para organizar tu semana.');
 renderWeek();renderExerciseLibrary();renderSession();populateTrainingSelect();
 const list=$('#workoutHistory');list.innerHTML='';const items=[...state.workouts].sort((a,b)=>(b.date+b.createdAt).localeCompare(a.date+a.createdAt)).slice(0,12);$('#workoutEmpty').hidden=items.length>0;
 items.forEach(w=>{const s=sessionStats(w),el=document.createElement('article');el.className='workout-item card';el.innerHTML=`<div class="workout-item-header"><div><h3>${EXERCISES[w.exercise]?.name||w.exercise}</h3><small>${escapeHtml(w.note||'Sin nota')}</small></div><time>${new Date(w.date+'T12:00:00').toLocaleDateString('es-PE',{day:'2-digit',month:'short',year:'numeric'})}</time></div><div class="workout-stats"><div><strong>${fmt(s.e1rm,1)} kg</strong><small>1RM estimado</small></div><div><strong>${fmt(s.volume)} kg</strong><small>Volumen</small></div><div><strong>${fmt(s.avgRir,1)}</strong><small>RIR medio</small></div></div><div class="workout-sets">${w.sets.map((x,i)=>`S${i+1}: ${fmt(x.weight,1)} kg × ${x.reps} · RIR ${x.rir}`).join(' &nbsp;|&nbsp; ')}</div><button class="workout-delete" data-workout-delete="${w.id}">Eliminar sesión</button>`;list.appendChild(el)});
 $$('[data-workout-delete]',list).forEach(b=>b.addEventListener('click',()=>{state.workouts=state.workouts.filter(x=>x.id!==b.dataset.workoutDelete);saveState();renderAll();toast('Sesión eliminada')}));
}
$('#trainingChartExercise').addEventListener('change',renderCharts);
$$('#trainingMetricTabs button').forEach(b=>b.addEventListener('click',()=>{$$('#trainingMetricTabs button').forEach(x=>x.classList.toggle('selected',x===b));trainingMetric=b.dataset.metric;renderCharts()}));

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
$('#proteinDate').value=today();populateFilters();populateSplitPickerFilters();
applyTheme();hydrateForm();renderAll();renderProgress();
})();
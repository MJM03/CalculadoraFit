
(() => {
'use strict';
const KEY='forge.performance.os.v2';
const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const DAYKEYS=['mon','tue','wed','thu','fri','sat','sun'];
const EXERCISES={
 press_banca:{name:'Press de banca',muscle:'Pecho',secondary:'Tríceps y hombro anterior',equipment:'Barra',icon:'▰',step:2.5,instructions:'Apoya pies y espalda, baja la barra con control hacia el pecho y empuja manteniendo tensión.',tip:'Mantén los omóplatos retraídos y los codos estables.'},
 press_inclinado:{name:'Press inclinado',muscle:'Pecho',secondary:'Hombro anterior y tríceps',equipment:'Barra',icon:'╱',step:2.5,instructions:'Usa una inclinación moderada y baja la barra hacia la zona superior del pecho.',tip:'Evita una inclinación excesiva.'},
 press_mancuernas:{name:'Press con mancuernas',muscle:'Pecho',secondary:'Tríceps',equipment:'Mancuernas',icon:'◆',step:2,instructions:'Baja las mancuernas junto al pecho y extiende sin perder control.',tip:'Mantén muñecas neutras.'},
 fondos:{name:'Fondos',muscle:'Pecho',secondary:'Tríceps',equipment:'Peso corporal',icon:'∪',step:2.5,instructions:'Desciende con control y empuja hasta extender los codos.',tip:'Inclina ligeramente el torso para enfatizar pecho.'},
 flexiones:{name:'Flexiones',muscle:'Pecho',secondary:'Tríceps y core',equipment:'Peso corporal',icon:'—',step:1,instructions:'Mantén el cuerpo alineado, baja el pecho y empuja el suelo.',tip:'Evita que la cadera caiga.'},
 dominadas:{name:'Dominadas',muscle:'Espalda',secondary:'Bíceps',equipment:'Peso corporal',icon:'⌃',step:2.5,instructions:'Desde suspensión activa, lleva el pecho hacia la barra.',tip:'Inicia con depresión escapular.'},
 jalon_pecho:{name:'Jalón al pecho',muscle:'Espalda',secondary:'Bíceps',equipment:'Polea',icon:'⇣',step:5,instructions:'Tira de la barra hacia el pecho manteniendo el torso estable.',tip:'No te inclines demasiado.'},
 remo_barra:{name:'Remo con barra',muscle:'Espalda',secondary:'Bíceps y lumbar',equipment:'Barra',icon:'↔',step:2.5,instructions:'Inclina el torso y lleva la barra hacia el abdomen.',tip:'Mantén espalda neutra.'},
 remo_mancuerna:{name:'Remo con mancuerna',muscle:'Espalda',secondary:'Bíceps',equipment:'Mancuernas',icon:'↤',step:2,instructions:'Lleva el codo hacia la cadera y controla el descenso.',tip:'Evita rotar el torso.'},
 remo_polea:{name:'Remo sentado',muscle:'Espalda',secondary:'Bíceps',equipment:'Polea',icon:'⇆',step:5,instructions:'Tira del agarre al abdomen y junta escápulas.',tip:'Evita balancearte.'},
 sentadilla:{name:'Sentadilla trasera',muscle:'Cuádriceps',secondary:'Glúteos y core',equipment:'Barra',icon:'⌄',step:5,instructions:'Desciende flexionando cadera y rodillas con el pie completo apoyado.',tip:'Mantén rodillas alineadas con los pies.'},
 sentadilla_frontal:{name:'Sentadilla frontal',muscle:'Cuádriceps',secondary:'Core',equipment:'Barra',icon:'⌄',step:2.5,instructions:'Sostén la barra al frente y desciende con torso erguido.',tip:'Mantén los codos altos.'},
 prensa:{name:'Prensa de piernas',muscle:'Cuádriceps',secondary:'Glúteos',equipment:'Máquina',icon:'▱',step:5,instructions:'Baja la plataforma hasta un rango cómodo y empuja sin bloquear rodillas.',tip:'No despegues la zona lumbar.'},
 zancadas:{name:'Zancadas',muscle:'Cuádriceps',secondary:'Glúteos',equipment:'Mancuernas',icon:'⋰',step:2,instructions:'Da un paso amplio y baja ambas rodillas con control.',tip:'Mantén la rodilla alineada.'},
 bulgaras:{name:'Sentadilla búlgara',muscle:'Cuádriceps',secondary:'Glúteos',equipment:'Mancuernas',icon:'⋱',step:2,instructions:'Apoya el pie trasero elevado y baja sobre la pierna delantera.',tip:'Ajusta la distancia para equilibrarte.'},
 peso_muerto:{name:'Peso muerto',muscle:'Isquiotibiales',secondary:'Glúteos y espalda',equipment:'Barra',icon:'⌁',step:5,instructions:'Empuja el suelo manteniendo la barra cerca del cuerpo.',tip:'No hiperextiendas al final.'},
 rumano:{name:'Peso muerto rumano',muscle:'Isquiotibiales',secondary:'Glúteos',equipment:'Barra',icon:'⌁',step:2.5,instructions:'Lleva la cadera atrás y baja la barra cerca de las piernas.',tip:'Detente al perder tensión posterior.'},
 curl_femoral:{name:'Curl femoral',muscle:'Isquiotibiales',secondary:'',equipment:'Máquina',icon:'⌒',step:2.5,instructions:'Flexiona las rodillas y vuelve lentamente.',tip:'Mantén la cadera pegada.'},
 hip_thrust:{name:'Hip thrust',muscle:'Glúteos',secondary:'Isquiotibiales',equipment:'Barra',icon:'⌇',step:5,instructions:'Extiende la cadera hasta alinear rodillas, cadera y hombros.',tip:'Evita hiperextender la espalda.'},
 press_militar:{name:'Press militar',muscle:'Hombros',secondary:'Tríceps',equipment:'Barra',icon:'⇧',step:2.5,instructions:'Empuja la barra sobre la cabeza con abdomen y glúteos activos.',tip:'La barra viaja cerca del rostro.'},
 press_hombro:{name:'Press de hombro',muscle:'Hombros',secondary:'Tríceps',equipment:'Mancuernas',icon:'⇧',step:2,instructions:'Empuja las mancuernas arriba y baja controlando.',tip:'No arquees la zona lumbar.'},
 laterales:{name:'Elevaciones laterales',muscle:'Hombros',secondary:'',equipment:'Mancuernas',icon:'↟',step:1,instructions:'Eleva los brazos hasta la altura del hombro.',tip:'Dirige el movimiento con los codos.'},
 face_pull:{name:'Face pull',muscle:'Hombros',secondary:'Espalda alta',equipment:'Polea',icon:'⇐',step:1,instructions:'Tira de la cuerda hacia la cara separando las manos.',tip:'Prioriza control y rotación externa.'},
 curl_biceps:{name:'Curl de bíceps',muscle:'Bíceps',secondary:'Antebrazo',equipment:'Barra',icon:'∩',step:1,instructions:'Flexiona los codos sin moverlos hacia delante.',tip:'Evita balancear el torso.'},
 curl_martillo:{name:'Curl martillo',muscle:'Bíceps',secondary:'Antebrazo',equipment:'Mancuernas',icon:'∩',step:1,instructions:'Flexiona con agarre neutro.',tip:'Controla especialmente la bajada.'},
 extension_triceps:{name:'Extensión de tríceps',muscle:'Tríceps',secondary:'',equipment:'Polea',icon:'⇩',step:1,instructions:'Extiende los codos sin mover los brazos.',tip:'Separa la cuerda al final.'},
 press_frances:{name:'Press francés',muscle:'Tríceps',secondary:'',equipment:'Barra',icon:'⌇',step:1,instructions:'Flexiona los codos llevando la barra hacia la frente.',tip:'Mantén los codos apuntando arriba.'},
 gemelos:{name:'Elevación de gemelos',muscle:'Pantorrillas',secondary:'',equipment:'Máquina',icon:'↥',step:2.5,instructions:'Sube sobre la punta de los pies y baja con control.',tip:'Haz pausa arriba.'},
 plancha:{name:'Plancha frontal',muscle:'Core',secondary:'Hombros',equipment:'Peso corporal',icon:'━',step:1,instructions:'Mantén cuerpo alineado sobre antebrazos y pies.',tip:'Aprieta glúteos y abdomen.'},
 crunch:{name:'Crunch abdominal',muscle:'Core',secondary:'',equipment:'Peso corporal',icon:'⌒',step:1,instructions:'Acerca costillas a pelvis elevando ligeramente el torso.',tip:'No tires del cuello.'},
 pallof:{name:'Pallof press',muscle:'Core',secondary:'Oblicuos',equipment:'Polea',icon:'⊣',step:1,instructions:'Empuja el agarre al frente resistiendo la rotación.',tip:'Mantén pelvis y costillas alineadas.'}
};
const TEMPLATES={
 fullbody3:{name:'Full Body 3 días',days:[{day:'mon',name:'Full Body A',exercises:['sentadilla','press_banca','remo_barra','rumano','laterales','plancha']},{day:'wed',name:'Full Body B',exercises:['peso_muerto','press_militar','jalon_pecho','bulgaras','curl_biceps','extension_triceps']},{day:'fri',name:'Full Body C',exercises:['prensa','press_inclinado','remo_polea','hip_thrust','face_pull','crunch']}]},
 upperlower4:{name:'Upper / Lower 4 días',days:[{day:'mon',name:'Upper A',exercises:['press_banca','remo_barra','press_militar','jalon_pecho','curl_biceps','extension_triceps']},{day:'tue',name:'Lower A',exercises:['sentadilla','rumano','prensa','curl_femoral','gemelos','plancha']},{day:'thu',name:'Upper B',exercises:['press_inclinado','dominadas','press_hombro','remo_polea','curl_martillo','press_frances']},{day:'fri',name:'Lower B',exercises:['peso_muerto','bulgaras','hip_thrust','gemelos','pallof']}]},
 ppl6:{name:'Push Pull Legs 6 días',days:[{day:'mon',name:'Push A',exercises:['press_banca','press_inclinado','press_militar','laterales','extension_triceps']},{day:'tue',name:'Pull A',exercises:['dominadas','remo_barra','jalon_pecho','face_pull','curl_biceps']},{day:'wed',name:'Legs A',exercises:['sentadilla','rumano','prensa','curl_femoral','gemelos']},{day:'thu',name:'Push B',exercises:['press_mancuernas','fondos','press_hombro','laterales','press_frances']},{day:'fri',name:'Pull B',exercises:['remo_mancuerna','jalon_pecho','remo_polea','face_pull','curl_martillo']},{day:'sat',name:'Legs B',exercises:['peso_muerto','bulgaras','hip_thrust','curl_femoral','gemelos']}]}
};
const defaultState={theme:'dark',profile:{name:'Atleta',targetWeight:75,targetCalories:2200,targetProtein:160,targetCarbs:250,targetFats:70},goalProfile:null,generatedPlan:null,meals:[],weights:[],workouts:[],routines:[],activeRoutineId:null,activeSession:null};
let state=load(),selectedExercise=null,editingRoutine=null,editingDay=null,sessionSeconds=0,timer=null;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const today=()=>new Date().toISOString().slice(0,10);
const fmt=(n,d=0)=>Number(n||0).toLocaleString('es-PE',{minimumFractionDigits:d,maximumFractionDigits:d});
const uid=()=>crypto.randomUUID?.()||Date.now().toString()+Math.random().toString(16).slice(2);
function load(){try{return {...defaultState,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return structuredClone(defaultState)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove('show'),2200)}
function showView(name){$$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+name));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));$('#pageTitle').textContent=({dashboard:'Dashboard',nutrition:'Nutrición',training:'Entrenamiento',routines:'Rutinas',library:'Ejercicios',progress:'Progreso',plan:'Plan automático',settings:'Ajustes'})[name]||'FORGE';$('#sidebar').classList.remove('open');scrollTo({top:0,behavior:'smooth'});requestAnimationFrame(drawAll)}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');$('#quickTrainBtn').onclick=()=>{showView('training');startClock()};$('#themeBtn').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';applyTheme()};
function applyTheme(){document.documentElement.dataset.theme=state.theme;save();requestAnimationFrame(drawAll)}
function dayKey(){return DAYKEYS[(new Date().getDay()+6)%7]}
function activeRoutine(){return state.routines.find(r=>r.id===state.activeRoutineId)||null}
function todayRoutine(){const r=activeRoutine();return r?.days.find(d=>d.day===dayKey())||null}
function e1rm(w,r){return w>0&&r>0?w*(1+r/30):0}
function workoutStats(w){const sets=w.sets||[];return{volume:sets.reduce((a,s)=>a+s.weight*s.reps,0),topWeight:sets.reduce((a,s)=>Math.max(a,s.weight),0),e1rm:sets.reduce((a,s)=>Math.max(a,e1rm(s.weight,s.reps)),0),avgRir:sets.length?sets.reduce((a,s)=>a+s.rir,0)/sets.length:0}}
function latestWorkout(ex){return [...state.workouts].filter(w=>w.exercise===ex).sort((a,b)=>(b.date+b.createdAt).localeCompare(a.date+a.createdAt))[0]||null}
function recommendation(ex,range='8-12'){const last=latestWorkout(ex),[low,high]=range.split('-').map(Number),step=EXERCISES[ex]?.step||2.5;if(!last)return{title:'Primera referencia',load:'—',text:'Usa una carga que deje 2–3 repeticiones en reserva.'};const s=workoutStats(last),sets=last.sets,allTop=sets.length&&sets.every(x=>x.reps>=high),avg=sets.reduce((a,x)=>a+x.reps,0)/sets.length;if(allTop&&s.avgRir>=1.5)return{title:'Subir carga',load:`${fmt(s.topWeight+step,1)} kg`,text:`Completaste el rango alto con RIR ${fmt(s.avgRir,1)}.`};if(avg<low||s.avgRir<.5)return{title:'Mantener o descargar',load:`${fmt(Math.max(0,s.topWeight-step),1)} kg`,text:'El rendimiento quedó por debajo del rango o demasiado cerca del fallo.'};return{title:'Mantener carga',load:`${fmt(s.topWeight,1)} kg`,text:'Suma una repetición total antes de aumentar peso.'}}
function renderAll(){renderHeader();renderDashboard();renderNutrition();renderTraining();renderRoutines();renderLibrary();renderProgress();renderPlan();renderSettings();drawAll()}
function renderHeader(){const d=new Date();$('#todayLabel').textContent=d.toLocaleDateString('es-PE',{weekday:'long',day:'2-digit',month:'long'}).toUpperCase();$('#sidebarName').textContent=state.profile.name||'Atleta'}
function todayMeals(){return state.meals.filter(m=>m.date===today())}
function mealTotals(items=todayMeals()){return items.reduce((a,m)=>({cal:a.cal+m.calories,p:a.p+m.protein,c:a.c+m.carbs,f:a.f+m.fats}),{cal:0,p:0,c:0,f:0})}
function weekStart(){const d=new Date();const diff=(d.getDay()+6)%7;d.setDate(d.getDate()-diff);d.setHours(0,0,0,0);return d}
function currentWeight(){return [...state.weights].sort((a,b)=>b.date.localeCompare(a.date))[0]?.weight||null}
function weeklyVolume(){const ws=weekStart();return state.workouts.filter(w=>new Date(w.date+'T12:00:00')>=ws).reduce((a,w)=>a+workoutStats(w).volume,0)}
function renderDashboard(){const t=mealTotals(),p=state.profile,cw=currentWeight(),tr=todayRoutine();$('#heroGreeting').textContent=`${p.name||'Atleta'}, construye progreso medible.`;$('#heroSummary').textContent=state.workouts.length?'Tus datos ya permiten ajustar carga, volumen y nutrición.':'Registra nutrición y entrenamiento para activar recomendaciones.';$('#readinessScore').textContent=Math.max(55,Math.min(95,78+(state.workouts.length?5:0)+(todayMeals().length?4:0)));$('#todayRoutineName').textContent=tr?.name||'Sin rutina activa';$('#todayRoutineBadge').textContent=tr?'PROGRAMADO':'LIBRE';$('#todayRoutineMeta').textContent=tr?`${tr.exercises.length} ejercicios programados`:'Crea o activa una rutina semanal.';$('#dashCalories').textContent=fmt(t.cal);$('#dashCaloriesMeta').textContent=`de ${fmt(p.targetCalories)} kcal`;$('#dashCaloriesBar').style.width=Math.min(100,t.cal/p.targetCalories*100)+'%';$('#dashProtein').textContent=fmt(t.p)+' g';$('#dashProteinMeta').textContent=`de ${fmt(p.targetProtein)} g`;$('#dashProteinBar').style.width=Math.min(100,t.p/p.targetProtein*100)+'%';$('#dashWeight').textContent=cw?fmt(cw,1)+' kg':'—';const ws=[...state.weights].sort((a,b)=>a.date.localeCompare(b.date));$('#dashWeightTrend').textContent=ws.length>1?`${ws.at(-1).weight-ws[0].weight>=0?'+':''}${fmt(ws.at(-1).weight-ws[0].weight,1)} kg total`:'Sin registros suficientes';$('#dashVolume').textContent=fmt(weeklyVolume())+' kg';$('#dashVolumeTrend').textContent=state.workouts.length?`${state.workouts.length} registros históricos`:'Sin sesiones';$('#donutCalories').textContent=fmt(t.cal);$('#macroPercent').textContent=fmt(Math.min(100,t.cal/p.targetCalories*100))+'%';$('#macroProtein').textContent=`${fmt(t.p)} / ${fmt(p.targetProtein)} g`;$('#macroCarbs').textContent=`${fmt(t.c)} / ${fmt(p.targetCarbs)} g`;$('#macroFats').textContent=`${fmt(t.f)} / ${fmt(p.targetFats)} g`;const pp=Math.min(100,t.p/p.targetProtein*100),cp=Math.min(100,t.c/p.targetCarbs*100),fp=Math.min(100,t.f/p.targetFats*100);$('#macroDonut').style.background=`conic-gradient(var(--mint) 0 ${pp/3}%,var(--blue) ${pp/3}% ${(pp+cp)/3}%,var(--violet) ${(pp+cp)/3}% ${(pp+cp+fp)/3}%,var(--panel2) ${(pp+cp+fp)/3}% 100%)`;const ex=state.workouts.at(-1)?.exercise||'press_banca',rec=recommendation(ex);$('#strengthChartTitle').textContent=EXERCISES[ex]?.name||'Ejercicio principal';$('#recommendationTitle').textContent=rec.title;$('#recommendationLoad').textContent=rec.load;$('#recommendationText').textContent=rec.text}
$('#startTodayWorkout').onclick=()=>{const tr=todayRoutine();if(tr)startRoutineSession(tr);else{ensureSession();showView('training');startClock()}}
function renderNutrition(){const t=mealTotals(),p=state.profile;$('#nutritionTarget').textContent=fmt(p.targetCalories);$('#nutritionConsumed').textContent=fmt(t.cal);$('#nutritionRemaining').textContent=fmt(Math.max(0,p.targetCalories-t.cal));const seven=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return d.toISOString().slice(0,10)});const balance=seven.reduce((a,d)=>a+state.meals.filter(m=>m.date===d).reduce((x,m)=>x+m.calories,0)-p.targetCalories,0);$('#weeklyBalance').textContent=(balance>0?'+':'')+fmt(balance);const list=$('#mealList');list.innerHTML='';todayMeals().forEach(m=>{const el=document.createElement('div');el.className='meal';el.innerHTML=`<div><strong>${esc(m.name)}</strong><small>${m.date}</small></div><div class="meal-stat">${fmt(m.calories)}<small>kcal</small></div><div class="meal-stat">${fmt(m.protein)} g<small>proteína</small></div><div class="meal-stat">${fmt(m.carbs)} g<small>carbos</small></div><div class="meal-stat">${fmt(m.fats)} g<small>grasas</small></div><button data-del-meal="${m.id}">×</button>`;list.appendChild(el)});$('#mealEmpty').style.display=todayMeals().length?'none':'block';$$('[data-del-meal]',list).forEach(b=>b.onclick=()=>{state.meals=state.meals.filter(m=>m.id!==b.dataset.delMeal);save();renderAll();toast('Comida eliminada')});const cw=currentWeight();if(cw){const projected=cw-balance/7700*4;$('#projectedWeight').textContent=fmt(projected,1)+' kg';$('#projectionText').textContent=`Proyección a 4 semanas según el balance registrado en los últimos 7 días.`}else{$('#projectedWeight').textContent='—';$('#projectionText').textContent='Registra peso y alimentación para estimar una tendencia.'}}
$('#addMealBtn').onclick=()=>openModal('mealModal');$('#mealForm').onsubmit=e=>{e.preventDefault();state.meals.push({id:uid(),date:today(),name:$('#mealName').value.trim(),calories:+$('#mealCalories').value,protein:+$('#mealProtein').value,carbs:+$('#mealCarbs').value,fats:+$('#mealFats').value});save();e.target.reset();closeModal('mealModal');renderAll();toast('Comida registrada')}
function ensureSession(name='Sesión libre'){if(!state.activeSession)state.activeSession={id:uid(),name,date:today(),startedAt:new Date().toISOString(),exercises:[]}}
function startRoutineSession(r){state.activeSession={id:uid(),name:r.name,date:today(),startedAt:new Date().toISOString(),exercises:r.exercises.map(ex=>({exercise:ex,range:'8-12',sets:[{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2}]}))};save();showView('training');startClock();renderTraining()}
function startClock(){if(timer)return;timer=setInterval(()=>{sessionSeconds++;$('#sessionClock').textContent=`${String(Math.floor(sessionSeconds/60)).padStart(2,'0')}:${String(sessionSeconds%60).padStart(2,'0')}`},1000)}
function renderTraining(){const s=state.activeSession;$('#activeSessionName').textContent=s?.name||'Sesión libre';$('#activeSessionMeta').textContent=s?`${s.exercises.length} ejercicios · ${s.date}`:'Añade ejercicios o inicia la rutina del día.';$('#activeSessionEmpty').style.display=s?.exercises.length?'none':'block';const list=$('#activeExerciseList');list.innerHTML='';if(!s)return;s.exercises.forEach((item,idx)=>{const ex=EXERCISES[item.exercise],rec=recommendation(item.exercise,item.range),el=document.createElement('article');el.className='panel active-exercise';el.innerHTML=`<div class="active-head"><div class="exercise-icon">${ex.icon}</div><div><h3>${idx+1}. ${ex.name}</h3><p>${ex.muscle} · ${item.range} reps</p></div><button data-remove-ex="${idx}">×</button></div><div class="smart-tip"><strong>${rec.title}: ${rec.load}</strong>${rec.text}</div><div class="sets"><div class="set-head"><span>#</span><span>kg</span><span>reps</span><span>RIR</span><span></span></div>${item.sets.map((set,si)=>`<div class="set-row" data-set="${si}"><span>${si+1}</span><input data-field="weight" type="number" step="0.5" value="${set.weight}"><input data-field="reps" type="number" value="${set.reps}"><input data-field="rir" type="number" min="0" max="10" value="${set.rir}"><button data-done="${si}">✓</button></div>`).join('')}<button class="add-set" data-add-set="${idx}">+ Añadir serie</button></div>`;list.appendChild(el);$$('input',el).forEach(inp=>inp.oninput=()=>{const si=+inp.closest('[data-set]').dataset.set;item.sets[si][inp.dataset.field]=inp.value;save()})});$$('[data-remove-ex]',list).forEach(b=>b.onclick=()=>{s.exercises.splice(+b.dataset.removeEx,1);save();renderTraining()});$$('[data-add-set]',list).forEach(b=>b.onclick=()=>{s.exercises[+b.dataset.addSet].sets.push({weight:'',reps:'',rir:2});save();renderTraining()})}
$('#addExerciseTraining').onclick=()=>{ensureSession();openPicker('session')};$('#chooseRoutineWorkout').onclick=()=>{const tr=todayRoutine();if(tr)startRoutineSession(tr);else toast('No hay rutina para hoy')};$('#clearSessionBtn').onclick=()=>{state.activeSession=null;save();renderTraining();toast('Sesión limpiada')};$('#finishSessionBtn').onclick=()=>{const s=state.activeSession;if(!s||!s.exercises.length)return toast('No hay ejercicios');let count=0;s.exercises.forEach(item=>{const sets=item.sets.map(x=>({weight:+x.weight||0,reps:+x.reps||0,rir:+x.rir||0})).filter(x=>x.reps>0);if(sets.length){state.workouts.push({id:uid(),date:s.date,exercise:item.exercise,sets,note:s.name,createdAt:new Date().toISOString()});count++}});if(!count)return toast('Registra al menos una serie');state.activeSession=null;clearInterval(timer);timer=null;sessionSeconds=0;$('#sessionClock').textContent='00:00';save();renderAll();showView('progress');toast('Entrenamiento guardado')}
function renderRoutines(){const strip=$('#routineTemplates');strip.innerHTML=Object.entries(TEMPLATES).map(([k,t])=>`<article class="panel template-card"><p class="eyebrow violet">PLANTILLA</p><h3>${t.name}</h3><p>${t.days.length} días programados</p><button class="secondary full" data-use-template="${k}">Usar plantilla</button></article>`).join('');$$('[data-use-template]',strip).forEach(b=>b.onclick=()=>useTemplate(b.dataset.useTemplate));const list=$('#routineList');list.innerHTML='';state.routines.forEach(r=>{const el=document.createElement('article');el.className='panel routine-card';el.innerHTML=`<p class="eyebrow ${r.id===state.activeRoutineId?'mint':''}">${r.id===state.activeRoutineId?'ACTIVA':'RUTINA'}</p><h3>${esc(r.name)}</h3><p>${r.days.length} días de entrenamiento</p><div class="routine-days">${r.days.map(d=>`<span>${DAYS[DAYKEYS.indexOf(d.day)].slice(0,3)} · ${esc(d.name)}</span>`).join('')}</div><div class="routine-actions"><button class="secondary" data-edit-routine="${r.id}">Editar</button><button class="primary" data-activate-routine="${r.id}">${r.id===state.activeRoutineId?'Activa':'Activar'}</button></div></article>`;list.appendChild(el)});$('#routineEmpty').style.display=state.routines.length?'none':'block';$$('[data-edit-routine]',list).forEach(b=>b.onclick=()=>openRoutineEditor(state.routines.find(r=>r.id===b.dataset.editRoutine)));$$('[data-activate-routine]',list).forEach(b=>b.onclick=()=>{state.activeRoutineId=b.dataset.activateRoutine;save();renderAll();toast('Rutina activada')})}
function useTemplate(k){const t=TEMPLATES[k],r={id:uid(),name:t.name,days:structuredClone(t.days)};state.routines.push(r);state.activeRoutineId=r.id;save();renderAll();toast('Plantilla añadida')}
$('#newRoutineBtn').onclick=()=>openRoutineEditor(null);
function openRoutineEditor(r){editingRoutine=r?structuredClone(r):{id:null,name:'Mi rutina',days:[]};$('#routineName').value=editingRoutine.name;renderRoutineDays();openModal('routineModal')}
function renderRoutineDays(){const map=Object.fromEntries(editingRoutine.days.map(d=>[d.day,d]));$('#routineDayEditor').innerHTML=DAYKEYS.map((key,i)=>{const d=map[key]||{day:key,name:'Descanso',exercises:[]};return `<div class="day-row" data-day="${key}"><div class="day-row-head"><strong>${DAYS[i]}</strong><input class="day-name" value="${escAttr(d.name)}"><button class="secondary" data-pick-day="${key}">Ejercicios</button></div><div class="day-exercises">${d.exercises.map(ex=>`<span>${EXERCISES[ex]?.name||ex}</span>`).join('')||'<span>Sin ejercicios</span>'}</div></div>`}).join('');$$('.day-name',$('#routineDayEditor')).forEach(inp=>inp.oninput=()=>{const key=inp.closest('[data-day]').dataset.day;let d=editingRoutine.days.find(x=>x.day===key);if(!d){d={day:key,name:inp.value,exercises:[]};editingRoutine.days.push(d)}else d.name=inp.value});$$('[data-pick-day]',$('#routineDayEditor')).forEach(b=>b.onclick=()=>{editingDay=b.dataset.pickDay;openPicker('routine')})}
$('#saveRoutineBtn').onclick=()=>{editingRoutine.name=$('#routineName').value.trim()||'Mi rutina';editingRoutine.days=editingRoutine.days.filter(d=>d.exercises.length||d.name!=='Descanso');if(editingRoutine.id){const i=state.routines.findIndex(r=>r.id===editingRoutine.id);state.routines[i]=editingRoutine}else{editingRoutine.id=uid();state.routines.push(editingRoutine);if(!state.activeRoutineId)state.activeRoutineId=editingRoutine.id}save();closeModal('routineModal');renderAll();toast('Rutina guardada')}
function renderLibrary(){const muscles=[...new Set(Object.values(EXERCISES).map(e=>e.muscle))].sort(),equipment=[...new Set(Object.values(EXERCISES).map(e=>e.equipment))].sort();if(!$('#muscleFilter').dataset.ready){$('#muscleFilter').innerHTML='<option value="">Todos los músculos</option>'+muscles.map(x=>`<option>${x}</option>`).join('');$('#equipmentFilter').innerHTML='<option value="">Todo el equipo</option>'+equipment.map(x=>`<option>${x}</option>`).join('');$('#muscleFilter').dataset.ready='1'}const q=$('#exerciseSearch').value.toLowerCase(),m=$('#muscleFilter').value,e=$('#equipmentFilter').value,entries=Object.entries(EXERCISES).filter(([id,x])=>(!q||`${x.name} ${x.muscle} ${x.secondary} ${x.equipment}`.toLowerCase().includes(q))&&(!m||x.muscle===m)&&(!e||x.equipment===e));$('#exerciseCount').textContent=entries.length;$('#exerciseGrid').innerHTML=entries.map(([id,x])=>`<article class="panel exercise-card" data-exercise="${id}"><div class="exercise-visual-small">${x.icon}</div><h3>${x.name}</h3><p>${x.muscle}${x.secondary?` · ${x.secondary}`:''}</p><div class="tags"><span>${x.equipment}</span><span>${x.muscle}</span></div></article>`).join('');$$('[data-exercise]',$('#exerciseGrid')).forEach(c=>c.onclick=()=>openExercise(c.dataset.exercise))}
['exerciseSearch','muscleFilter','equipmentFilter'].forEach(id=>$('#'+id).addEventListener(id==='exerciseSearch'?'input':'change',renderLibrary));
function openExercise(id){selectedExercise=id;const x=EXERCISES[id];$('#exerciseVisual').textContent=x.icon;$('#exerciseMuscle').textContent=x.muscle.toUpperCase();$('#exerciseName').textContent=x.name;$('#exerciseMeta').textContent=`${x.equipment}${x.secondary?` · También trabaja ${x.secondary}`:''}`;$('#exerciseInstructions').textContent=x.instructions;$('#exerciseTip').textContent=x.tip;openModal('exerciseModal')}
$('#addExerciseFromModal').onclick=()=>{ensureSession();state.activeSession.exercises.push({exercise:selectedExercise,range:'8-12',sets:[{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2}]});save();closeModal('exerciseModal');showView('training');startClock();renderTraining();toast('Ejercicio añadido')}
function openPicker(mode){$('#pickerTitle').textContent=mode==='routine'?`Ejercicios del ${DAYS[DAYKEYS.indexOf(editingDay)]}`:'Añadir a sesión';$('#pickerSearch').value='';$('#pickerModal').dataset.mode=mode;renderPicker();openModal('pickerModal')}
function renderPicker(){const q=$('#pickerSearch').value.toLowerCase();$('#pickerList').innerHTML=Object.entries(EXERCISES).filter(([id,x])=>!q||`${x.name} ${x.muscle}`.toLowerCase().includes(q)).map(([id,x])=>`<div class="picker-item" data-pick="${id}"><div class="mini-icon">${x.icon}</div><div><h4>${x.name}</h4><p>${x.muscle} · ${x.equipment}</p></div><span>+</span></div>`).join('');$$('[data-pick]',$('#pickerList')).forEach(x=>x.onclick=()=>{const id=x.dataset.pick;if($('#pickerModal').dataset.mode==='session'){ensureSession();state.activeSession.exercises.push({exercise:id,range:'8-12',sets:[{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2},{weight:'',reps:'',rir:2}]});save();closeModal('pickerModal');renderTraining();toast('Ejercicio añadido')}else{let d=editingRoutine.days.find(d=>d.day===editingDay);if(!d){d={day:editingDay,name:'Entrenamiento',exercises:[]};editingRoutine.days.push(d)}if(!d.exercises.includes(id))d.exercises.push(id);closeModal('pickerModal');renderRoutineDays();toast('Ejercicio añadido')}})}
$('#pickerSearch').oninput=renderPicker;
function renderProgress(){const seven=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return d.toISOString().slice(0,10)}),target=state.profile.targetCalories,days=seven.map(d=>state.meals.filter(m=>m.date===d).reduce((a,m)=>a+m.calories,0)),valid=days.filter(x=>x>0),adh=valid.length?valid.reduce((a,x)=>a+Math.min(100,x/target*100),0)/valid.length:0;$('#adherenceValue').textContent=fmt(adh)+'%';const hist=$('#workoutHistory');hist.innerHTML='';[...state.workouts].sort((a,b)=>(b.date+b.createdAt).localeCompare(a.date+a.createdAt)).slice(0,12).forEach(w=>{const s=workoutStats(w),el=document.createElement('article');el.className='panel history-item';el.innerHTML=`<div><h3>${EXERCISES[w.exercise]?.name||w.exercise}</h3><p>${w.date} · ${esc(w.note||'Entrenamiento')}</p></div><div><strong>${fmt(s.e1rm,1)} kg</strong><small>1RM estimado</small></div><div><strong>${fmt(s.volume)} kg</strong><small>volumen</small></div><div><strong>${fmt(s.avgRir,1)}</strong><small>RIR medio</small></div><button class="danger-btn" data-del-workout="${w.id}">Borrar</button>`;hist.appendChild(el)});$$('[data-del-workout]',hist).forEach(b=>b.onclick=()=>{state.workouts=state.workouts.filter(w=>w.id!==b.dataset.delWorkout);save();renderAll();toast('Registro eliminado')})}
$('#addWeightBtn').onclick=()=>{$('#weightDate').value=today();openModal('weightModal')};$('#weightForm').onsubmit=e=>{e.preventDefault();const date=$('#weightDate').value,weight=+$(' #weightValue'.trim()).value;state.weights=state.weights.filter(x=>x.date!==date);state.weights.push({id:uid(),date,weight});state.weights.sort((a,b)=>a.date.localeCompare(b.date));save();e.target.reset();closeModal('weightModal');renderAll();toast('Peso guardado')}

function routineForPlan(days,focus,equipment){
 const gym=equipment==='gym';
 const db=equipment==='dumbbells';
 const pick=(gymId,dbId,bwId)=>gym?gymId:db?dbId:bwId;
 const press=pick('press_banca','press_mancuernas','flexiones');
 const pull=pick('jalon_pecho','remo_mancuerna','dominadas');
 const squat=pick('sentadilla','zancadas','sentadilla');
 const hinge=pick('rumano','rumano','hip_thrust');
 const shoulder=pick('press_militar','press_hombro','flexiones');
 const arms1=pick('curl_biceps','curl_martillo','curl_biceps');
 const arms2=pick('extension_triceps','press_frances','fondos');
 const core='plancha';
 let name='',schedule=[];
 if(days<=2){
   name='Full Body 2 días';
   schedule=[
    {day:'mon',name:'Full Body A',exercises:[squat,press,pull,hinge,shoulder,core]},
    {day:'thu',name:'Full Body B',exercises:[hinge,press,pull,squat,arms1,arms2]}
   ];
 }else if(days===3){
   name='Full Body 3 días';
   schedule=[
    {day:'mon',name:'Full Body A',exercises:[squat,press,pull,hinge,'laterales',core]},
    {day:'wed',name:'Full Body B',exercises:[hinge,shoulder,pull,'bulgaras',arms1,arms2]},
    {day:'fri',name:'Full Body C',exercises:['prensa',press,'remo_polea','hip_thrust','face_pull','crunch']}
   ];
 }else if(days===4){
   name='Upper / Lower 4 días';
   schedule=[
    {day:'mon',name:'Upper A',exercises:[press,'remo_barra',shoulder,pull,arms1,arms2]},
    {day:'tue',name:'Lower A',exercises:[squat,hinge,'prensa','curl_femoral','gemelos',core]},
    {day:'thu',name:'Upper B',exercises:['press_inclinado','dominadas','press_hombro','remo_polea','curl_martillo','press_frances']},
    {day:'fri',name:'Lower B',exercises:['peso_muerto','bulgaras','hip_thrust','curl_femoral','gemelos','pallof']}
   ];
 }else if(days===5){
   name='Upper / Lower + Especialización';
   schedule=[
    {day:'mon',name:'Upper fuerza',exercises:[press,'remo_barra',shoulder,pull,arms1]},
    {day:'tue',name:'Lower fuerza',exercises:[squat,'peso_muerto','prensa','gemelos',core]},
    {day:'wed',name:'Push hipertrofia',exercises:['press_inclinado','press_mancuernas','laterales',arms2]},
    {day:'fri',name:'Pull hipertrofia',exercises:['dominadas','remo_mancuerna','jalon_pecho','face_pull',arms1]},
    {day:'sat',name:'Pierna hipertrofia',exercises:['bulgaras','rumano','hip_thrust','curl_femoral','gemelos']}
   ];
 }else{
   name='Push Pull Legs 6 días';
   schedule=structuredClone(TEMPLATES.ppl6.days);
 }
 if(focus==='strength'){
   name+=' · Fuerza';
 }else if(focus==='hypertrophy'){
   name+=' · Hipertrofia';
 }
 return{name,days:schedule};
}
function calculateGoalPlan(g){
 const bmr=10*g.weight+6.25*g.height-5*g.age+(g.sex==='male'?5:-161);
 const tdee=bmr*g.activity;
 const weekly=g.goal==='maintain'?0:g.rate*(g.goal==='lose'?-1:1);
 let delta=weekly*7700/7;
 const maxDeficit=-tdee*.25,maxSurplus=tdee*.15;
 if(g.goal==='lose')delta=Math.max(delta,maxDeficit);
 if(g.goal==='gain')delta=Math.min(delta,maxSurplus);
 let calories=tdee+delta;
 const floor=g.sex==='male'?1500:1200;
 let safetyAdjusted=false;
 if(calories<floor){calories=floor;delta=calories-tdee;safetyAdjusted=true}
 const proteinPerKg=g.goal==='lose'?2.0:g.trainingFocus==='strength'?1.8:g.trainingFocus==='hypertrophy'?1.8:1.6;
 const protein=Math.round(g.weight*proteinPerKg);
 const fats=Math.round(g.weight*(g.goal==='gain'?1:g.goal==='lose'?.8:.9));
 const carbs=Math.max(0,Math.round((calories-protein*4-fats*9)/4));
 const water=(g.weight*35+(g.activity>=1.55?400:0)+(g.activity>=1.725?250:0))/1000;
 let cardioMinutes=0,sessions=0,intensity='';
 if(g.goal==='lose'){
   cardioMinutes=g.experience==='beginner'?120:g.experience==='advanced'?180:150;
   sessions=g.days>=5?3:4; intensity='principalmente zona 2, con 1 sesión opcional más intensa';
 }else if(g.goal==='gain'){
   cardioMinutes=75;sessions=2;intensity='zona 2 suave para salud y recuperación';
 }else{
   cardioMinutes=120;sessions=3;intensity='zona 2, distribuida en sesiones cómodas';
 }
 const current=+g.currentCardio||0;
 cardioMinutes=Math.max(cardioMinutes,current);
 const routine=routineForPlan(g.days,g.trainingFocus,g.equipment);
 let weeks=null,goalDate=null;
 if(g.targetWeight&&g.goal!=='maintain'&&Math.abs(g.targetWeight-g.weight)>.1){
   const actualWeekly=Math.abs(delta)*7/7700;
   if(actualWeekly>0){
     weeks=Math.ceil(Math.abs(g.targetWeight-g.weight)/actualWeekly);
     const d=new Date();d.setDate(d.getDate()+weeks*7);goalDate=d.toISOString().slice(0,10);
   }
 }
 return{bmr,tdee,calories,delta,protein,carbs,fats,water,cardioMinutes,sessions,intensity,routine,weeks,goalDate,safetyAdjusted,createdAt:new Date().toISOString()};
}
function gatherGoalForm(){
 return{
  sex:$('#goalSex').value,age:+$('#goalAge').value,weight:+$('#goalWeight').value,height:+$('#goalHeight').value,
  bodyFat:+$('#goalBodyFat').value||null,activity:+$('#goalActivity').value,goal:$('#goalType').value,
  targetWeight:+$('#goalTargetWeight').value||null,rate:+$('#goalRate').value,days:+$('#goalDays').value,
  experience:$('#goalExperience').value,trainingFocus:$('#goalTrainingFocus').value,equipment:$('#goalEquipment').value,
  cardioPreference:$('#goalCardioPreference').value,currentCardio:+$('#goalCurrentCardio').value
 };
}
function renderPlan(){
 const g=state.goalProfile,p=state.generatedPlan;
 if(g){
   $('#goalSex').value=g.sex;$('#goalAge').value=g.age;$('#goalWeight').value=g.weight;$('#goalHeight').value=g.height;
   $('#goalBodyFat').value=g.bodyFat||'';$('#goalActivity').value=g.activity;$('#goalType').value=g.goal;
   $('#goalTargetWeight').value=g.targetWeight||'';$('#goalRate').value=g.rate;$('#goalDays').value=g.days;
   $('#goalExperience').value=g.experience;$('#goalTrainingFocus').value=g.trainingFocus;$('#goalEquipment').value=g.equipment;
   $('#goalCardioPreference').value=g.cardioPreference;$('#goalCurrentCardio').value=g.currentCardio;
   $$('#goalCards button').forEach(b=>b.classList.toggle('selected',b.dataset.goal===g.goal));
 }
 if(!p)return;
 $('#planCalories').textContent=fmt(p.calories);
 $('#planCalorieDelta').textContent=`${p.delta>0?'+':''}${fmt(p.delta)} kcal frente al mantenimiento${p.safetyAdjusted?' · ajustado':''}`;
 $('#planProtein').textContent=fmt(p.protein);$('#planCarbs').textContent=fmt(p.carbs);$('#planFats').textContent=fmt(p.fats);$('#planWater').textContent=fmt(p.water,1);
 $('#planCardioSessions').textContent=`${p.sessions} sesiones`;
 $('#planCardioMinutes').textContent=`${fmt(p.cardioMinutes)} min / semana`;
 $('#planCardioText').textContent=`Distribuye ${Math.round(p.cardioMinutes/p.sessions)} minutos por sesión, ${p.intensity}.`;
 $('#planRoutineName').textContent=p.routine.name;$('#planRoutineDays').textContent=`${p.routine.days.length} días`;
 $('#planRoutinePreview').innerHTML=p.routine.days.map(d=>`<div class="auto-routine-day"><strong>${DAYS[DAYKEYS.indexOf(d.day)]} · ${d.name}</strong><span>${d.exercises.slice(0,3).map(ex=>EXERCISES[ex]?.name||ex).join(' · ')}${d.exercises.length>3?'…':''}</span></div>`).join('');
 if(p.weeks){
   $('#planWeeks').textContent=`${p.weeks} semanas`;
   $('#planProjectionText').textContent=`Fecha orientativa: ${new Date(p.goalDate+'T12:00:00').toLocaleDateString('es-PE',{month:'long',year:'numeric'})}.`;
 }else{
   $('#planWeeks').textContent='Sin plazo';
   $('#planProjectionText').textContent='Añade un peso objetivo coherente con tu meta para estimar duración.';
 }
 $('#applyPlanBtn').disabled=false;
}
$$('#goalCards button').forEach(b=>b.onclick=()=>{$$('#goalCards button').forEach(x=>x.classList.toggle('selected',x===b));$('#goalType').value=b.dataset.goal});
$('#goalForm').onsubmit=e=>{
 e.preventDefault();const g=gatherGoalForm();
 if(!g.weight||!g.height||!g.age)return toast('Completa peso, estatura y edad');
 if(g.goal==='lose'&&g.targetWeight&&g.targetWeight>=g.weight)return toast('El peso objetivo debe ser menor al actual');
 if(g.goal==='gain'&&g.targetWeight&&g.targetWeight<=g.weight)return toast('El peso objetivo debe ser mayor al actual');
 state.goalProfile=g;state.generatedPlan=calculateGoalPlan(g);save();renderPlan();toast('Plan calculado');
};
$('#applyPlanBtn').onclick=()=>{
 const p=state.generatedPlan,g=state.goalProfile;if(!p||!g)return;
 state.profile.targetCalories=Math.round(p.calories);state.profile.targetProtein=p.protein;state.profile.targetCarbs=p.carbs;state.profile.targetFats=p.fats;
 if(g.targetWeight)state.profile.targetWeight=g.targetWeight;
 const existing=state.routines.find(r=>r.autoGenerated);
 const routine={id:existing?.id||uid(),name:p.routine.name,days:structuredClone(p.routine.days),autoGenerated:true};
 if(existing){const i=state.routines.findIndex(r=>r.id===existing.id);state.routines[i]=routine}else state.routines.push(routine);
 state.activeRoutineId=routine.id;
 save();renderAll();toast('Plan aplicado a nutrición y rutinas');showView('dashboard');
};

function renderSettings(){const p=state.profile;$('#profileName').value=p.name||'';$('#targetWeight').value=p.targetWeight||'';$('#targetCalories').value=p.targetCalories||'';$('#targetProtein').value=p.targetProtein||'';$('#targetCarbs').value=p.targetCarbs||'';$('#targetFats').value=p.targetFats||''}
$('#settingsForm').onsubmit=e=>{e.preventDefault();state.profile={name:$('#profileName').value.trim()||'Atleta',targetWeight:+$('#targetWeight').value||75,targetCalories:+$('#targetCalories').value||2200,targetProtein:+$('#targetProtein').value||160,targetCarbs:+$('#targetCarbs').value||250,targetFats:+$('#targetFats').value||70};save();renderAll();toast('Ajustes guardados')};$('#exportBtn').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download=`FORGE-respaldo-${today()}.json`;a.click();toast('Respaldo exportado')};$('#importInput').onchange=async e=>{try{const x=JSON.parse(await e.target.files[0].text());state={...defaultState,...x};save();if(!state.goalProfile){
 const cw=currentWeight();
 $('#goalWeight').value=cw||75;$('#goalHeight').value=175;$('#goalTargetWeight').value=state.profile.targetWeight||'';
}
applyTheme();renderAll();toast('Respaldo restaurado')}catch{toast('Archivo inválido')}e.target.value=''};$('#resetBtn').onclick=()=>{if(confirm('¿Borrar todos los datos locales?')){localStorage.removeItem(KEY);location.reload()}}
function openModal(id){$('#'+id).hidden=false}function closeModal(id){$('#'+id).hidden=true}$$('[data-close]').forEach(x=>x.onclick=()=>closeModal(x.dataset.close));
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function escAttr(s){return esc(s).replace(/"/g,'&quot;')}
function drawLine(canvas,values,empty,accent){if(!canvas||canvas.offsetParent===null)return;empty.style.display=values.length<2?'grid':'none';if(values.length<2)return;const dpr=devicePixelRatio||1,r=canvas.getBoundingClientRect(),ctx=canvas.getContext('2d');canvas.width=r.width*dpr;canvas.height=r.height*dpr;ctx.scale(dpr,dpr);const w=r.width,h=r.height,p=20,min=Math.min(...values)-.5,max=Math.max(...values)+.5,range=max-min||1,css=getComputedStyle(document.documentElement),line=css.getPropertyValue('--line').trim(),panel=css.getPropertyValue('--panel').trim();ctx.clearRect(0,0,w,h);ctx.strokeStyle=line;for(let i=0;i<4;i++){const y=p+(h-2*p)*i/3;ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(w-p,y);ctx.stroke()}const pts=values.map((v,i)=>({x:p+(w-2*p)*i/(values.length-1),y:p+(max-v)/range*(h-2*p)}));ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.stroke();pts.forEach(q=>{ctx.beginPath();ctx.arc(q.x,q.y,3.5,0,Math.PI*2);ctx.fillStyle=panel;ctx.fill();ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.stroke()})}
function drawBars(canvas,values,empty,accent){if(!canvas||canvas.offsetParent===null)return;empty.style.display=values.length?'none':'grid';if(!values.length)return;const dpr=devicePixelRatio||1,r=canvas.getBoundingClientRect(),ctx=canvas.getContext('2d');canvas.width=r.width*dpr;canvas.height=r.height*dpr;ctx.scale(dpr,dpr);const w=r.width,h=r.height,max=Math.max(...values)*1.1,gap=11,bw=(w-gap*(values.length+1))/values.length;ctx.clearRect(0,0,w,h);ctx.fillStyle=accent;values.forEach((v,i)=>{const bh=(h-25)*v/max;ctx.beginPath();ctx.roundRect(gap+i*(bw+gap),h-bh,bw,bh,7);ctx.fill()})}
function drawAll(){const css=getComputedStyle(document.documentElement),mint=css.getPropertyValue('--mint').trim(),violet=css.getPropertyValue('--violet').trim(),blue=css.getPropertyValue('--blue').trim(),weights=[...state.weights].sort((a,b)=>a.date.localeCompare(b.date)).map(x=>x.weight);drawLine($('#weightChart'),weights,$('#weightChartEmpty'),mint);drawLine($('#progressWeightChart'),weights,$('#progressWeightEmpty'),mint);const ex=state.workouts.at(-1)?.exercise||'press_banca',strength=state.workouts.filter(w=>w.exercise===ex).sort((a,b)=>a.date.localeCompare(b.date)).map(w=>workoutStats(w).e1rm);drawLine($('#strengthChart'),strength,$('#strengthChartEmpty'),violet);const weeks=[];for(let i=5;i>=0;i--){const end=new Date();end.setDate(end.getDate()-i*7);const start=new Date(end);start.setDate(start.getDate()-6);weeks.push(state.workouts.filter(w=>{const d=new Date(w.date+'T12:00:00');return d>=start&&d<=end}).reduce((a,w)=>a+workoutStats(w).volume,0))}drawBars($('#volumeChart'),weeks.filter((v,i)=>v||weeks.some(Boolean)),$('#volumeEmpty'),blue)}
addEventListener('resize',()=>{clearTimeout(window._rz);window._rz=setTimeout(drawAll,120)});
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
if(!state.goalProfile){
 const cw=currentWeight();
 $('#goalWeight').value=cw||75;$('#goalHeight').value=175;$('#goalTargetWeight').value=state.profile.targetWeight||'';
}
applyTheme();renderAll();
})();
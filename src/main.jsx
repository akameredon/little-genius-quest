import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { registerSW } from './registerSW.js';
registerSW();

const WORLDS = [
  { name:'Math Garden', emoji:'🔢', color:'mint', desc:'Count, match and discover numbers.', skill:'Math', questions:[
    {q:'How many apples are here?', visual:'🍎 🍎 🍎', options:['2','3','4'], answer:'3', hint:'Point to each apple and count: one, two, three!', explain:'There are three apples. Great counting!'},
    {q:'What is 2 + 1?', visual:'🧸 🧸 + 🧸', options:['2','3','4'], answer:'3', hint:'Two teddy bears and one more makes how many?', explain:'Two plus one equals three.'},
    {q:'Which group has MORE?', visual:'🍓🍓🍓     🍓🍓', options:['First group','Second group','Same amount'], answer:'First group', hint:'Count the strawberries in each group.', explain:'Three strawberries are more than two.'},
    {q:'What number comes after 4?', visual:'1 · 2 · 3 · 4 · ?', options:['3','5','6'], answer:'5', hint:'Count forward: one, two, three, four…', explain:'Five comes after four.'},
    {q:'Which shape has 3 sides?', visual:'🔺   🟡   🟦', options:['Triangle','Circle','Square'], answer:'Triangle', hint:'Look at the corners and sides.', explain:'A triangle has three sides.'}
  ]},
  { name:'Word Woods', emoji:'📚', color:'peach', desc:'Letters, sounds and little stories.', skill:'Reading', questions:[
    {q:'Which word starts with the B sound?', visual:'🐻   ☀️   🍎', options:['Bear','Sun','Apple'], answer:'Bear', hint:'Say each word slowly: b-b-bear!', explain:'Bear begins with the letter B.'},
    {q:'Which one rhymes with CAT?', visual:'🐱', options:['Hat','Dog','Sun'], answer:'Hat', hint:'Listen to the ending sounds: cat, hat.', explain:'Cat and hat rhyme.'},
    {q:'Choose the missing letter: C _ T', visual:'🐈', options:['A','O','E'], answer:'A', hint:'Say the word aloud: cat.', explain:'C-A-T spells CAT.'},
    {q:'Which one is a book?', visual:'📘   ⚽   🍌', options:['Book','Ball','Banana'], answer:'Book', hint:'Which object has pages and a cover?', explain:'Books have pages that we can read.'},
    {q:'What is the opposite of BIG?', visual:'🐘 ↔ 🐭', options:['Small','Tall','Huge'], answer:'Small', hint:'Think of an elephant and a tiny mouse.', explain:'Small is the opposite of big.'}
  ]},
  { name:'Science Safari', emoji:'🔬', color:'blue', desc:'Explore nature, animals and space.', skill:'Science', questions:[
    {q:'What do plants need to grow?', visual:'🌱 ☀️ 💧', options:['Sunlight and water','Shoes','A television'], answer:'Sunlight and water', hint:'Plants need sunshine and water.', explain:'Sunlight, water, air and nutrients help plants grow.'},
    {q:'Which animal lives in water?', visual:'🐠   🐈   🐓', options:['Fish','Cat','Chicken'], answer:'Fish', hint:'Which animal swims using fins?', explain:'Fish live in water and use gills to breathe.'},
    {q:'What shines in the daytime sky?', visual:'🌞   🌙   ⭐', options:['Sun','Moon only','Stars only'], answer:'Sun', hint:'What gives us daylight and warmth?', explain:'The Sun gives Earth light and heat.'},
    {q:'Which one is made of ice?', visual:'🧊   🧸   🍞', options:['Ice cube','Teddy bear','Bread'], answer:'Ice cube', hint:'Ice is frozen water and feels cold.', explain:'Ice is water in its solid form.'},
    {q:'Where do many birds lay their eggs?', visual:'🐦 🪺', options:['In a nest','In a shoe','In a pond always'], answer:'In a nest', hint:'Think of a safe place made from twigs.', explain:'Many birds use nests to hold their eggs.'}
  ]},
  { name:'Puzzle Planet', emoji:'🧩', color:'lilac', desc:'Patterns, memory and clever thinking.', skill:'Logic', questions:[
    {q:'What comes next?', visual:'🔴 🔵 🔴 🔵 ?', options:['🔴','🟢','🟡'], answer:'🔴', hint:'The colors take turns: red, blue, red, blue…', explain:'Red comes next in this repeating pattern.'},
    {q:'Which one does NOT belong?', visual:'🍎 🍌 🚗 🍇', options:['Car','Apple','Banana'], answer:'Car', hint:'Three are things you can eat.', explain:'The car is different because it is not a fruit.'},
    {q:'A bird has 2 legs. How many legs do 2 birds have?', visual:'🐦 + 🐦', options:['2','4','6'], answer:'4', hint:'Count two legs for each bird.', explain:'Two birds have four legs altogether.'},
    {q:'Which shape comes next?', visual:'🟦 🟦 🔺 🟦 🟦 🔺 ?', options:['🟦','🔺','🟡'], answer:'🟦', hint:'Look at the group of two squares and one triangle.', explain:'The pattern repeats: square, square, triangle.'},
    {q:'Which can roll?', visual:'⚽   📦   📚', options:['Ball','Box','Book'], answer:'Ball', hint:'Which object is round?', explain:'A round ball can roll across the floor.'}
  ]},
  { name:'Kindness Kingdom', emoji:'💖', color:'pink', desc:'Feelings, friendship and everyday kindness.', skill:'Emotions', questions:[
    {q:'Your friend looks sad. What could you do?', visual:'🧒 💗 🧒', options:['Ask if they are okay','Laugh at them','Walk away every time'], answer:'Ask if they are okay', hint:'Imagine how you would like a friend to treat you.', explain:'Kind words and listening can help a friend feel supported.'},
    {q:'How can you show you are listening?', visual:'👂 💬', options:['Look and listen','Shout over them','Run away'], answer:'Look and listen', hint:'Give the person a chance to speak.', explain:'Listening shows that we care about what someone says.'},
    {q:'You made a mistake. What can you do?', visual:'🌱 💪', options:['Try again','Give up forever','Hide every mistake'], answer:'Try again', hint:'Learning takes practice.', explain:'Mistakes help us learn. Trying again builds confidence.'},
    {q:'Someone says STOP during a game. What should you do?', visual:'✋ 🛑', options:['Stop and listen','Keep going','Push them'], answer:'Stop and listen', hint:'Everyone deserves to feel safe.', explain:'We respect people’s boundaries and stop when asked.'},
    {q:'Your friend shares a toy. What can you say?', visual:'🧸 🤝', options:['Thank you!','Give me everything','Nothing nice'], answer:'Thank you!', hint:'Think of words that show appreciation.', explain:'Saying thank you shows gratitude.'}
  ]}
];

const DEFAULT = { childName:'', stars:0, points:0, attempts:0, correct:0, completed:[], answers:{}, dailyGoal:5, difficulty:'Gentle', sound:true };
function readSaved() {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem('lgq-progress') || '{}') }; }
  catch { return DEFAULT; }
}
function App() {
  const [saved,setSaved] = useState(readSaved);
  const [tab,setTab] = useState('home');
  const [worldName,setWorldName] = useState(WORLDS[0].name);
  const [index,setIndex] = useState(0);
  const [chosen,setChosen] = useState(null);
  const [hint,setHint] = useState(false);
  const [parentUnlocked,setParentUnlocked] = useState(false);
  const [pin,setPin] = useState('');
  const [pinError,setPinError] = useState('');
  const [installPrompt,setInstallPrompt] = useState(null);
  const [installed,setInstalled] = useState(false);
  const [message,setMessage] = useState('');
  const world = WORLDS.find(w=>w.name===worldName) || WORLDS[0];
  const question = world.questions[index % world.questions.length];
  const uniqueCompleted = saved.completed.length;
  const progress = Math.min(100,Math.round(uniqueCompleted / saved.dailyGoal * 100));
  const worldProgress = useMemo(()=>WORLDS.map(w=>({ ...w, count:saved.completed.filter(x=>x.startsWith(w.name+'-')).length })),[saved.completed]);

  useEffect(()=>{ localStorage.setItem('lgq-progress',JSON.stringify(saved)); },[saved]);
  useEffect(()=>{
    const handler = e => { e.preventDefault(); setInstallPrompt(e); };
    const installedHandler = () => { setInstalled(true); setInstallPrompt(null); };
    window.addEventListener('beforeinstallprompt',handler);
    window.addEventListener('appinstalled',installedHandler);
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true);
    return ()=>{window.removeEventListener('beforeinstallprompt',handler);window.removeEventListener('appinstalled',installedHandler);};
  },[]);
  const update = patch => setSaved(old=>({...old,...patch}));
  const startWorld = name => {setWorldName(name);setIndex(0);setChosen(null);setHint(false);setTab('play');setMessage('');};
  const answer = option => {
    if (chosen !== null) return;
    setChosen(option);
    const key = world.name+'-'+(index % world.questions.length);
    if (option === question.answer) {
      update({attempts:saved.attempts+1,correct:saved.correct+1,stars:saved.stars+1,points:saved.points+10,completed:saved.completed.includes(key)?saved.completed:[...saved.completed,key],answers:{...saved.answers,[key]:(saved.answers[key]||0)+1}});
      setMessage('correct');
    } else {
      update({attempts:saved.attempts+1,answers:{...saved.answers,[key]:(saved.answers[key]||0)+1}});
      setMessage('try');
    }
  };
  const next = () => {setIndex((index+1)%world.questions.length);setChosen(null);setHint(false);setMessage('');};
  const askParent = () => {setPin('');setPinError('');setParentUnlocked(false);setTab('parent-lock');};
  const unlockParent = () => {
    if (pin === '2468') {setParentUnlocked(true);setTab('parent');setPinError('');}
    else setPinError('That code did not match. Try again.');
  };
  const install = async () => {
    if (installPrompt) { await installPrompt.prompt(); setInstallPrompt(null); }
    else setTab('install-help');
  };

  return <div className="app-shell">
    <header className="top">
      <div className="brand"><div className="brand-icon">🧠</div><div><h1>Little Genius Quest</h1><p>Small steps. Big discoveries.</p></div></div>
      <div className="star-pill">⭐ <strong>{saved.stars}</strong></div>
    </header>
    <section className="welcome-card">
      <div className="avatar">🧑‍🚀</div>
      <div className="welcome-copy"><strong>{saved.childName.trim() || 'Little Explorer'}</strong><span>Your next great discovery awaits!</span></div>
      <div className="played-pill">{uniqueCompleted} played</div>
      <div className="goal-line"><div className="goal-track"><div style={{width:`${progress}%`}} /></div><span>{uniqueCompleted}/{saved.dailyGoal}</span></div>
      <small className="goal-caption">Adventure progress on this device</small>
    </section>

    <nav className="tabs" aria-label="Main navigation">
      <button className={['home'].includes(tab)?'active':''} onClick={()=>setTab('home')}>🏠<span>Home</span></button>
      <button className={['worlds','play'].includes(tab)?'active':''} onClick={()=>setTab('worlds')}>🧭<span>Worlds</span></button>
      <button className={['parent','parent-lock','install-help'].includes(tab)?'active':''} onClick={askParent}>👨‍👩‍👧<span>Grown-ups</span></button>
    </nav>

    <main>
      {tab==='home' && <div className="page">
        <div><h2>Ready for an adventure?</h2><p className="muted">Choose a world, explore at your own pace, and earn stars for new discoveries.</p></div>
        <section className="hero">
          <div className="hero-top"><div><span className="eyebrow">TODAY'S ADVENTURE</span><h3>The Curious Explorer</h3><p>Try {saved.dailyGoal} little challenges. Every try helps your brain grow!</p></div><div className="rainbow">🌈</div></div>
          <button className="primary" onClick={()=>startWorld(worldName)}>Let’s play! <span>→</span></button>
        </section>
        <h3 className="section-heading">Choose your learning world</h3>
        <div className="world-grid">{WORLDS.map(w=><button className={`world-card ${w.color}`} key={w.name} onClick={()=>startWorld(w.name)}><span className="world-emoji">{w.emoji}</span><strong>{w.name}</strong><span>{w.desc}</span><small>Explore ↗</small></button>)}</div>
        <aside className="kindness-note"><strong>💚 A little reminder</strong><p>You don't have to know everything. Asking questions, being kind, and trying again help your brain grow!</p></aside>
      </div>}

      {tab==='worlds' && <div className="page"><h2>Explore the learning worlds</h2><p className="muted">Each world has five challenges. Replay any world to practise again.</p><div className="world-list">{WORLDS.map(w=>{const count=saved.completed.filter(x=>x.startsWith(w.name+'-')).length;return <button className={`world-row ${w.color}`} key={w.name} onClick={()=>startWorld(w.name)}><span className="world-emoji">{w.emoji}</span><span className="world-row-copy"><strong>{w.name}</strong><span>{w.desc}</span><small>{count}/5 challenges completed · {w.skill}</small></span><span className="chevron">›</span></button>})}</div></div>}

      {tab==='play' && <div className="page play-page">
        <div className="play-heading"><button className="back-button" onClick={()=>setTab('worlds')} aria-label="Back to worlds">←</button><div><h2>{world.emoji} {world.name}</h2><p className="muted">Challenge {(index%world.questions.length)+1} of {world.questions.length}</p></div><span className="tiny-stars">⭐ {saved.stars}</span></div>
        <div className="question-progress">{world.questions.map((_,i)=><span key={i} className={i<index%world.questions.length?'passed':i===index%world.questions.length?'current':''}/>)}</div>
        <section className={`question-card ${world.color}`}><span className="eyebrow">{world.skill.toUpperCase()} TIME</span><h3>{question.q}</h3><div className="question-visual">{question.visual}</div>{hint&&<p className="hint-box">💡 Hint: {question.hint}</p>}</section>
        <div className="answer-list">{question.options.map((option,i)=><button key={option} disabled={chosen!==null} className={`answer ${chosen!==null&&option===question.answer?'right':''} ${chosen===option&&option!==question.answer?'wrong':''}`} onClick={()=>answer(option)}><span className="answer-letter">{['A','B','C'][i]}</span><strong>{option}</strong>{chosen!==null&&option===question.answer&&<span className="check">✓</span>}</button>)}</div>
        {chosen===null?<div className="action-row"><button className="secondary" onClick={()=>setHint(!hint)}>💡 {hint?'Hide hint':'Give me a hint'}</button><button className="secondary" onClick={()=>setTab('worlds')}>Change world</button></div>:<section className={`feedback ${message==='correct'?'good':'gentle'}`}><h3>{message==='correct'?'Hooray! You did it! 🌟':'Good try, little explorer! 💛'}</h3><p>{question.explain}</p>{message==='try'&&<p>The correct answer is <strong>{question.answer}</strong>. It's okay to learn as you go!</p>}<button className="primary" onClick={next}>Next challenge →</button></section>}
        <p className="learning-tip">Grown-up tip: ask your child how they figured out the answer.</p>
      </div>}

      {tab==='parent-lock' && <div className="page parent-page"><div className="parent-hero"><span>🔐</span><h2>Grown-ups' corner</h2><p className="muted">A small grown-up check helps keep settings away from little hands.</p></div><form onSubmit={e=>{e.preventDefault();unlockParent();}} className="pin-form"><label htmlFor="parent-pin">Enter parent code</label><input id="parent-pin" type="password" inputMode="numeric" pattern="[0-9]*" maxLength="4" value={pin} onChange={e=>setPin(e.target.value)} placeholder="4-digit code" autoComplete="off"/><p className="muted tiny">First-time demo code: 2468. Change this before a public launch.</p>{pinError&&<p className="error">{pinError}</p>}<button className="primary" type="submit">Unlock parent area</button><button className="secondary full" type="button" onClick={()=>setTab('home')}>Back to game</button></form></div>}

      {tab==='parent' && <div className="page parent-page">
        <div className="play-heading"><div><h2>📊 Learning snapshot</h2><p className="muted">Progress saved on this device.</p></div><button className="secondary small-button" onClick={()=>setTab('home')}>Done</button></div>
        <section className="settings-card"><label htmlFor="child-name">Child's nickname (optional)</label><input id="child-name" value={saved.childName} maxLength="24" onChange={e=>update({childName:e.target.value})} placeholder="e.g. Little Star"/><p className="muted tiny">Use a nickname rather than a full name.</p></section>
        <div className="stats-grid"><div className="stat mint"><span>✓</span><strong>{uniqueCompleted}</strong><small>Unique challenges completed</small></div><div className="stat peach"><span>⭐</span><strong>{saved.stars}</strong><small>Stars earned</small></div><div className="stat blue"><span>✓✓</span><strong>{saved.correct}</strong><small>Correct answers</small></div><div className="stat lilac"><span>↻</span><strong>{saved.attempts}</strong><small>Answer attempts</small></div></div>
        <section className="settings-card"><h3>Personalise play</h3><label htmlFor="goal">Daily challenge goal</label><select id="goal" value={saved.dailyGoal} onChange={e=>update({dailyGoal:Number(e.target.value)})}><option value="3">3 challenges — short and sweet</option><option value="5">5 challenges — balanced play</option><option value="10">10 challenges — longer adventure</option></select><label htmlFor="difficulty">Challenge style</label><select id="difficulty" value={saved.difficulty} onChange={e=>update({difficulty:e.target.value})}><option>Gentle</option><option>Explorer</option></select><p className="muted tiny">Gentle and Explorer are preference labels in this starter version; automatic adaptive difficulty is not yet enabled.</p></section>
        <h3 className="section-heading">Learning areas</h3><div className="area-list">{worldProgress.map(w=><div className="area-row" key={w.name}><div className="area-label"><span>{w.emoji} {w.skill}</span><small>{w.count}/5</small></div><div className="area-track"><div style={{width:`${w.count/5*100}%`}}/></div></div>)}</div>
        <aside className="kindness-note"><strong>Ideas for learning together</strong><p>• Count toys, fruit or stairs together.</p><p>• Read a picture book and ask what might happen next.</p><p>• Explore a leaf, shadow or magnet with adult supervision.</p><p>• Praise curiosity and effort, not just correct answers.</p></aside>
        <button className="secondary full" onClick={()=>{if(confirm('Reset all progress saved on this device? This cannot be undone.')){localStorage.removeItem('lgq-progress');setSaved(DEFAULT);setTab('home');}}}>Reset all progress</button>
        <p className="muted tiny">This starter app stores progress locally on this device. It does not create an account or send the child's progress to a server.</p>
      </div>}

      {tab==='install-help' && <div className="page"><h2>Install Little Genius Quest</h2><p className="muted">Add the game to your home screen for an app-like experience.</p><section className="install-card"><h3>📱 iPhone or iPad</h3><ol><li>Open this website in Safari.</li><li>Tap the Share button.</li><li>Choose “Add to Home Screen”.</li><li>Tap “Add”.</li></ol></section><section className="install-card"><h3>🤖 Android</h3><ol><li>Open this website in Chrome.</li><li>Tap the three-dot menu.</li><li>Choose “Install app” or “Add to Home screen”.</li></ol></section><p className="muted tiny">Install options appear after the app is hosted over HTTPS. Offline caching is included.</p><button className="secondary full" onClick={()=>setTab('home')}>Back home</button></div>}
    </main>
    <footer><span>🌱 Learn by wondering.</span><button onClick={install} className="install-button">{installed?'✓ Installed':installPrompt?'⬇ Install app':'＋ Add to home screen'}</button></footer>
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);

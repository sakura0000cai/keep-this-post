/* 《请不要删除这条帖子》核心：存档、游戏内时间、音效、通用组件。
   人物、学校、域名均为虚构，无任何外部请求。 */
(function(){
  const KEY='lc7-arg-v2';
  const G=window.G={www:{},bbs:{}};

  G.initial=()=>({v:2,flags:{},notes:[],chat:[],draft:'',tries:{},read:{},timeline:'original',sound:true,last:{www:'/www/index',bbs:'/bbs/index'},t0:Date.now()});
  G.state=G.initial();
  try{
    const o=JSON.parse(localStorage.getItem(KEY));
    if(o&&o.v===2)G.state={...G.state,...o,flags:{...o.flags},last:{...G.state.last,...o.last}};
  }catch(e){}
  G.save=()=>{try{localStorage.setItem(KEY,JSON.stringify(G.state))}catch(e){}};
  G.reset=()=>{G.state=G.initial();G.save()};
  G.flag=k=>!!G.state.flags[k];
  G.set=(k,v=true)=>{G.state.flags[k]=v;G.save()};

  G.$=s=>document.querySelector(s);
  G.esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  G.a=(path,text,cls='')=>`<a href="#${path}"${cls?` class="${cls}"`:''}>${text}</a>`;
  G.go=path=>{if(location.hash==='#'+path)G.render();else location.hash=path};
  // 数据里的纯文本：空行分段，单换行折行
  G.para=t=>t.split(/\n\n+/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('');

  // 游戏内时间：从 2026-11-14 23:17 起随真实时间走，停在 23:58:59，不会因超时失败
  G.pad=n=>String(n).padStart(2,'0');
  G.now=()=>{const base=new Date(2026,10,14,23,17,0).getTime();return new Date(Math.min(base+(Date.now()-G.state.t0),base+41*60000+59000))};
  G.stamp=(d=G.now())=>`${d.getFullYear()}-${G.pad(d.getMonth()+1)}-${G.pad(d.getDate())} ${G.pad(d.getHours())}:${G.pad(d.getMinutes())}`;
  G.longDate=(d=G.now())=>`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 星期${'日一二三四五六'[d.getDay()]} ${G.pad(d.getHours())}:${G.pad(d.getMinutes())}:${G.pad(d.getSeconds())}`;

  G.toast=s=>{const t=G.$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(G.toast.t);G.toast.t=setTimeout(()=>t.classList.remove('show'),3200)};
  G.modal=html=>{G.$('#dialog-content').innerHTML=html;const d=G.$('#dialog');if(!d.open)d.showModal()};
  G.closeModal=()=>G.$('#dialog').close();
  G.note=(id,text)=>{
    if(G.state.notes.some(n=>n.id===id))return;
    G.state.notes.push({id,text,at:G.stamp()});G.save();
    G.sound('note');G.toast('已记入调查笔记');G.updateCount&&G.updateCount();
  };
  // 表单反馈
  G.fb=(form,msg,ok)=>{const el=form.querySelector('.feedback');if(el){el.textContent=msg;el.className='feedback'+(ok?' ok':' bad')}if(!ok)G.sound('error')};
  // 宽松比对：去掉空白与标点
  G.norm=s=>String(s||'').replace(/[\s，。！？、,.!?“”"'：:；;（）()《》<>【】\-—_]/g,'').toLowerCase();

  // 音效：WebAudio 合成，无外部素材
  let ctx,hum;
  function ac(){
    if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}
    if(ctx.state==='suspended')ctx.resume();
    return ctx;
  }
  function tone(freq,dur,type='sine',vol=.06,when=0){
    const c=ac();if(!c)return;
    const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+when;
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.02);
  }
  G.sound=kind=>{
    if(!G.state.sound)return;
    if(kind==='click')tone(1900,.025,'square',.012);
    else if(kind==='note'){tone(880,.12);tone(1320,.2,'sine',.05,.1)}
    else if(kind==='error')tone(150,.22,'sawtooth',.035);
    else if(kind==='msg'){tone(660,.1,'triangle',.06);tone(990,.1,'triangle',.06,.12);tone(1320,.3,'triangle',.05,.24)}
    else if(kind==='glitch'){for(let i=0;i<6;i++)tone(180+Math.random()*1900,.04,'square',.018,i*.05)}
    else if(kind==='unlock'){tone(523,.12,'triangle',.05);tone(784,.12,'triangle',.05,.1);tone(1046,.25,'triangle',.05,.2)}
  };
  // 异常帖子页面的低频底噪
  G.hum=on=>{
    if(on&&G.state.sound&&!hum){
      const c=ac();if(!c)return;
      const o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();
      o.frequency.value=55;o2.frequency.value=55.8;g.gain.value=0;
      g.gain.linearRampToValueAtTime(.02,c.currentTime+2.5);
      o.connect(g);o2.connect(g);g.connect(c.destination);o.start();o2.start();hum={o,o2,g,c};
    }else if(!on&&hum){
      const h=hum;hum=null;h.g.gain.linearRampToValueAtTime(0,h.c.currentTime+.6);
      setTimeout(()=>{h.o.stop();h.o2.stop()},700);
    }
  };
})();

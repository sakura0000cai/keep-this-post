/* 浏览器外壳：标签页、地址栏、路由、任务栏。 */
(function(){
  const {$}=G;
  const HOME='/www/index';

  function parse(){
    const h=location.hash.slice(1)||HOME;
    const [,host='www',name='index',...args]=h.split('/');
    return {h,host,name,args:args.map(x=>{try{return decodeURIComponent(x)}catch(e){return x}})};
  }

  function errorPage(addr){
    return {title:'无法显示网页',url:addr,html:`<div class="errpage"><h1>无法显示该网页</h1>
      <p>找不到服务器 <b>${G.esc(addr)}</b>，或该地址未收录在本地镜像中。</p>
      <ul><li>请检查地址是否拼写正确。</li><li>本镜像只收录临川七中（lcqz.edu.cn）及其子站点。</li><li>点击“后退”按钮返回上一页。</li></ul></div>`};
  }

  G.render=()=>{
    clearInterval(G.slideTimer);G.hum(false);
    const r=parse();
    let pg;
    if(r.host==='err')pg=errorPage(r.args.join('/')||r.name);
    else{
      const mod=r.host==='bbs'?G.bbs:G.www;
      if(r.host==='bbs'&&!G.flag('forumFound'))found();
      pg=(mod[r.name]||mod.notfound)(...r.args);
      if(r.host==='bbs'||r.host==='www'){G.state.last[r.host]=r.h;G.save()}
    }
    $('#page').innerHTML=pg.html;
    $('#addr').value=pg.url;
    document.title=pg.title;
    $('#page-ico').textContent=r.host==='bbs'?'☺':'▣';
    tabs(r.host,pg.title);
    tick();
    if(r.host==='www')G.www.bind();
    if(r.host==='bbs')G.bbs.bind();
    G.updateCount();
  };

  function found(){
    G.set('forumFound');G.sound('glitch');
    G.note('forum','旧论坛还能打开：bbs.lcqz.edu.cn。页面右上角叫我“guest_0714”。');
  }

  // 当前标签显示当前页面标题，另一个显示该站上次停留的页面名
  const lastTitle={www:'临川市第七中学',bbs:'榕园社区'};
  function tabs(cur,title){
    if(cur==='www'||cur==='bbs')lastTitle[cur]=title;
    const t=[['www',cur==='err'?title:lastTitle.www]];
    if(G.flag('forumFound'))t.push(['bbs',lastTitle.bbs]);
    $('#tabs').innerHTML=t.map(([h,n])=>`<button class="${h===cur||(cur==='err'&&h==='www')?'active':''}" data-tab="${h}"><i>${h==='bbs'?'☺':'▣'}</i>${n}</button>`).join('');
    $('#tabs').querySelectorAll('button').forEach(b=>b.onclick=()=>G.go(G.state.last[b.dataset.tab]));
  }

  // 地址栏：只认 lcqz.edu.cn 的主站和 bbs 子站
  $('#addr-form').onsubmit=e=>{
    e.preventDefault();
    const raw=$('#addr').value.trim();
    const v=raw.toLowerCase().replace(/^\w+:\/\//,'').replace(/\/+$/,'');
    const host=v.split('/')[0];
    if(host==='bbs.lcqz.edu.cn')return G.go('/bbs/index');
    if(host==='www.lcqz.edu.cn'||host==='lcqz.edu.cn')return G.go(HOME);
    if(!v)return;
    G.sound('error');G.go('/err/'+encodeURIComponent(raw));
  };
  $('#addr').onfocus=()=>$('#addr').select();
  $('#back').onclick=()=>history.back();
  $('#fwd').onclick=()=>history.forward();
  $('#reload').onclick=()=>G.render();
  $('#home').onclick=()=>G.go(HOME);

  // 游戏内时钟
  function tick(){
    const d=G.now();
    document.querySelectorAll('[data-clock]').forEach(el=>{
      const k=el.dataset.clock;
      el.textContent=k==='long'?G.longDate(d):k==='bbs'?G.stamp(d):`2026/11/14　${G.pad(d.getHours())}:${G.pad(d.getMinutes())}`;
    });
  }
  setInterval(tick,1000);

  // 任务栏
  G.updateCount=()=>{$('#count').textContent=G.state.notes.length};
  function showNotes(){
    const n=G.state.notes;
    G.modal(`<h2>调查笔记</h2><p class="caption">只记录你已经亲眼看到的东西。</p>${n.length?`<ol>${n.map(x=>`<li>${G.esc(x.text)} <small>${x.at.slice(11)}</small></li>`).join('')}</ol>`:'<p>还没有记录。先看看学校官网的通知公告。</p>'}`);
  }
  $('#notes').onclick=showNotes;
  $('#help').onclick=()=>{
    const tips=G.story.hints();let level=0;
    G.modal(`<h2>卡住了？</h2><p id="hint-text">${tips[0]}</p><button class="btn ghost" id="more-hint">再明确一点</button>`);
    $('#more-hint').onclick=()=>{level=Math.min(level+1,tips.length-1);$('#hint-text').textContent=tips[level];if(level===tips.length-1)$('#more-hint').disabled=true};
  };
  function muteLabel(){$('#mute').textContent=G.state.sound?'🔊 音效':'🔇 静音'}
  $('#mute').onclick=()=>{G.state.sound=!G.state.sound;G.save();muteLabel();if(!G.state.sound)G.hum(false);else G.render()};
  $('#about').onclick=()=>G.modal(`<h2>请不要删除这条帖子 · 试玩版</h2>
    <p>你是 2026 年的陈默。母校的旧论坛将在今晚零点关闭。</p>
    <p>在浏览器里查看两个网站：阅读、搜索、比对、登录、输入。可以在地址栏输入网址。看到的线索会自动记进“调查笔记”。卡住时点“卡住了？”，提示分三级。</p>
    <p class="caption">试玩版约 30–45 分钟，包含前三幕。进度保存在当前浏览器。时间不会真的走到零点，你不会因为太慢而失败。<br>人物、学校、网址均为虚构。</p>`);
  $('#reset').onclick=()=>{
    G.modal(`<h2>重新开始？</h2><p>这会清除调查笔记和全部进度。</p><button class="btn" id="confirm-reset">清除并重新开始</button>`);
    $('#confirm-reset').onclick=()=>{G.reset();G.closeModal();muteLabel();location.hash=HOME;G.render();$('#intro').hidden=false};
  };
  $('#close-dialog').onclick=G.closeModal;
  $('#dialog').onclick=e=>{if(e.target===$('#dialog'))G.closeModal()};

  // 点击音
  document.addEventListener('click',e=>{if(e.target.closest('a,button'))G.sound('click')});
  // 链接悬停时状态栏显示地址
  document.addEventListener('mouseover',e=>{const l=e.target.closest('#page a[href]');$('#status').textContent=l?l.getAttribute('href').replace('#/www/','http://www.lcqz.edu.cn/').replace('#/bbs/','http://bbs.lcqz.edu.cn/'):'完成'});

  window.addEventListener('hashchange',()=>{G.render();$('#viewport').scrollTop=0});
  $('#start').onclick=()=>{$('#intro').hidden=true;G.set('started');G.sound('click');G.render()};
  if(!G.flag('started'))$('#intro').hidden=false;
  muteLabel();
  G.render();
})();

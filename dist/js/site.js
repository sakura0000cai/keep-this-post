/* 页面入口：官网与论坛各自加载本文件，按 <body data-site> 决定渲染哪个站。 */
(function(){
  const site=document.body.dataset.site;
  const mod=G[site];

  // 地址带 ?reset 时清空存档，用于重新开始
  if(/[?&]reset\b/.test(location.search)){G.reset();history.replaceState(null,'',location.pathname)}

  G.render=()=>{
    clearInterval(G.slideTimer);
    G.load();
    const [,name='index',...args]=(location.hash.slice(1)||'/index').split('/');
    const pg=(mod[name]||mod.notfound)(...args.map(x=>{try{return decodeURIComponent(x)}catch(e){return x}}));
    document.getElementById('page').innerHTML=pg.html;
    document.title=pg.title;
    tick();
    mod.bind();
  };

  // 页面上的游戏内时钟
  function tick(){
    const d=G.now();
    document.querySelectorAll('[data-clock]').forEach(el=>{el.textContent=el.dataset.clock==='long'?G.longDate(d):G.stamp(d)});
  }
  setInterval(tick,1000);

  window.addEventListener('hashchange',()=>{G.render();window.scrollTo(0,0)});
  // 另一个站点的标签页改了存档时，这边同步刷新（不打断正在输入的表单）
  window.addEventListener('storage',e=>{if(e.key&&e.key.startsWith('lc7-arg')&&!document.activeElement.matches('input,textarea'))G.render()});
  G.render();
})();

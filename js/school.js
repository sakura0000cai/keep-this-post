/* 临川七中官网页面。风格：2010 年前后的高校/中学门户，红色主调。 */
(function(){
  const {a,esc}=G,S=G.school,W=p=>'/'+p;
  const nav=[['index','首　页'],['about','学校概况'],['list/news','新闻动态'],['list/notice','通知公告'],['teach','教育教学'],['gallery','校园风采'],['classes','班级空间'],['alumni','校友之家']];

  function head(){
    return `<div class="sch-banner">${G.art.banner()}</div>
    <div class="sch-nav">${nav.map(([p,t],i)=>(i?'<span>|</span>':'')+a(W(p),t)).join('')}</div>`;
  }
  function foot(){
    return `<div class="sch-links">
      <span class="lk l1">临川市教育局</span><span class="lk l2">中小学教育资源网</span><span class="lk l3">平安校园</span>
      <span class="lk l4">阳光体育</span><span class="lk l5">七中校友会</span><span class="lk l6">青少年心理援助</span></div>
    <div class="sch-foot">地址：临川市文昌路 77 号　　邮编：344000　　电话：8806 1958　　临川市第七中学 版权所有<br>
    <small>本站为校史只读镜像 · 站内学校、人物与事件均属虚构</small></div>`;
  }
  const panel=(title,body,more,cls='')=>`<div class="panel ${cls}"><div class="panel-h"><b>${title}</b>${more?a(more,'更多&gt;&gt;','more'):''}</div><div class="panel-b">${body}</div></div>`;
  const row=x=>`<li>${a(W('article/'+x.id),esc(x.title))}<span>${x.date.slice(5)}</span></li>`;
  const rowFull=x=>`<li>${a(W('article/'+x.id),esc(x.title))}${x.archive?'<em>[存档]</em>':''}<span>${x.date}</span></li>`;

  function searchBox(q=''){
    return `<form class="sch-search" data-form="www-search"><input name="q" value="${esc(q)}" aria-label="站内搜索"><button>搜 索</button></form>`;
  }
  function leftCommon(){
    return panel('最新通知',`<ul class="sch-list">${S.list('notice').slice(0,6).map(row).join('')}</ul>`,W('list/notice'),'tall')+
      panel('友情链接',`<select><option>======相关部门======</option><option>临川市教育局</option><option>临川市教研室</option></select>
      <select><option>======兄弟学校======</option><option>临川一中</option><option>临川三中</option><option>临川实验中学</option></select>
      <select><option>======校内系统======</option><option>新版门户（建设中）</option><option>教务系统</option><option>图书馆查询</option><option disabled>校园论坛（已撤下）</option></select>`,'');
  }
  function page(title,crumb,content,sub){
    const side=sub?panel(sub[0],`<ul class="sub-nav">${sub[1].map(([p,t])=>`<li>${a(W(p),t)}</li>`).join('')}</ul>`,''):'';
    return `<div class="sch">${head()}<div class="sch-body"><div class="sch-left"><div class="sch-date" data-clock="long"></div>${searchBox()}${side}${leftCommon()}</div>
    <div class="sch-main"><div class="panel"><div class="panel-h"><b>${title}</b><span class="crumb">当前位置：${a(W('index'),'首页')} &gt; ${crumb}</span></div><div class="panel-b content">${content}</div></div></div></div>${foot()}</div>`;
  }
  const newsSub=['新闻中心',[['list/news','新闻动态'],['list/notice','通知公告']]];
  const aboutSub=['学校概况',[['about','学校简介'],['teach','教育教学'],['classes','班级空间']]];

  G.www.index=()=>{
    const thumbs=Array.from({length:G.art.sceneCount},(_,i)=>`<button class="thumb${i?'':' on'}" data-slide="${i}">${G.art.scene(i)}</button>`).join('');
    const html=`<div class="sch">${head()}
    <div class="sch-marquee"><b>【公告】</b><div><span>校园信息系统升级期间，部分历史栏目以只读镜像形式保留，给您带来的不便敬请谅解。　　★　　2026 年校友返校日报名进行中。　　★　　冬季消防安全检查将于 11 月上旬开展。</span></div></div>
    <div class="sch-body">
      <div class="sch-left"><div class="sch-date" data-clock="long"></div>${searchBox()}${leftCommon()}
        <div class="sch-counter">您是本站第 <b>0 2 1 3 4 7 8</b> 位访客</div></div>
      <div class="sch-main">
        ${panel('学校简介',`<div class="sch-intro"><div class="slides"><div class="slide" id="slide">${G.art.scene(0)}</div><div class="thumbs">${thumbs}</div></div>
          <p>　　临川市第七中学始建于 1958 年，是省级示范性普通高级中学。学校占地 126 亩，现有教学班 48 个，在校学生两千余人。校园内一株百年老榕树，见证了一届又一届七中学子的成长。学校秉承“明德、笃学、求真”的校训，坚持“为每一个学生的终身发展奠基”的办学理念，先后获得省文明校园、市平安校园等荣誉称号……</p></div>`,W('about'))}
        <div class="two">
          ${panel('新闻动态',`<ul class="sch-list">${S.list('news').slice(0,7).map(row).join('')}</ul>`,W('list/news'))}
          ${panel('校园风采',`<ul class="sch-list plain"><li>${a(W('photo/1908'),'2019 第十三届校园文化节')}</li><li>${a(W('gallery'),'2026 秋季田径运动会')}</li><li>${a(W('gallery'),'校园四季 · 老榕树')}</li><li>${a(W('classes'),'班级空间 · 历届班级主页')}</li><li>${a(W('alumni'),'校友之家 · 返校日')}</li></ul>`,W('gallery'))}
        </div>
      </div>
    </div>${foot()}</div>`;
    return {title:'临川市第七中学',html};
  };

  G.www.about=()=>({title:'学校简介 - 临川市第七中学',html:page('学校简介','学校概况',`
    <h3 class="art-title">学校简介</h3>
    <p>　　临川市第七中学始建于 1958 年，前身为临川县文昌中学，1984 年更名为临川市第七中学，2006 年被评为省级示范性普通高级中学。</p>
    <p>　　学校现有教职工 186 人，其中高级教师 62 人。学校坚持“明德、笃学、求真”的校训，形成了“严谨、团结、求实、创新”的校风。</p>
    <p><b>校园建筑</b></p>
    <p>　　教学主楼（A 楼）：1999 年落成，五层。<br>　　艺术楼（B 楼）：2005 年落成，设播音室、音乐教室、美术教室。<br>　　图书馆：2010 年落成，藏书 12 万册。<br>　　东侧医务室：一层为医务室，二层为心理咨询室。<br>　　旧实验楼：1986 年建成，四层砖混结构。新实验楼启用后，旧实验楼于 <b>2020 年</b>停止使用并封闭，现待改造。</p>
    <p>　　校园中央的老榕树树龄逾百年，是七中的标志，也是历届毕业生合影的地方。</p>`,aboutSub)});

  G.www.teach=()=>({title:'教育教学 - 临川市第七中学',html:page('教育教学','教育教学',`
    <p>　　学校实行年级组管理，高一、高二年级各 16 个教学班，高三年级 16 个教学班。</p>
    <p>　　学校开设文学社、广播站、合唱团、摄影社、篮球社、机器人社等 23 个学生社团。每学年举办校园文化节、科技节、体育节。</p>
    <p>　　心理健康教育中心面向全体学生开放，提供个别辅导与团体辅导。</p>`,aboutSub)});

  G.www.list=(cat='news')=>{
    const name=cat==='notice'?'通知公告':'新闻动态';
    return {title:name+' - 临川市第七中学',html:page(name,name,
      `<ul class="sch-list full">${S.list(cat).map(rowFull).join('')}</ul><div class="pager">共 ${S.list(cat).length} 条　首页　上页　<b>1</b>　下页　尾页</div>`,newsSub)};
  };

  G.www.article=id=>{
    const x=S.byId(id);
    if(!x)return G.www.notfound();
    const list=S.list(x.cat),i=list.indexOf(x),prev=list[i-1],next=list[i+1];
    const name=x.cat==='notice'?'通知公告':'新闻动态';
    const extra=id==='1908'?`<p style="text-align:center">${a(W('photo/1908'),'【查看文化节合影】')}</p>`:'';
    return {title:x.title+' - 临川市第七中学',html:page(name,`${a(W('list/'+x.cat),name)} &gt; 正文`,
      `<h3 class="art-title">${esc(x.title)}</h3><div class="art-meta">发布时间：${x.date}　　来源：${x.src}　　点击：${x.hits}${x.archive?'　　<em>[历史存档]</em>':''}</div>
      <div class="art-body">${G.para(x.body)}</div>${extra}
      <div class="art-tools">【${a(location.hash.slice(1),'打印本页')}】【${a(W('list/'+x.cat),'关闭窗口')}】</div>
      <div class="art-nav">上一条：${prev?a(W('article/'+prev.id),esc(prev.title)):'没有了'}<br>下一条：${next?a(W('article/'+next.id),esc(next.title)):'没有了'}</div>`,newsSub)};
  };

  G.www.gallery=()=>({title:'校园风采 - 临川市第七中学',html:page('校园风采','校园风采',`
    <div class="albums">
      <div class="album">${a(W('photo/1908'),`<div class="pic">${G.art.groupPhoto('web')}</div>2019 第十三届校园文化节`)}<small>2019-11-15 更新</small></div>
      <div class="album"><div class="pic">${G.art.scene(2)}</div>2026 秋季田径运动会<small>相册整理中</small></div>
      <div class="album"><div class="pic">${G.art.scene(3)}</div>校园四季 · 老榕树<small>2025-04-02 更新</small></div>
      <div class="album"><div class="pic">${G.art.scene(1)}</div>书香七中<small>2026-11-06 更新</small></div>
    </div>`)});

  G.www.photo=()=>{
    return {title:'第十三届校园文化节 - 校园风采',html:page('校园风采',`${a(W('gallery'),'校园风采')} &gt; 2019 第十三届校园文化节`,`
    <h3 class="art-title">青春 · 回响 —— 高二（3）班合影</h3>
    <div class="art-meta">拍摄：2019-11-08　　上传：学校办公室　　最后修改：2019-11-15 08:04</div>
    <div class="photo-frame">${G.art.groupPhoto('web')}</div>
    <p class="caption">前排左起：${S.photoFront.join('、')}<br>后排左起：${S.photoBack.join('、')}</p>
    <p class="caption">合唱《榕树下的约定》获第十三届校园文化节一等奖。</p>
    <p class="caption">${a(W('article/1908'),'相关新闻：我校第十三届校园文化节隆重举行')}</p>`)};
  };

  G.www.classes=()=>({title:'班级空间 - 临川市第七中学',html:page('班级空间','班级空间',`
    <p>班级空间收录历届班级主页（只读）。</p>
    <table class="sch-table"><tr><th>届别</th><th colspan="4">班级</th></tr>
    <tr><td>2021 届（2019 年时为高二）</td><td>高二（1）班</td><td>高二（2）班</td><td>${a(W('class/2021-3'),'高二（3）班')}</td><td>高二（4）班……</td></tr>
    <tr><td>2027 届</td><td>高二（1）班</td><td>高二（2）班</td><td>高二（3）班</td><td>高二（4）班……</td></tr></table>
    <p class="caption">未链接的班级主页尚未迁移。</p>`,aboutSub)});

  G.www.class=id=>{
    if(id!=='2021-3')return G.www.notfound();
    const cells=S.roster.map((n,i)=>`<td>${G.pad(i+1)}</td><td>${n}</td>`);
    let rows='';for(let i=0;i<10;i++)rows+=`<tr>${cells[i]}${cells[i+10]}</tr>`;
    return {title:'高二（3）班 - 班级空间',html:page('班级空间',`${a(W('classes'),'班级空间')} &gt; 2021 届高二（3）班`,`
      <h3 class="art-title">2021 届高二（3）班</h3>
      <p>班主任：刘雯（语文）　　班长：王浩然　　宣传委员：许清　　班级人数：<b>20</b> 人</p>
      <p>班级口号：<b>一个都不能少。</b></p>
      <table class="sch-table roster"><tr><th>序号</th><th>姓名</th><th>序号</th><th>姓名</th></tr>${rows}</table>
      <p class="caption">班级荣誉：2019 年第十三届校园文化节合唱一等奖。<br>页面最后更新：2019-11-10</p>`,aboutSub)};
  };

  G.www.alumni=()=>({title:'校友之家 - 临川市第七中学',html:page('校友之家','校友之家',`
    <ul class="sch-list full">${['2608','2611'].map(id=>rowFull(S.byId(id))).join('')}</ul>
    <p>　　校友之家原设有“榕园社区”校友论坛入口。因信息系统升级，入口已撤下，相关说明请见通知公告。</p>
    <p>　　校友联络邮箱、各届联络人信息正在整理中。</p>`)});

  G.www.search=(q='')=>{
    q=q.trim();
    const hits=q?S.articles.filter(x=>(x.title+x.body).includes(q)):[];
    return {title:'站内搜索',html:page('站内搜索','搜索结果',`
      ${searchBox(q)}<p>${q?`关键词“${esc(q)}”共找到 <b>${hits.length}</b> 条结果：`:'请输入关键词。'}</p>
      <ul class="sch-list full">${hits.map(rowFull).join('')}</ul>`)};
  };

  G.www.notfound=()=>({title:'页面不存在',html:page('提示','页面不存在',`<p>您访问的页面不存在或已迁移。</p><p>${a(W('index'),'返回首页')}</p>`)});

  // 首页轮播
  G.www.bind=()=>{
    let cur=0;
    const show=i=>{cur=i;const s=document.getElementById('slide');if(!s)return;s.innerHTML=G.art.scene(i);document.querySelectorAll('.thumb').forEach(t=>t.classList.toggle('on',+t.dataset.slide===i))};
    document.querySelectorAll('.thumb').forEach(t=>t.onclick=()=>show(+t.dataset.slide));
    if(document.getElementById('slide'))G.slideTimer=setInterval(()=>show((cur+1)%G.art.sceneCount),4000);
    document.querySelectorAll('[data-form="www-search"]').forEach(f=>f.onsubmit=e=>{e.preventDefault();G.go(W('search/'+encodeURIComponent(new FormData(f).get('q').trim())))});
  };
})();

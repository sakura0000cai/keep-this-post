/* 榕园社区页面。版式参考 2000 年代中文社区：左侧栏目栏、广告位、分类广告、帖子列表。 */
(function(){
  const {a,esc,flag}=G,F=G.forum,B=p=>'/'+p;
  const me='chenmo_2019';
  const logged=()=>flag('loggedIn');
  const user=u=>a(B('profile/'+encodeURIComponent(u)),esc(u));
  const visibleBoard=id=>id!=='vault'||flag('album');
  const tl=()=>G.state.timeline;
  // 时间线变了以后，第一次看到变化的页面时记下，最后一条回复才会开放
  const noticeChange=()=>{if(flag('rescued')&&!flag('sawChange'))G.set('sawChange')};
  const cached='<div class="cache">[历史缓存：该内容在当前时间线中已不存在]</div>';

  function side(){
    const L=(p,t,cls='')=>a(B(p),t,cls);
    return `<aside class="bbs-side">
      <div class="bbs-logo"><b>榕园社区</b><small>bbs.lcqz.edu.cn</small></div>
      <div class="side-tabs"><span class="on">默认</span><span>分类</span></div>
      <nav class="side-links">
        ${L(logged()?'profile/'+me:'login','-我的榕园')}
        ${L('board/zatan','-榕园聚焦','hl')}
        ${L(logged()?'album/'+me:'login','-我的相册')}
        ${L('pm','-短消息'+(logged()&&unread()?` <i>(${unread()})</i>`:''))}
        ${L('search','-帖子查询')}
        ${L('board/grad','-毕业留言','hl')}
        <a href="../">-学校主页</a>
        <span class="side-sec">| 榕园主版 |</span>
        ${F.boards.map(([id,n])=>L('board/'+id,'.'+n)).join('')}
        ${flag('album')?L('board/vault','.旧物寄存处','odd'):''}
      </nav>
      <div class="side-foot">${logged()?`${me}<br>`:L('login','用户登陆')+'<br>'}在线:<b>1</b>/3218人</div>
    </aside>`;
  }
  const unread=()=>F.pms.filter(m=>!G.state.read[m.id]).length;
  function wrap(main,top){
    return `<div class="bbs">${side()}<main class="bbs-main">
      <div class="bbs-welcome"><span>${logged()?`欢迎您，<b>${me}</b>　[${a(B('pm'),'短消息'+(unread()?`(${unread()})`:''))}]　[${a(B('profile/'+me),'个人主页')}]`:`欢迎您，<b>guest_0714</b>　[${a(B('login'),'登录')}]　[${a(B('post'),'注册')}]`}</span><span>服务器时间：<span data-clock="bbs"></span></span></div>
      ${top||''}${main}
      <div class="bbs-copy">榕园社区 bbs.lcqz.edu.cn　|　联系版主　|　Powered by RongBBS 3.2 © 2009-2026<br>本社区帖子仅代表作者本人观点</div>
    </main></div>`;
  }
  const topbar=(name)=>`<div class="bbs-topbar"><b>[${name}]</b><span>${a(B('board/grad'),'榕园拾英','y')}${a(B('thread/rule'),'发帖标准暨管理规定','y')}${a(B('search'),'帖子查询')}</span></div>`;
  const page=(name,main)=>({title:name+' - 榕园社区',html:wrap(main,topbar(name))});

  // —— 版块列表 ——
  G.bbs.index=()=>G.bbs.board('zatan');
  G.bbs.board=(id='zatan')=>{
    if(!visibleBoard(id))return G.bbs.notfound();
    const name=F.boardName(id);
    const list=F.threads.filter(t=>t.board===id&&F.visible(t)).sort((x,y)=>(y.top?1:0)-(x.top?1:0)||y.date.localeCompare(x.date));
    const rows=list.map((t,i)=>{
      const rep=Math.max(t.posts.length-1,0),odd=t.special==='mystery';
      const cls=t.top?'red':odd?'odd':'';
      return `<tr class="${i%2?'alt':''}"><td class="ico">${t.top?'📌':'☺'}</td><td class="tt">${t.top?'<em>[置顶]</em>':''}${a(B('thread/'+t.id),esc(t.title),cls)}${odd&&!logged()?' <small>[屏蔽]</small>':''}</td><td>${user(t.author)}</td><td class="n">${odd?0:t.views}</td><td class="n">${rep}</td><td class="d">${t.date.slice(2,16).replace(/^(\d\d)-0?/,'$1-')}</td></tr>`;
    }).join('');
    const main=`<div class="bbs-ad">${G.art.forumAd()}</div>
      <div class="cls-ad"><b>分类广告</b><div>
        <span>·<a class="r">考前冲刺一对一，名师辅导不满意退费</a></span><span>·<a>精品 MP3 特价，可存 2000 首</a></span><span>·<a>北门打印店：彩印五毛一张</a></span><span>·<a class="r">暑期驾校学生班火热报名</a></span>
        <span>·<a>二手教辅回收，高价收购</a></span><span>·<a class="r">手机充值卡九五折</a></span><span>·<a>吉他速成班，三周弹唱</a></span><span>·<a>文昌路奶茶第二杯半价</a></span></div></div>
      <div class="bbs-bar"><span>[${a(B('post'),'发表')}] [${a(B('board/grad'),'精品文章')}]</span><span>[论题 <b>${id==='zatan'?1874:list.length*37}</b>][总帖 <b>${id==='zatan'?12407:list.length*211}</b>]</span></div>
      <div class="bbs-bar2">[版主 <a>小楼听雨</a> <a>信息中心</a>][实习 <a>老榕树</a>]</div>
      <div class="bbs-tabs"><a>默认页</a>\\<a class="r">服务处理</a>\\<a>转载专区</a></div>
      <div class="recom"><div class="recom-h">§版块推荐</div><div class="recom-b">
        ${a(B('thread/2611'),'◎关于论坛停止服务及数据迁移的说明')}　${a(B('thread/1109'),'◎2019 文化节照片专帖')}　${a(B('thread/g1'),'◎论坛要关了，来留个言吧')}<br>
        ${a(B('thread/c2'),'◎广播站点歌留言')}　${a(B('thread/c1'),'◎摄影社活动时间与地点')}　<a class="r">◎“我的高中”征文活动 <i class="hot">hot</i></a></div></div>
      <table class="tlist"><tr><th></th><th>论　　题</th><th>作者</th><th>访问</th><th>回复</th><th>更新日期</th></tr>${rows}</table>
      <div class="bbs-pager">共 ${list.length} 条　[1] <a>2</a> <a>3</a> <a>下一页</a>　<small>（历史分页数据未迁移）</small></div>`;
    return page(name,main);
  };

  // —— 帖子 ——
  const postHtml=(x,floor,title)=>{
    const u=F.users[x.a]||{};
    return `<div class="t-post${x.cls?' '+x.cls:''}"><div class="t-ph">${floor?'':'<b>楼主</b> '}作者：${user(x.a)}　${floor?'回复':'提交'}日期：${x.t}<span>${floor?floor+'楼':''}</span></div>
      <div class="t-pb">${x.html||G.para(x.body)}</div>${x.like===tl()?`<div class="like">♥ 1 人觉得很赞：${user('linzx')}（2026-11-14 23:52）</div>`:''}${u.sig&&!x.cls?`<div class="t-sig">${esc(u.sig)}</div>`:''}</div>`;
  };
  G.forum.postHtml=postHtml;
  function threadHead(t,views,reps){
    return `<h1 class="t-title">${esc(t.title)}</h1><div class="t-meta">作者：${user(t.author)}　提交日期：${t.date}　访问：${views}　回复：${reps}　[${a(B('board/'+t.board),'返回'+F.boardName(t.board))}]</div>`;
  }
  G.bbs.thread=id=>{
    const t=F.thread(id);
    if(!t||!visibleBoard(t.board))return G.bbs.notfound();
    if(t.special==='mystery')return mystery(t);
    if(t.special==='vault')return vault(t);
    if(id==='g1'&&tl()!=='original')noticeChange();
    const main=threadHead(t,t.views,t.posts.length-1)+t.posts.map((x,i)=>postHtml(x,i)).join('')+
      `<div class="t-foot">${t.locked?`<span class="r">${t.locked}</span>`:`[${a(B('post'),'回复本帖')}]`}　[${a(B('board/'+t.board),'返回列表')}]</div>`;
    return page(F.boardName(t.board),main);
  };

  function mystery(t){
    if(!logged()){
      return page('校园杂谈',threadHead(t,0,0)+`<div class="blocked">【提示】该帖已于 2019-11-15 被管理员屏蔽，仅原作者登录后可见。<br>屏蔽理由：内容不实，造成恐慌。<br><br>${a(B('login'),'[原作者登录]')}</div>`);
    }
    const first={a:'chenmo_2019',t:'2019-11-13 23:58',body:'明天有人会死。\n\n我不知道我为什么要写这个。这不是玩笑。\n\n去看那张合照。不要看学校挂出来的那张。'};
    const foot=flag('archive')
      ?`<div class="edit-note glitch">[本帖最后由 <b>guest_0714</b> 于 <b>2026-11-14 23:17</b> 编辑]　${a(B('history/1113'),'[查看编辑记录]')}</div>`
      :`<div class="edit-note">[本帖已于 2019-11-15 08:02 被管理员屏蔽：内容不实，造成恐慌。仅作者本人可见]</div>`;
    const main=threadHead(t,0,G.state.chat.length)+postHtml(first,0)+foot+(flag('draftOpen')?G.story.thread():'');
    return page('校园杂谈',main);
  }

  function vault(t){
    const lock1=flag('lock1'),lock2=flag('archive');
    let body=G.para('我把那天能留下的东西放在这里。\n\n学校说是“晚上七点”。不是。\n\n如果学校要删，至少让它们在这里多待一会儿。我加了两把锁，只有在乎她的人才打得开。');
    body+=`<form class="lock" data-form="lock1"><b>第一把锁</b>　${lock1?'<span class="ok">✔ 已打开</span>':`她最后一次在论坛上留下话，是几点几分？（四位数字）<br><input name="v" maxlength="5" placeholder="HHMM"> <button>开锁</button><span class="feedback"></span>`}</form>`;
    if(lock1)body+=`<form class="lock" data-form="lock2"><b>第二把锁</b>　${lock2?'<span class="ok">✔ 已打开</span>':`我们班第一次站上舞台之前，每天放学后去的那间教室。<br><input name="v" maxlength="6" placeholder="教室编号"> <button>开锁</button><span class="feedback"></span>`}</form>`;
    if(lock2)body+=`<div class="attach"><div class="attach-h">附件（4）</div>
      <div class="file"><b>📷 纸条.jpg</b><div class="paper-note">明天放学，老地方。<br>你的笔记本在我们这儿。<br>一个人来。别告诉老师。</div><small>许清：在知夏抽屉里找到的。“老地方”是哪里，我还没弄清楚。</small></div>
      <div class="file"><b>💬 群聊截图.png</b><div class="chatlog"><p><b>周予安：</b>明天让她自己来拿，老地方，上次那间</p><p><b>某同学：</b>会不会有点过了</p><p><b>周予安：</b>开个玩笑而已，谁让她到处说</p><p class="cut">（截图到此为止）</p></div></div>
      <div class="file"><b>📄 时间.txt</b><pre>11.14
17:05  放学。周予安在走廊跟知夏说了句话。
17:21  知夏在论坛发了最后一条心情。
18:05  我在论坛发帖找她。
18:30  我去找赵文山老师。赵老师说先别声张。
——
通报写的是“19 时许”。
他们把时间往后挪了一个多小时，好像那一个多小时不存在。
通报还说旧实验楼“已停止使用”。可是摄影社每周四都在三楼。</pre></div>
      <div class="file"><b>📄 给陈默.txt</b><pre>陈默：

你 13 号半夜发的那条帖子，我一直没想明白。
你说你不记得发过。可你写了“明天有人会死”。

今天我用管理员给的权限看了那条帖子的编辑记录。
最后一条记录的时间写着 2026 年。

我是不是太累了，眼花了。
你自己去看看吧。</pre></div></div>`;
    const main=threadHead(t,3,0)+(tl()!=='original'?cached:'')+postHtml({a:'xuqing',t:'2019-11-16 01:30',html:body},0)+`<div class="t-foot">[本帖仅寄存，不可回复]</div>`;
    return page('旧物寄存处',main);
  }

  G.bbs.history=id=>{
    if(!logged())return G.bbs.login();
    const rows=[
      ['#4','2026-11-14 23:17','guest_0714','创建草稿（未提交）','<span class="glitch">提交目标：2019-11-13 23:58</span>',`<button data-act="draft" class="mini">继续编辑</button>`],
      ['#3','2019-11-15 08:02','管理员','屏蔽','内容不实，造成恐慌',''],
      ['#2','2019-11-14 00:01','chenmo_2019','申请删除','<span class="r">失败：请不要删除这条帖子</span>',''],
      ['#1','2019-11-13 23:58','chenmo_2019','发表','来源 IP：<span class="glitch">本机</span>','']
    ];
    if(flag('rescued'))rows.unshift(['#5','2019-11-14 18:20','chenmo_2019','追加回复','<span class="glitch">历史已变更</span>','']);
    if(G.state.ending==='A'||G.state.ending==='B')rows.unshift(['#6','2026-11-14 23:5x','guest_0714','最后一条回复（已送达）','<span class="glitch">草稿副本仍可编辑</span>',`<button data-act="retry" class="mini">重新编辑</button>`]);
    const main=`<h1 class="t-title">编辑记录 ·《明天有人会死》</h1>
      <table class="tlist hist"><tr><th>版本</th><th>时间</th><th>操作人</th><th>操作</th><th>备注</th><th></th></tr>${rows.map((r,i)=>`<tr class="${i%2?'alt':''}">${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>
      <p class="hint-line">提示：草稿提交后，将按“提交目标”时间写入原帖。</p>
      <div class="t-foot">[${a(B('thread/1113'),'返回帖子')}]</div>`;
    return page('校园杂谈',main);
  };

  // —— 用户 ——
  G.bbs.profile=(u='')=>{
    const x=F.users[u];
    if(!x)return page('用户资料','<div class="blocked">该用户不存在或已注销。</div>');
    let moods=(F.moods[u]||[]).slice();
    if(u===me&&flag('named'))moods.unshift(['2019-11-14 08:03','今天放学我哪也不去。<span class="cache">[历史缓存比对：此条在 2026-11-14 23:17 的快照中不存在]</span>']);
    const after=(F.moodsAfter[u]||{})[tl()];
    if(after)moods=after.concat(moods);
    if(u==='linzx'&&tl()!=='original')noticeChange();
    const main=`<table class="profile"><tr><td class="pf-l">${G.art.avatar(x.ch,x.color)}<br><b>${esc(u)}</b><br>${x.title}</td>
      <td><table class="pf-t"><tr><th>用户名</th><td>${esc(u)}</td><th>注册日期</th><td>${x.reg}</td></tr>
      <tr><th>头衔</th><td>${x.title}</td><th>积分</th><td>${x.score}</td></tr>
      <tr><th>发帖数</th><td>${x.posts}</td><th>最后登录</th><td>${u===me&&logged()?G.stamp():u==='guest_0714'?'<span class="glitch">正在线上</span>':u==='linzx'?F.lastLogin[tl()]:'2019-11-'+(10+x.posts%6)}</td></tr>
      <tr><th>签名</th><td colspan="3">${esc(x.sig||'')}</td></tr></table>
      <p>[${a(B('album/'+encodeURIComponent(u)),'TA 的相册')}]　[${a(B('pm'),'发短消息')}]</p></td></tr></table>
      <div class="moods"><div class="recom-h">§最近发言 / 心情</div>${moods.length?moods.map(([t,s])=>`<div class="mood"><span>${t}</span>${s}</div>`).join(''):'<div class="mood">暂无。</div>'}</div>`;
    return page('用户资料',main);
  };

  G.bbs.album=(u='')=>{
    if(!logged())return G.bbs.login('查看相册需要登录。');
    if(u!=='xuqing')return page('相册',`<div class="blocked">${esc(u)} 的相册为空，或未公开。</div>`);
    let main=`<h1 class="t-title">xuqing 的相册 · 2019 文化节</h1>`;
    if(!flag('album'))main+=`<form class="lock center" data-form="album"><p>🔒 该相册已加密。</p><p>密码提示：<b>合照里，少了谁？</b></p><input name="v" placeholder="请输入密码"> <button>打开</button><div class="feedback"></div></form>`;
    else main+=`<div class="photo-frame">${G.art.groupPhoto('original')}</div>
      <p class="caption">20191108_原片.jpg　　上传：2019-11-09<br>xuqing：全班二十个人。第二排左起第七个，是知夏，她替广播站举着牌子。<br>背后那扇门是 B203，我们排练了两个星期的音乐教室。</p>
      <p class="caption">xuqing（2019-11-16 补充）：官网那张，第二排第七个人没有了。她站的地方被修成了一块墙。</p>`;
    return page('相册',main);
  };

  // —— 登录 / 找回 ——
  G.bbs.login=(msg='')=>({title:'用户登录 - 榕园社区',html:wrap(`<form class="login" data-form="login"><div class="login-h">用户登录</div>
    ${msg?`<p class="r">${msg}</p>`:''}<label>用户名：<input name="u" autocomplete="off"></label><label>密　码：<input name="p" type="password"></label>
    <p><button>登 录</button>　${a(B('recover'),'忘记密码？')}</p><div class="feedback"></div></form>`,topbar('用户登录'))});

  G.bbs.recover=()=>{
    if(logged())return G.bbs.profile(me);
    const step2=G.state.recoverUser==='chenmo_2019';
    const main=`<form class="login" data-form="recover"><div class="login-h">找回密码</div>
      ${step2?`<p>用户名：<b>chenmo_2019</b></p><p>密码保护问题：<b>我们班第一次站上全校舞台的日子</b><br><small>（请填四位数字：月月日日）</small></p><label>答　案：<input name="ans" maxlength="4" autocomplete="off"></label>`
        :`<p>请输入要找回的用户名。</p><label>用户名：<input name="u" autocomplete="off"></label>`}
      <p><button>下一步</button></p><div class="feedback"></div></form>`;
    return {title:'找回密码 - 榕园社区',html:wrap(main,topbar('找回密码'))};
  };

  // —— 短消息 ——
  G.bbs.pm=(id='')=>{
    if(!logged())return G.bbs.login('请先登录。');
    const m=F.pms.find(x=>x.id===id);
    if(m){G.state.read[m.id]=1;G.save()}
    const list=F.pms.map(x=>`<tr class="${G.state.read[x.id]?'':'unread'}"><td>${G.state.read[x.id]?'已读':'<b>未读</b>'}</td><td>${a(B('pm/'+x.id),esc(x.title))}</td><td>${esc(x.from)}${tl()!=='original'&&(x.id==='m2'||x.id==='m3')?' <small class="r">[缓存]</small>':''}</td><td>${x.time}</td></tr>`).join('');
    const main=`<h1 class="t-title">短消息 · 收件箱</h1><table class="tlist"><tr><th>状态</th><th>标题</th><th>发件人</th><th>时间</th></tr>${list}</table>
      ${m?`<div class="t-post"><div class="t-ph">发件人：${esc(m.from)}　时间：${m.time}</div><div class="t-pb"><b>${esc(m.title)}</b>${G.para(m.body)}</div></div>`:'<p class="hint-line">点击标题阅读。</p>'}`;
    return page('短消息',main);
  };

  G.bbs.search=(q='')=>{
    q=q.trim();
    const hits=q?F.threads.filter(t=>visibleBoard(t.board)&&F.visible(t)&&(t.title+t.author+t.posts.map(x=>x.a+x.body).join('')).includes(q)):[];
    const main=`<form class="search" data-form="bbs-search">帖子查询：<input name="q" value="${esc(q)}" placeholder="标题、作者或内容"> <button>查询</button></form>
      ${q?`<p>找到 ${hits.length} 个相关主题：</p><table class="tlist"><tr><th>论题</th><th>作者</th><th>版块</th><th>日期</th></tr>${hits.map(t=>`<tr><td>${a(B('thread/'+t.id),esc(t.title))}</td><td>${user(t.author)}</td><td>${F.boardName(t.board)}</td><td>${t.date.slice(0,10)}</td></tr>`).join('')}</table>`:'<p class="hint-line">可以搜人名，例如同学的名字或用户名。</p>'}`;
    return page('帖子查询',main);
  };

  G.bbs.post=()=>page('提示','<div class="blocked">论坛即将停止服务，已关闭注册与发帖功能。</div>');
  G.bbs.notfound=()=>page('提示','<div class="blocked">该帖子或页面不存在，可能已被删除。</div>');

  // —— 表单 ——
  G.bbs.bind=()=>{
    const on=(name,fn)=>document.querySelectorAll(`[data-form="${name}"]`).forEach(f=>f.onsubmit=e=>{e.preventDefault();fn(f,new FormData(f))});
    on('bbs-search',(f,d)=>G.go(B('search/'+encodeURIComponent(d.get('q').trim()))));
    on('login',(f,d)=>{
      const u=d.get('u').trim();
      if(!u)return G.fb(f,'请输入用户名。');
      if(u==='guest_0714')return G.fb(f,'游客账号无需登录。你已经在这里了。');
      if(u.toLowerCase()===me)return G.fb(f,'密码错误。七年了，你不记得也正常——试试“忘记密码”。');
      G.fb(f,'该用户不存在，或不在迁移名单中。');
    });
    on('recover',(f,d)=>{
      if(G.state.recoverUser!=='chenmo_2019'){
        const u=d.get('u').trim().toLowerCase();
        if(u===me){G.state.recoverUser=me;G.save();return G.render()}
        if(F.users[u]||F.users[d.get('u').trim()])return G.fb(f,'只能找回本人的账号。当前设备的迁移凭证属于：陈默。');
        return G.fb(f,'迁移名单中没有该用户名。你当年的用户名，也许就挂在论坛的帖子列表里。');
      }
      const v=d.get('ans').trim();
      if(v==='1108'){G.set('loggedIn');G.go(B('pm'));return}
      if(v==='1110')return G.fb(f,'不对。这是班级主页更新的日期，不是上台的日子。');
      if(v==='1115')return G.fb(f,'不对。这是照片被替换的日期。');
      G.fb(f,'答案错误。去学校官网找找那次演出的新闻。');
    });
    on('album',(f,d)=>{
      const v=G.norm(d.get('v'));
      if(v==='林知夏'||v==='知夏'||v==='linzx'){G.set('album');G.render();return}
      G.fb(f,'密码错误。对比官网合照的名字和班级名单，看看少了谁。');
    });
    on('lock1',(f,d)=>{
      const v=d.get('v').replace(/[:：\s]/g,'');
      if(v==='1721'){G.set('lock1');G.render();return}
      if(v==='1718')return G.fb(f,'差一点。那是她给你发站内信的时间，不是在论坛上留下的最后一句话。');
      if(v==='1900')return G.fb(f,'这是学校通报写的时间。许清说了：不是。');
      if(v==='1805')return G.fb(f,'这是许清开始找她的时间。');
      G.fb(f,'锁没有打开。去她的个人主页看看。');
    });
    on('lock2',(f,d)=>{
      const v=G.norm(d.get('v'));
      if(v==='b203'){G.set('archive');G.render();return}
      if(v.includes('203'))return G.fb(f,'编号要写完整，前面有楼号字母。');
      G.fb(f,'锁没有打开。文化节新闻里写着你们在哪排练。');
    });
    document.querySelectorAll('[data-act="retry"]').forEach(b=>b.onclick=()=>{G.story.retry();G.go(B('thread/1113'))});
    document.querySelectorAll('[data-act="draft"]').forEach(b=>b.onclick=()=>{G.set('draftOpen');G.go(B('thread/1113'))});
    G.story.bind();
  };
})();

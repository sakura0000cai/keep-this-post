/* 跨时间回复、分层提示。过去的陈默有自己的判断：说不清楚的话，他不会照做。 */
(function(){
  const {esc,flag}=G,st=()=>G.state;
  const S=G.story={};
  let hidden=0; // 刚收到、还在“等待服务器”的过去回复条数

  // 过去回复的时间：每个阶段一个起点，每次追问往后推一分钟
  function pastTime(stage,base){
    const n=st().tries[stage]=(st().tries[stage]||0)+1;
    const [d,hm]=base.split(' '),[h,m]=hm.split(':').map(Number),t=h*60+m+n-1;
    return `${d} ${G.pad(Math.floor(t/60))}:${G.pad(t%60)}`;
  }

  function respond(msg){
    const m=G.norm(msg),out=[];
    const say=(stage,base,...lines)=>{let t=pastTime(stage,base);lines.forEach(l=>{out.push({who:'past',t,text:l})})};
    if(!flag('connected')){
      G.set('connected');
      say('first','2019-11-14 00:04','……？\n\n我刚发完帖子，下面就多了一条回复。“guest_0714”是谁？你怎么能编辑我的帖子？');
      say('first2','2019-11-14 00:05','你说你是谁都行。\n\n真要是“我”，就说一件只有我自己知道的事。我书包里藏了样东西，谁都没告诉过。');
    }else if(!flag('identity')){
      const ticket=/票/.test(m),page=/146/.test(m);
      if(ticket&&page){
        G.set('identity');
        say('id-ok','2019-11-14 00:11','……数学书，第 146 页。两张晚风的票。\n\n这事我只跟一个人提过。');
        say('id-ok2','2019-11-14 00:12','可这也可能是有人翻过我的书包。\n\n说一件明天早上才会发生的事。说中了，我就信你。');
      }else if(ticket)say('id','2019-11-14 00:08','你知道票。\n\n那它夹在哪儿？说具体点，哪一页。');
      else if(page)say('id','2019-11-14 00:08','146 页……里面夹着什么？');
      else say('id','2019-11-14 00:08','这种话谁都能说。\n\n我书包里那样东西，谁都没告诉过。你要真是我，你知道是什么。');
    }else if(!flag('future')){
      const rain=/雨/.test(m),morning=/(晨会|升旗|广播|早操|操场)/.test(m);
      if(rain&&morning){
        G.set('future');
        say('fu-ok','2019-11-14 07:52','早上真的下雨了。晨会改成了在教室听广播。\n\n……我现在信你了。');
        say('fu-ok2','2019-11-14 07:53','你说明天有人会死。\n\n今天就是“明天”。是谁？');
      }else if(rain)say('fu','2019-11-14 00:15','下雨？然后呢？学校会怎么样？要能让我明天一早就确认的。');
      else if(morning)say('fu','2019-11-14 00:15','晨会怎么了？为什么？说清楚一点。');
      else say('fu','2019-11-14 00:15','我要的是明天早上就能验证的事。天气、学校的安排，什么都行。');
    }else if(!flag('named')){
      if(/知夏/.test(m)){
        G.set('named');G.set('demoEnd');
        say('nm-ok','2019-11-14 07:58','知夏……\n\n她昨天还跟我说没事。笔记本的事，她说就是谁拿错了。');
        say('nm-ok2','2019-11-14 07:59','你要我做什么？她会在哪儿？几点？\n\n我不能只是跟着她一整天，然后什么都不懂地看着。告诉我该怎么办。');
      }else if(/(许清|周予安|陈默|老师|赵)/.test(m))say('nm','2019-11-14 07:55','不对吧……你确定吗？\n\n你说的是“有人会死”。说她的名字。');
      else say('nm','2019-11-14 07:55','说名字。');
    }
    return out;
  }

  S.thread=()=>{
    const list=st().chat,shown=list.length-hidden;
    let html=list.slice(0,shown).map((x,i)=>G.forum.postHtml(x.who==='me'
      ?{a:'guest_0714',t:x.t,body:x.text,cls:'from-now'}
      :{a:'chenmo_2019',t:x.t,body:x.text,cls:'from-past'},i+1)).join('');
    if(hidden)html+=`<div class="waiting">正在写入 2019-11-14 ……<span class="dots"></span></div>`;
    if(flag('demoEnd')&&!hidden){
      html+=`<div class="demo-end"><p class="glitch">— 连接保持中 —</p><h2>第三幕　来自过去的回复</h2>
        <p>他在等你的答案。可你还不知道“老地方”在哪里，也不知道一个人被提醒一次，是不是就够了。</p>
        <p class="small">试玩版到此结束。完整版将继续：事件地点推理、失败的救援、最后一条帖子。<br>陈默的个人主页上，多了一条七年前不存在的发言。</p></div>`;
    }else if(!hidden){
      html+=`<form class="reply" data-form="chat"><div class="reply-h">${flag('connected')?'回复本帖':'编辑草稿 · 版本 #4　　<span class="glitch">提交目标：2019-11-13 23:58</span>'}</div>
        <textarea name="m" maxlength="400" placeholder="${flag('connected')?'写点什么……':'草稿是空的。'}">${esc(st().draft)}</textarea>
        <p><button>${flag('connected')?'回 复':'提 交'}</button><span class="feedback"></span></p></form>`;
    }
    return html;
  };

  S.bind=()=>{
    const f=document.querySelector('[data-form="chat"]');
    if(!f)return;
    const ta=f.querySelector('textarea');
    ta.oninput=()=>{st().draft=ta.value;G.save()};
    f.onsubmit=e=>{
      e.preventDefault();
      const text=ta.value.trim();
      if(text.length<2)return G.fb(f,'内容太短。');
      st().chat.push({who:'me',t:G.stamp(),text});
      const replies=respond(text);
      st().chat.push(...replies);st().draft='';G.save();
      hidden=replies.length;G.render();
      setTimeout(()=>{hidden=0;if(location.hash==='#/thread/1113')G.render()},2200);
    };
  };

})();

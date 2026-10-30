/* 跨时间回复与结局。过去的陈默有自己的判断：说不清楚的话，他不会照做。
   时间线：original 原始悲剧 → rescue_failed 只拦下了当天 → saved 知夏获救 / truth 获救且真相被调查 */
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

  // 最后一条帖子要覆盖的三件事
  const HELPER=/(许老师|何老师|校医|医务室|心理|咨询|班主任|刘雯|刘老师|家长|父母|爸|妈|监护人)/;
  const ONGOING=/(每天|一直|以后|持续|每周|长期|陪着|陪她|一个人|不止今天|明天也|天天|经常|周二|周四)/;
  const EVIDENCE=/(证据|截图|纸条|聊天记录|群聊|保存|保留|留着|许清)/;

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
        G.set('named');
        say('nm-ok','2019-11-14 07:58','知夏……\n\n她昨天还跟我说没事。笔记本的事，她说就是谁拿错了。');
        say('nm-ok2','2019-11-14 07:59','你要我做什么？她会在哪儿？几点？\n\n我不能只是跟着她一整天，然后什么都不懂地看着。告诉我该怎么办。');
      }else if(/(许清|周予安|陈默|老师|赵)/.test(m))say('nm','2019-11-14 07:55','不对吧……你确定吗？\n\n你说的是“有人会死”。说她的名字。');
      else say('nm','2019-11-14 07:55','说名字。');
    }else if(!flag('rescued')){
      // 第四幕：老地方 = 旧实验楼三楼摄影室的暗房；周予安 17:28 借走了钥匙
      const room=/(摄影室|暗房|摄影社)/.test(m),floor=/(旧实验楼|三楼|3楼|三层|3层)/.test(m);
      const hm=m.match(/(\d{1,2})[点:]?(\d{2})?/),late=/(晚上|六点|七点|八点)/.test(m)||hm&&(+hm[1]>=18||(+hm[1]===17&&+(hm[2]||0)>40));
      const time=/(放学|五点|5点|17\d\d|1[67]点)/.test(m)&&!late;
      if(room&&time){
        G.set('rescued');st().timeline='rescue_failed';st().finalMark=st().chat.length+1+2;G.save();
        say('pl-ok','2019-11-14 08:04','旧实验楼三楼，摄影室。放学一结束我就过去。');
        say('pl-ok2','2019-11-14 17:36','我到了。\n\n暗房的门从外面插着插销，她在里面。我把门拉开的时候，她还在数数。\n\n……她没事。');
        say('pl-ok3','2019-11-14 18:20','我送她回了家。她让我别告诉任何人，说明天就好了。\n\n可我总觉得这事没完。');
      }else if(room&&late)say('pl','2019-11-14 08:01','那会不会太晚了？她放学就被叫走了。');
      else if(room)say('pl','2019-11-14 08:01','摄影室……几点？放学以后马上就去吗？');
      else if(floor)say('pl','2019-11-14 08:01','旧实验楼三楼哪儿？那层有好几间屋子，走廊尽头的灯还坏了。\n\n“老地方”……她们以前在哪儿欺负过她？');
      else if(/老地方/.test(m))say('pl','2019-11-14 08:01','老地方是哪儿？你得告诉我具体的地方。');
      else say('pl','2019-11-14 08:01','我听不懂。她会在哪儿？几点？');
    }else if(!st().ending){
      // 第五幕：最后一条帖子，一次定结局
      const helper=HELPER.test(m),ongoing=ONGOING.test(m),evidence=EVIDENCE.test(m),onlyZhao=/赵/.test(m)&&!helper;
      if(helper&&ongoing&&evidence){
        st().ending='C';st().timeline='truth';
        say('end','2019-11-14 18:40','……我明白了。不是今天把门打开就结束了。');
        say('end2','2019-11-14 18:42','许清那里有纸条和群聊截图。明天一早，我们俩陪知夏去医务室找许老师，请她联系知夏的爸妈。\n\n不找赵老师。\n\n以后每天放学我都等她一起走。这一次，不会再有人说那是意外。');
      }else if(helper&&ongoing){
        st().ending='B';st().timeline='saved';
        say('end','2019-11-14 18:40','好。明天我陪她去医务室找许老师，以后每周二、周四陪她去心理咨询室。\n\n放学我等她一起走，不让她一个人。');
        say('end2','2019-11-14 18:43','……谢谢你。\n\n不管你是谁。');
      }else{
        st().ending='A';
        say('end','2019-11-14 18:40',onlyZhao?'我去找了赵老师。\n\n他说这是同学之间闹着玩，让我们别声张，别影响班级评比。':'……我知道了。');
        say('end2','2019-11-14 18:45','可我一个人，能做的好像就只有这些。');
      }
    }
    return out;
  }

  const endings={
    A:['结局 A　已读','他读到了。可一个人知道，并不等于有人来帮她。','2026 年的论坛里，她的最后登录停在了 2020 年 1 月。','那份草稿还留在编辑记录里。也许还有别的写法。'],
    B:['结局 B　新的明天','她活了下来，被人陪着，慢慢好起来。','只是那年十一月发生过什么，学校的档案里依然没有写。','编辑记录里还留着最后一份草稿。'],
    C:['结局 C　请不要删除这条帖子','门被打开了，后来的每一天也有人在。','这条帖子已经完成了它的事。去学校官网看看吧。','论坛将在零点关闭。']
  };

  S.thread=()=>{
    const list=st().chat,shown=list.length-hidden;
    let html=list.slice(0,shown).map((x,i)=>G.forum.postHtml(x.who==='me'
      ?{a:'guest_0714',t:x.t,body:x.text,cls:'from-now'}
      :{a:'chenmo_2019',t:x.t,body:x.text,cls:'from-past'},i+1)).join('');
    if(hidden)return html+`<div class="waiting">正在写入 2019-11-14 ……<span class="dots"></span></div>`;
    const e=endings[st().ending];
    if(e){
      if(st().ending==='C')G.set('endSeen');
      return html+`<div class="demo-end"><p class="glitch">— 连接已断开 —</p><h2>${e[0]}</h2><p>${e[1]}</p><p>${e[2]}</p>
        <p class="small">${e[3]}${st().ending!=='C'?`<br>${G.a('/history/1113','[查看编辑记录]')}`:''}</p></div>`;
    }
    if(flag('rescued')&&!flag('sawChange'))
      return html+`<div class="sys-note">【系统】检测到历史数据变更，部分帖子与页面正在重新索引……<br>论坛与学校网站的部分内容，已经和 23:17 的快照不一样了。</div>`;
    const last=flag('rescued');
    html+=`<form class="reply${last?' last':''}" data-form="chat"><div class="reply-h">${last?'最后一条回复　　<span class="r">论坛将在零点关闭，提交后无法撤回</span>':flag('connected')?'回复本帖':'编辑草稿 · 版本 #4　　<span class="glitch">提交目标：2019-11-13 23:58</span>'}</div>
      <textarea name="m" maxlength="600" placeholder="${last?'他问：这事没完，我该怎么办？':flag('connected')?'写点什么……':'草稿是空的。'}">${esc(st().draft)}</textarea>
      <p><button>${flag('connected')?'回 复':'提 交'}</button><span class="feedback"></span></p></form>`;
    return html;
  };

  // A、B 结局后，从编辑记录重写最后一条帖子
  S.retry=()=>{
    st().chat=st().chat.slice(0,st().finalMark);st().ending=null;st().timeline='rescue_failed';
    ['end','end2'].forEach(k=>delete st().tries[k]);G.save();
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
      if(flag('rescued')&&!confirm('这是最后一条回复，提交后无法撤回。确定发送吗？'))return;
      st().chat.push({who:'me',t:G.stamp(),text});
      const replies=respond(text);
      st().chat.push(...replies);st().draft='';G.save();
      hidden=replies.length;G.render();
      setTimeout(()=>{hidden=0;if(location.hash==='#/thread/1113')G.render()},2200);
    };
  };
})();

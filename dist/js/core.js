/* 《请不要删除这条帖子》核心：存档、游戏内时间、通用工具。
   官网与论坛是两个独立页面，同源共享同一份存档。人物、学校、域名均为虚构。 */
(function(){
  const KEY='lc7-arg-v3';
  const G=window.G={www:{},bbs:{}};

  G.initial=()=>({v:3,flags:{},chat:[],draft:'',tries:{},read:{},timeline:'original',t0:Date.now()});
  // 另一个标签页可能刚改过存档，所以每次渲染前都重新读取
  G.load=()=>{
    G.state=G.initial();
    try{const o=JSON.parse(localStorage.getItem(KEY));if(o&&o.v===3)G.state={...G.state,...o}}catch(e){}
  };
  G.save=()=>{try{localStorage.setItem(KEY,JSON.stringify(G.state))}catch(e){}};
  G.reset=()=>{G.state=G.initial();G.save()};
  G.load();
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

  // 表单反馈
  G.fb=(form,msg,ok)=>{const el=form.querySelector('.feedback');if(el){el.textContent=msg;el.className='feedback'+(ok?' ok':' bad')}};
  // 宽松比对：去掉空白与标点
  G.norm=s=>String(s||'').replace(/[\s，。！？、,.!?“”"'：:；;（）()《》<>【】\-—_]/g,'').toLowerCase();

  // 手绘的 SVG（合照、广告、头像）渲染后降成低分辨率 JPEG，画质与实拍照片一致
  const LOWRES=[['.photo-frame svg,.album .pic svg',.6,'saturate(.8) contrast(1.06) sepia(.12)'],['.bbs-ad svg',.6,''],['svg.ava',.5,'']];
  G.lowres=()=>LOWRES.forEach(([sel,scale,filter])=>document.querySelectorAll(sel).forEach(svg=>{
    const r=svg.getBoundingClientRect();if(!r.width)return;
    const w=Math.round(r.width*scale),h=Math.round(r.height*scale),src=new Image();
    src.onload=()=>{
      const c=document.createElement('canvas');c.width=w;c.height=h;
      const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.filter=filter||'none';x.drawImage(src,0,0,w,h);
      const img=new Image();img.src=c.toDataURL('image/jpeg',.5);img.alt=svg.getAttribute('aria-label')||'';
      img.className=svg.getAttribute('class')||'';img.style.cssText=`display:block;width:${r.width}px;height:${r.height}px`;
      svg.replaceWith(img);
    };
    src.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));
  }));
})();

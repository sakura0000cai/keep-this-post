/* 内嵌 SVG 素材：横幅、照片、头像、广告。全部手绘，不引用外部图片。 */
(function(){
  const A=G.art={};
  // 老照片/扫描件的颗粒感：灰色噪点以正片叠底盖在画面上
  A.grain='<filter id="ng" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#ng)" opacity=".14" style="mix-blend-mode:multiply"/>';

  // 学校网站顶部横幅：校园实景照片（img/banner.jpg，已统一调色）上压红色渐变、校徽和校名
  A.banner=()=>`<svg viewBox="0 0 1000 190" preserveAspectRatio="xMidYMid slice" role="img" aria-label="临川市第七中学校园横幅">
  <defs>
    <linearGradient id="bred" x1="0" x2="1"><stop offset="0" stop-color="#9e1510" stop-opacity=".93"/><stop offset=".36" stop-color="#c0291f" stop-opacity=".72"/><stop offset=".6" stop-color="#c0291f" stop-opacity="0"/></linearGradient>
    <linearGradient id="bfoot" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#7a0f0b" stop-opacity="0"/><stop offset="1" stop-color="#7a0f0b" stop-opacity=".6"/></linearGradient>
    <radialGradient id="bflare"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".3" stop-color="#ffe6b0" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <image href="img/banner.jpg" width="1000" height="190" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1000" height="190" fill="url(#bred)"/>
  <rect width="1000" height="190" fill="url(#bfoot)"/>
  <circle cx="930" cy="18" r="60" fill="url(#bflare)"/><circle cx="820" cy="70" r="8" fill="#fff" opacity=".3"/>
  <g transform="translate(36 30)">
    <circle r="40" cx="40" cy="40" fill="none" stroke="#fff" stroke-width="3"/>
    <circle r="32" cx="40" cy="40" fill="none" stroke="#fff" stroke-width="1.2"/>
    <text x="40" y="52" text-anchor="middle" font-size="34" font-family="KaiTi,STKaiti,serif" fill="#fff" font-weight="bold">七</text>
    <text x="40" y="70" text-anchor="middle" font-size="8" fill="#fff" font-family="Arial">1958</text>
  </g>
  <text x="130" y="72" font-family="STXingkai,'华文行楷',KaiTi,STKaiti,serif" font-size="46" fill="#fff" stroke="#7a0f0b" stroke-width="5" paint-order="stroke" letter-spacing="4">临川市第七中学</text>
  <text x="134" y="94" font-family="Georgia,serif" font-size="12" fill="#fff" letter-spacing="2.5">LINCHUAN NO.7 MIDDLE SCHOOL</text>
  <text x="970" y="38" text-anchor="end" font-family="KaiTi,STKaiti,serif" font-size="22" fill="#fff" letter-spacing="6" stroke="#9e1c15" stroke-width="3" paint-order="stroke">省级示范性普通高级中学</text>
  <text x="840" y="150" text-anchor="middle" font-family="STXingkai,'华文行楷',KaiTi,serif" font-size="40" fill="#fff" stroke="#8a130e" stroke-width="6" paint-order="stroke" letter-spacing="10">明德 笃学 求真</text>
</svg>`;

  // 文化节合照。mode: 'web' 官网发布版（抹去第二排第七人），'original' 原片
  A.groupPhoto=(mode='web')=>{
    let people='';
    const skin=['#e2bf9d','#d8b08c','#e8c7a6','#d4a985'],coat=['#1f3a68','#24406f','#2b4777'];
    for(let row=0;row<2;row++)for(let i=0;i<10;i++){
      const x=78+i*67+(row?14:0),y=row?250:185,lin=row===1&&i===6;
      if(lin&&mode==='web')continue;
      people+=`<g><path d="M${x-22} ${y+70}L${x-19} ${y+20}Q${x} ${y+8} ${x+19} ${y+20}L${x+22} ${y+70}Z" fill="${coat[(i+row)%3]}"/>
      <path d="M${x-6} ${y+19}L${x} ${y+34}L${x+6} ${y+19}" fill="#fff"/>
      <ellipse cx="${x}" cy="${y}" rx="13" ry="16" fill="${skin[(i*3+row)%4]}"/>
      <path d="M${x-14} ${y+2}Q${x-16} ${y-22} ${x} ${y-19}Q${x+16} ${y-20} ${x+14} ${y+2}L${x+11} ${y-7}L${x-11} ${y-7}Z" fill="#231c18"/>
      ${lin?`<path d="M${x-13} ${y-2}Q${x-19} ${y+22} ${x-15} ${y+30}M${x+13} ${y-2}Q${x+19} ${y+22} ${x+15} ${y+30}" stroke="#231c18" stroke-width="5" fill="none"/>
      <rect x="${x-26}" y="${y+34}" width="52" height="26" fill="#fff6dc" stroke="#b5221c" stroke-width="2"/>
      <text x="${x}" y="${y+51}" text-anchor="middle" font-size="12" fill="#b5221c" font-family="SimHei,sans-serif">广播站</text>`:''}</g>`;
    }
    const fix=mode==='web'?`<rect x="470" y="232" width="56" height="88" fill="#c7b9a4" opacity=".55"/>`:'';
    return `<svg viewBox="0 0 760 340" role="img" aria-label="2019 年第十三届校园文化节高二（3）班合影${mode==='web'?'（官网发布版）':'（原片）'}">
    <rect width="760" height="340" fill="#cbbda7"/>
    <rect x="0" y="0" width="760" height="230" fill="#d9cdb8"/>
    <g fill="#a8b8c2" stroke="#8b7d68" stroke-width="3"><rect x="30" y="30" width="110" height="80"/><rect x="190" y="30" width="110" height="80"/><rect x="460" y="30" width="110" height="80"/><rect x="620" y="30" width="110" height="80"/></g>
    <rect x="330" y="20" width="100" height="160" fill="#7c5a3c"/><rect x="336" y="26" width="88" height="154" fill="#8c6a4a"/>
    <rect x="440" y="60" width="64" height="26" fill="#f4efe2" stroke="#6a5a45"/><text x="472" y="74" text-anchor="middle" font-size="10" font-family="SimHei,sans-serif" fill="#333">B203</text><text x="472" y="83" text-anchor="middle" font-size="7" font-family="SimSun,serif" fill="#555">音乐教室</text>
    <rect x="120" y="128" width="520" height="34" fill="#c81f1a"/><text x="380" y="151" text-anchor="middle" fill="#ffe9a8" font-family="SimHei,sans-serif" font-size="18" letter-spacing="4">临川七中第十三届校园文化节</text>
    ${people}${fix}
    <rect y="320" width="760" height="20" fill="#b9a98f"/>
    <text x="748" y="334" text-anchor="end" font-size="13" fill="#ff8a1e" font-family="'Courier New',monospace" font-weight="bold">'19 11 08</text>
    ${A.grain}</svg>`;
  };

  // C 结局：七年后老榕树下的重聚。左一是林知夏，左二是陈默
  A.reunion=()=>{
    let people='';
    const coats=['#7a3b3b','#2f4a6d','#5f8d6a','#8e6b3e','#4e5d6c','#6d4f7a','#3f6d5a','#9a5b3a'];
    for(let i=0;i<10;i++){
      const x=150+i*52,y=232+(i%2)*6,lin=i===0;
      people+=`<g><path d="M${x-18} ${y+62}L${x-15} ${y+18}Q${x} ${y+8} ${x+15} ${y+18}L${x+18} ${y+62}Z" fill="${coats[i%8]}"/>
      <ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="${['#e2bf9d','#d8b08c','#e8c7a6'][i%3]}"/>
      <path d="M${x-12} ${y+2}Q${x-14} ${y-19} ${x} ${y-17}Q${x+14} ${y-18} ${x+12} ${y+2}L${x+9} ${y-6}L${x-9} ${y-6}Z" fill="#231c18"/>
      ${lin?`<path d="M${x-11} ${y-2}Q${x-17} ${y+20} ${x-13} ${y+28}M${x+11} ${y-2}Q${x+17} ${y+20} ${x+13} ${y+28}" stroke="#231c18" stroke-width="5" fill="none"/>`:''}</g>`;
    }
    return `<svg viewBox="0 0 760 340" role="img" aria-label="2021 届高二（3）班校友在老榕树下合影">
    <rect width="760" height="340" fill="#f2e3c6"/><rect y="270" width="760" height="70" fill="#c9b48e"/>
    <rect x="360" y="80" width="40" height="200" fill="#6b4a33"/><path d="M380 140L300 190M380 150L470 200" stroke="#6b4a33" stroke-width="9"/>
    <g fill="#3f6d37"><circle cx="380" cy="80" r="95"/><circle cx="270" cy="120" r="70"/><circle cx="500" cy="120" r="72"/><circle cx="200" cy="150" r="45"/><circle cx="570" cy="150" r="48"/></g>
    <g stroke="#6b4a33" stroke-width="2">${Array.from({length:12},(_,k)=>`<path d="M${300+k*14} 170V${215+(k%3)*12}"/>`).join('')}</g>
    ${people}
    <rect x="140" y="20" width="480" height="30" fill="#c81f1a"/><text x="380" y="41" text-anchor="middle" fill="#ffe9a8" font-family="SimHei,sans-serif" font-size="16" letter-spacing="3">2021届高二（3）班 · 一个都不能少</text>
    <text x="748" y="334" text-anchor="end" font-size="13" fill="#ff8a1e" font-family="'Courier New',monospace" font-weight="bold">'26 11 14</text>
    ${A.grain}</svg>`;
  };

  // 首页轮播的校园照片（img/s1-s4.jpg，已统一调色）
  const scenes=['教学楼','图书馆','运动场','老榕树'];
  A.sceneCount=scenes.length;
  A.scene=i=>`<img src="img/s${i+1}.jpg" alt="${scenes[i]}" width="600" height="420">`;

  // 论坛顶部横幅广告（虚构商家）
  A.forumAd=()=>`<svg viewBox="0 0 800 120" preserveAspectRatio="none" role="img" aria-label="广告：七中北门青春书店">
  <defs><linearGradient id="adg" x1="0" x2="1"><stop offset="0" stop-color="#fff3e6"/><stop offset=".55" stop-color="#ffd9c7"/><stop offset="1" stop-color="#ff9a7a"/></linearGradient></defs>
  <rect width="800" height="120" fill="url(#adg)"/>
  <g opacity=".85">${['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa'].map((c,k)=>`<path d="M${560+k*28} 0L${620+k*28} 0L${500+k*28} 120L${440+k*28} 120Z" fill="${c}"/>`).join('')}</g>
  <g fill="#1e88e5" opacity=".5">${Array.from({length:30},(_,k)=>`<rect x="${330+(k%10)*18}" y="${20+Math.floor(k/10)*18}" width="${10-Math.floor(k/10)*3}" height="${10-Math.floor(k/10)*3}"/>`).join('')}</g>
  <rect x="24" y="20" width="110" height="80" rx="6" fill="#c62828"/><text x="79" y="58" text-anchor="middle" fill="#fff" font-size="22" font-family="SimHei,sans-serif">青春</text><text x="79" y="84" text-anchor="middle" fill="#ffe082" font-size="16" font-family="SimHei,sans-serif">书 店</text>
  <text x="160" y="58" fill="#b71c1c" font-size="30" font-family="SimHei,sans-serif" font-weight="bold">教辅资料 <tspan fill="#e65100" font-size="38">全场八折</tspan></text>
  <text x="162" y="92" fill="#5d4037" font-size="15" font-family="SimSun,serif">七中北门往东 50 米 · 复印 打印 装订 · 办理学生会员卡送笔记本</text>
  ${A.grain}</svg>`;

  // 论坛头像
  A.avatar=(ch,color)=>`<svg viewBox="0 0 80 80" class="ava" role="img" aria-label="头像"><rect width="80" height="80" fill="${color}"/><circle cx="40" cy="32" r="14" fill="#fff" opacity=".35"/><path d="M12 80Q40 46 68 80Z" fill="#fff" opacity=".35"/><text x="40" y="50" text-anchor="middle" font-size="28" fill="#fff" font-family="KaiTi,STKaiti,serif">${ch}</text>${A.grain}</svg>`;
})();

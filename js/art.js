/* 内嵌 SVG 素材：横幅、照片、头像、广告。全部手绘，不引用外部图片。 */
(function(){
  const A=G.art={};

  // 学校网站顶部横幅
  A.banner=()=>`<svg viewBox="0 0 1000 190" preserveAspectRatio="xMidYMid slice" role="img" aria-label="临川市第七中学校园横幅">
  <defs>
    <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9584c"/><stop offset=".55" stop-color="#f3a58f"/><stop offset="1" stop-color="#fde3d3"/></linearGradient>
    <pattern id="bwin" width="22" height="19" patternUnits="userSpaceOnUse"><rect width="22" height="19" fill="#c0392f"/><rect x="4" y="4" width="13" height="10" fill="#f1ede4"/><rect x="4" y="4" width="13" height="3" fill="#9fb3bf"/></pattern>
    <pattern id="bwin2" width="18" height="16" patternUnits="userSpaceOnUse"><rect width="18" height="16" fill="#d9d2c4"/><rect x="3" y="3" width="11" height="9" fill="#7f97a6"/></pattern>
  </defs>
  <rect width="1000" height="190" fill="url(#bsky)"/>
  <path d="M0 120Q120 70 260 105T520 95T780 80T1000 100V190H0Z" fill="#6f9a5a"/>
  <path d="M0 140Q200 110 400 135T800 125T1000 135V190H0Z" fill="#4f7e43"/>
  <rect x="40" y="70" width="330" height="110" fill="url(#bwin)"/>
  <rect x="40" y="62" width="330" height="10" fill="#8d1f18"/>
  <rect x="180" y="40" width="54" height="140" fill="#b3322a"/>
  <rect x="176" y="34" width="62" height="8" fill="#7d1a14"/>
  <circle cx="207" cy="62" r="13" fill="#f6efe1" stroke="#7d1a14" stroke-width="2"/>
  <path d="M207 53V62L213 66" stroke="#7d1a14" stroke-width="2" fill="none"/>
  <rect x="196" y="150" width="22" height="30" fill="#5d150f"/>
  <rect x="610" y="96" width="260" height="84" fill="url(#bwin2)"/>
  <rect x="610" y="90" width="260" height="8" fill="#9b9283"/>
  <g fill="#3f6d37"><circle cx="20" cy="160" r="30"/><circle cx="395" cy="160" r="26"/><circle cx="430" cy="150" r="32"/><circle cx="590" cy="160" r="28"/><circle cx="900" cy="150" r="36"/><circle cx="960" cy="165" r="30"/></g>
  <rect x="0" y="176" width="1000" height="14" fill="#e3d7c3"/>
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
    </svg>`;
  };

  // 首页轮播的小幅校园照片
  const scenes=[
    ['#cfe0ec','<rect x="30" y="70" width="240" height="110" fill="#c0392f"/><g fill="#f2ece0">'+Array.from({length:24},(_,k)=>`<rect x="${44+(k%8)*28}" y="${84+Math.floor(k/8)*30}" width="16" height="18"/>`).join('')+'</g><rect x="130" y="40" width="40" height="140" fill="#a82d24"/><circle cx="150" cy="62" r="10" fill="#fff"/>','教学楼'],
    ['#e6dccb','<rect x="40" y="80" width="220" height="100" fill="#d8cdb6"/><rect x="40" y="70" width="220" height="14" fill="#8b4a2f"/><g fill="#5f7c8d">'+Array.from({length:6},(_,k)=>`<rect x="${58+k*34}" y="100" width="20" height="60"/>`).join('')+'</g><text x="150" y="64" text-anchor="middle" font-size="16" fill="#8b4a2f" font-family="KaiTi,serif">图 书 馆</text>','图书馆'],
    ['#d7e7d0','<rect x="0" y="120" width="300" height="90" fill="#b5462f"/><path d="M20 165H280M40 140H260M0 190H300" stroke="#fff" stroke-width="2"/><rect x="0" y="105" width="300" height="15" fill="#5f8d4e"/><g fill="#24406f"><circle cx="80" cy="150" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="210" cy="145" r="6"/></g>','运动场'],
    ['#f0e1cc','<rect x="138" y="90" width="24" height="100" fill="#6b4a33"/><path d="M150 120L100 150M150 130L205 160" stroke="#6b4a33" stroke-width="6"/><g fill="#3f6d37"><circle cx="150" cy="70" r="55"/><circle cx="95" cy="95" r="40"/><circle cx="210" cy="95" r="42"/></g><g stroke="#6b4a33" stroke-width="1.5">'+Array.from({length:8},(_,k)=>`<path d="M${110+k*11} 115V${150+(k%3)*12}"/>`).join('')+'</g>','老榕树']
  ];
  A.sceneCount=scenes.length;
  A.scene=i=>`<svg viewBox="0 0 300 210" role="img" aria-label="${scenes[i][2]}"><rect width="300" height="210" fill="${scenes[i][0]}"/>${scenes[i][1]}<rect width="300" height="210" fill="none" stroke="#fff" stroke-width="2"/></svg>`;

  // 论坛顶部横幅广告（虚构商家）
  A.forumAd=()=>`<svg viewBox="0 0 800 120" preserveAspectRatio="none" role="img" aria-label="广告：七中北门青春书店">
  <defs><linearGradient id="adg" x1="0" x2="1"><stop offset="0" stop-color="#fff3e6"/><stop offset=".55" stop-color="#ffd9c7"/><stop offset="1" stop-color="#ff9a7a"/></linearGradient></defs>
  <rect width="800" height="120" fill="url(#adg)"/>
  <g opacity=".85">${['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa'].map((c,k)=>`<path d="M${560+k*28} 0L${620+k*28} 0L${500+k*28} 120L${440+k*28} 120Z" fill="${c}"/>`).join('')}</g>
  <g fill="#1e88e5" opacity=".5">${Array.from({length:30},(_,k)=>`<rect x="${330+(k%10)*18}" y="${20+Math.floor(k/10)*18}" width="${10-Math.floor(k/10)*3}" height="${10-Math.floor(k/10)*3}"/>`).join('')}</g>
  <rect x="24" y="20" width="110" height="80" rx="6" fill="#c62828"/><text x="79" y="58" text-anchor="middle" fill="#fff" font-size="22" font-family="SimHei,sans-serif">青春</text><text x="79" y="84" text-anchor="middle" fill="#ffe082" font-size="16" font-family="SimHei,sans-serif">书 店</text>
  <text x="160" y="58" fill="#b71c1c" font-size="30" font-family="SimHei,sans-serif" font-weight="bold">教辅资料 <tspan fill="#e65100" font-size="38">全场八折</tspan></text>
  <text x="162" y="92" fill="#5d4037" font-size="15" font-family="SimSun,serif">七中北门往东 50 米 · 复印 打印 装订 · 办理学生会员卡送笔记本</text>
  </svg>`;

  // 论坛头像
  A.avatar=(ch,color)=>`<svg viewBox="0 0 80 80" class="ava" role="img" aria-label="头像"><rect width="80" height="80" fill="${color}"/><circle cx="40" cy="32" r="14" fill="#fff" opacity=".35"/><path d="M12 80Q40 46 68 80Z" fill="#fff" opacity=".35"/><text x="40" y="50" text-anchor="middle" font-size="28" fill="#fff" font-family="KaiTi,STKaiti,serif">${ch}</text></svg>`;
})();

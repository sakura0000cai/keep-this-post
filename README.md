# 请不要删除这条帖子

中文校园 ARG 网页解谜游戏（完整五幕、三个结局，约 45–60 分钟）。玩家是 2026 年的陈默，在母校旧论坛关闭前的最后一小时，调查七年前好友林知夏的死亡，通过一条能跨越时间的帖子与 2019 年的自己通信，改变那一天，以及那之后的每一天。

所有学校、人物、网址均为虚构。不联网、无外部素材，图片全部为内嵌 SVG。

> 内容提示：本作涉及校园霸凌与学生离世，表达克制，无惊吓画面。

## 两个网站

游戏由两个独立网页组成，用真实浏览器的地址栏和标签页在两者之间切换：

- 学校官网：`dist/index.html`（在线：https://sakura0000cai.github.io/keep-this-post/ ）
- 旧校园论坛：`dist/bbs/index.html`（在线：https://sakura0000cai.github.io/keep-this-post/bbs/ ）

玩家从官网开始，论坛入口需要自己找到。两个网站同源，进度自动共享；同时开着两个标签页时，一边的进展会同步到另一边。网页里没有任何游戏界面（笔记、提示按钮等），卡关时请看 `制作说明与验收.md` 的谜题表。

重新开始：在任一网站地址后加 `?reset` 打开一次，例如 `…/keep-this-post/?reset`。

## 本地运行

推荐运行 `node server.cjs`（或 `python -m http.server 4173 --directory dist`），访问 http://127.0.0.1:4173/ ，论坛为 http://127.0.0.1:4173/bbs/ 。直接双击 html 文件也能玩，但在 `file://` 下手动拼论坛地址不方便。

## 目录

```
dist/
  index.html          学校官网入口
  bbs/index.html      论坛入口
  css/school.css      官网：2010 年前后院校门户，红色主调
  css/forum.css       论坛：2000 年代中文社区版式，红色主调
  js/core.js          存档（两站共享）、游戏内时间、通用工具
  js/art.js           内嵌 SVG：横幅、合照、校园照片、广告、头像
  js/data-school.js   官网文章、班级名单
  js/data-forum.js    论坛用户、版块、帖子、心情、短消息
  js/school.js        官网页面
  js/forum.js         论坛页面与谜题判定
  js/story.js         跨时间回复
  js/site.js          页面入口：路由、时钟、跨标签同步
```

无构建步骤，脚本按顺序以普通 `<script>` 加载，挂在全局 `G` 上。

## 发布到 GitHub Pages

`gh-pages` 分支内容即 `dist/`：

```
git subtree split --prefix dist main -b pages-tmp
git push origin main pages-tmp:gh-pages
git branch -D pages-tmp
```

`制作说明与验收.md` 含完整谜底，首次试玩前请勿阅读。

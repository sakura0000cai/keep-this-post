"""烘焙复古图片：B1 隶书校徽、整张横幅 JPEG、低分辨率轮播照片。
用法：python bake.py <下载原图目录> <输出目录>"""
import math,sys,pathlib
from PIL import Image,ImageDraw,ImageFont,ImageEnhance,ImageFilter,ImageChops

src=pathlib.Path(sys.argv[1]);dst=pathlib.Path(sys.argv[2]);dst.mkdir(parents=True,exist_ok=True)
FONTS='C:/Windows/Fonts/'
LISHU=FONTS+'SIMLI.TTF';XINGKAI=FONTS+'STXINGKA.TTF';TIMESB=FONTS+'timesbd.ttf';GEORGIA=FONTS+'georgia.ttf'
RED,DARK,MID,GOLD,PAPER,FLAME,FLAME2='#8e1210','#7a1512','#c62820','#e8c36a','#fff7ec','#ffd36a','#fff4c2'

def bez(p0,p1,p2,p3,n=16):
    return [tuple((1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d for a,b,c,d in zip(p0,p1,p2,p3)) for t in (i/n for i in range(n+1))]
def quad(p0,p1,p2,n=12):
    return [tuple((1-t)**2*a+2*(1-t)*t*b+t*t*c for a,b,c in zip(p0,p1,p2)) for t in (i/n for i in range(n+1))]

def arc_text(im,text,font,radius,center,mid_deg,step_deg,top=True,fill=GOLD):
    """沿圆弧逐字排布：top=True 在上半圈从左到右，False 在下半圈从左到右（字头朝圆心外/内都保持正读）"""
    cx,cy=center;n=len(text)
    for i,ch in enumerate(text):
        off=(i-(n-1)/2)*step_deg
        ang=mid_deg+off if top else mid_deg-off
        a=math.radians(ang)
        x,y=cx+radius*math.cos(a),cy+radius*math.sin(a)
        size=int(font.size*1.6)
        g=Image.new('RGBA',(size,size),(0,0,0,0))
        ImageDraw.Draw(g).text((size/2,size/2),ch,font=font,fill=fill,anchor='mm')
        rot=-(ang+90) if top else -(ang-90)
        g=g.rotate(rot,resample=Image.BICUBIC,expand=True)
        im.alpha_composite(g,(int(x-g.width/2),int(y-g.height/2)))

def emblem(d):
    """B1 书本火炬校徽，直径 d 像素。先 4 倍绘制再缩小"""
    k=4;S=d*k;u=S/2/68  # 设计稿单位：半径 68
    im=Image.new('RGBA',(S,S),(0,0,0,0));dr=ImageDraw.Draw(im)
    c=S/2;P=lambda x,y:(c+x*u,c+y*u)
    def circ(r,**kw):dr.ellipse([c-r*u,c-r*u,c+r*u,c+r*u],**kw)
    circ(68,fill=RED);circ(64,outline=GOLD,width=int(2*u));circ(48,fill=MID,outline=GOLD,width=int(2*u))
    for sx in (-1,1):
        pts=[P(*q) for q in quad((-34*sx,14),(-17*sx,6),(-1*sx,14))]+[P(-1*sx,30)]+[P(*q) for q in quad((-1*sx,30),(-17*sx,22),(-34*sx,30))]
        dr.polygon(pts,fill=PAPER)
        for yy in (16,21):
            dr.line([P(*q) for q in quad((-27*sx,yy),(-16*sx,yy-5),(-5*sx,yy+1))],fill='#c9b48e',width=max(1,int(u)))
    dr.polygon([P(-5,10),P(5,10),P(2,-14),P(-2,-14)],fill=GOLD)
    dr.rectangle([P(-5,-18),P(5,-13)],fill=GOLD)
    flame=bez((0,-18),(-12,-28),(-6,-38),(0,-48))+bez((0,-48),(2,-38),(12,-34),(6,-24))+bez((6,-24),(10,-28),(10,-32),(9,-35))+bez((9,-35),(16,-26),(10,-18),(0,-18))
    dr.polygon([P(*q) for q in flame],fill=FLAME)
    inner=bez((0,-20),(-5,-26),(-2,-32),(1,-38))+bez((1,-38),(3,-31),(7,-28),(3,-21))
    dr.polygon([P(*q) for q in inner],fill=FLAME2)
    arc_text(im,'临川市第七中学',ImageFont.truetype(LISHU,int(15.5*u)),57*u,(c,c),-90,17.5,top=True)
    arc_text(im,'★ 1958 ★',ImageFont.truetype(TIMESB,int(11*u)),57*u,(c,c),90,8.2,top=False)
    return im.resize((d,d),Image.LANCZOS)

def gif_like(im,colors=48):
    """压成调色板图：透明边缘一刀切，像老 GIF"""
    a=im.getchannel('A').point(lambda v:255 if v>110 else 0)
    rgb=Image.new('RGB',im.size,(255,255,255));rgb.paste(im,mask=a)
    q=rgb.quantize(colors,method=Image.MEDIANCUT,dither=Image.NONE).convert('RGBA');q.putalpha(a)
    return q

def grade(im,size,soft=1.0):
    im=im.convert('RGB')
    if soft<1:  # 先缩小再放大：低像素相机的糊
        im=im.resize((max(1,int(size[0]*soft)),max(1,int(size[1]*soft))),Image.BILINEAR)
    im=im.resize(size,Image.BILINEAR)
    im=ImageEnhance.Color(im).enhance(.72);im=ImageEnhance.Contrast(im).enhance(.92)
    im=ImageChops.multiply(im,Image.new('RGB',size,(255,238,212)))
    im=Image.blend(im,Image.new('RGB',size,(70,60,52)),.12)
    noise=Image.effect_noise(size,22).convert('RGB')
    im=Image.blend(im,ImageChops.overlay(im,noise),.3)
    w,h=size;m=Image.new('L',size,0);m.paste(255,(int(w*.06),int(h*.08),int(w*.94),int(h*.92)))
    m=m.filter(ImageFilter.GaussianBlur(min(w,h)*.18))
    return Image.composite(im,ImageChops.multiply(im,Image.new('RGB',size,(150,140,130))),m)

def hgrad(size,stops):
    """横向渐变（RGBA）：stops=[(位置0-1,(r,g,b,a)),...]"""
    w,h=size;row=Image.new('RGBA',(w,1))
    for x in range(w):
        t=x/(w-1)
        for (p0,c0),(p1,c1) in zip(stops,stops[1:]):
            if p0<=t<=p1:
                f=(t-p0)/(p1-p0) if p1>p0 else 0
                row.putpixel((x,0),tuple(int(a+(b-a)*f) for a,b in zip(c0,c1)));break
        else:row.putpixel((x,0),stops[-1][1])
    return row.resize(size)

def text_stroke(dr,xy,s,font,fill,stroke,sw,**kw):
    dr.text(xy,s,font=font,fill=fill,stroke_width=sw,stroke_fill=stroke,**kw)

# —— 校徽 ——
e=emblem(132)
gif_like(e).save(dst/'emblem.png')
gif_like(emblem(48),32).save(dst/'emblem-48.png')
gif_like(emblem(32),24).save(dst/'favicon.png')

# —— 横幅：照片 + 红色渐变 + 校徽 + 校名，烘成一张 JPEG ——
W,H=1000,190
photo=Image.open(src/'c01.jpg').crop((0,110,1280,353))
base=grade(photo,(W,H),soft=.55).convert('RGBA')
base.alpha_composite(hgrad((W,H),[(0,(158,21,16,238)),(.36,(192,41,31,184)),(.6,(192,41,31,0)),(1,(192,41,31,0))]))
foot=Image.new('RGBA',(1,H))
for y in range(H):foot.putpixel((0,y),(122,15,11,int(max(0,(y/H-.55)/.45)*150)))
base.alpha_composite(foot.resize((W,H)))
fl=Image.new('RGBA',(W,H),(0,0,0,0));fd=ImageDraw.Draw(fl)
for r in range(60,0,-2):fd.ellipse([930-r,18-r,930+r,18+r],fill=(255,240,200,int(140*(1-r/60)**1.6)))
base.alpha_composite(fl)
base.alpha_composite(e.resize((116,116),Image.LANCZOS),(22,37))
dr=ImageDraw.Draw(base)
text_stroke(dr,(152,94),'临川市第七中学',ImageFont.truetype(XINGKAI,50),'#ffffff','#7a0f0b',4,anchor='ls')
dr.text((156,118),'L I N C H U A N   N O . 7   M I D D L E   S C H O O L',font=ImageFont.truetype(GEORGIA,11),fill='#ffffff',anchor='ls')
text_stroke(dr,(972,40),'省级示范性普通高级中学',ImageFont.truetype(LISHU,24),'#ffffff','#9e1c15',3,anchor='rs')
text_stroke(dr,(965,160),'明德　笃学　求真',ImageFont.truetype(LISHU,38),'#ffffff','#8a130e',4,anchor='rs')
base.convert('RGB').save(dst/'banner.jpg','JPEG',quality=48,optimize=True)

# —— 轮播照片：存成实际显示尺寸、更糊、压缩更重 ——
for f,box,out in [('c02.jpg',(0,60,1280,956),'s1.jpg'),('c05.jpg',(0,95,900,640),'s2.jpg'),('c03.jpg',(0,110,1280,1006),'s3.jpg'),('c04.jpg',(0,0,1280,896),'s4.jpg')]:
    grade(Image.open(src/f).crop(box),(300,210),soft=.7).save(dst/out,'JPEG',quality=45,optimize=True)
for f in sorted(dst.iterdir()):print(f.name,f.stat().st_size)

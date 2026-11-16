# -*- coding: utf-8 -*-
"""生成 B 站视频封面：锁暝 · 伞下故影"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1920, 1080
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "B站封面"

F_BRUSH = str(ROOT / "src/assets/fonts/MaShanZheng-Regular.ttf")
F_BOLD = "C:/Windows/Fonts/simhei.ttf"          # 中文黑体，字重够、不缺字
F_TEXT = "C:/Windows/Fonts/msyh.ttc"            # 微软雅黑
F_TEXT_BD = "C:/Windows/Fonts/msyhbd.ttc"       # 微软雅黑 粗体
F_MONO = "C:/Windows/Fonts/consolab.ttf"        # 网址用等宽
F_LATIN = "C:/Windows/Fonts/SourceHanSansJP-Bold.otf"

GOLD = (194, 160, 97)
GOLD_LT = (242, 221, 171)
RED = (192, 20, 47)
RED_LT = (255, 58, 86)


# ---------------------------------------------------------------- 基础工具
def cover_crop(img, tw, th, fx=0.5, fy=0.5):
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    nw, nh = int(round(sw * scale)), int(round(sh * scale))
    img = img.resize((nw, nh), Image.LANCZOS)
    left = int(round((nw - tw) * fx))
    top = int(round((nh - th) * fy))
    return img.crop((left, top, left + tw, top + th))


def linear_alpha(size, hor=False, start=0.0, end=1.0, stop=1.0, flip=False):
    w, h = size
    n = w if hor else h
    core = max(2, int(round(n * stop)))
    ramp = np.linspace(start, end, core)
    if core < n:
        ramp = np.concatenate([ramp, np.full(n - core, ramp[-1])])
    if flip:
        ramp = ramp[::-1]
    ramp = (np.clip(ramp, 0, 1) * 255).astype(np.uint8)
    arr = np.tile(ramp, (h, 1)) if hor else np.tile(ramp.reshape(-1, 1), (1, w))
    return Image.fromarray(arr, "L")


def add_scrim(canvas, mask, color, strength=1.0):
    layer = Image.new("RGBA", canvas.size, color + (0,))
    layer.putalpha(mask.point(lambda v: int(v * strength)))
    canvas.alpha_composite(layer)


def vgrad(size, top, bottom):
    w, h = size
    t = np.linspace(0, 1, h).reshape(-1, 1, 1)
    arr = (np.array(top).reshape(1, 1, 3) * (1 - t)
           + np.array(bottom).reshape(1, 1, 3) * t)
    arr = np.repeat(arr, w, axis=1).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def text_mask(size, xy, text, font, anchor="la", stroke=0, spacing=0, tight=1.0):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    if tight != 1.0 and spacing == 0 and len(text) > 1:
        x, y = xy
        for ch in text:
            d.text((x, y), ch, font=font, fill=255, anchor=anchor,
                   stroke_width=stroke, stroke_fill=255)
            x += d.textlength(ch, font=font) * tight
        return m
    if spacing:
        x, y = xy
        for ch in text:
            d.text((x, y), ch, font=font, fill=255, anchor=anchor,
                   stroke_width=stroke, stroke_fill=255)
            x += d.textlength(ch, font=font) + spacing
        return m
    d.text(xy, text, font=font, fill=255, anchor=anchor,
           stroke_width=stroke, stroke_fill=255)
    return m


def paste_text(base, xy, text, font, anchor="la", top=GOLD_LT, bottom=GOLD,
               glow=None, glow_r=26, glow_a=150, stroke=0, spacing=0,
               tight=1.0):
    mask = text_mask(base.size, xy, text, font, anchor, stroke, spacing, tight)
    if mask.getbbox() is None:
        return mask

    if glow:
        wide = mask.filter(ImageFilter.GaussianBlur(glow_r * 2.6))
        wide = wide.point(lambda v: int(v * glow_a * 0.55 / 255))
        add_scrim(base, wide, glow)
        mid = mask.filter(ImageFilter.GaussianBlur(max(3, glow_r // 3)))
        mid = mid.point(lambda v: int(v * glow_a / 255))
        add_scrim(base, mid, glow)

    tinted = Image.new("RGBA", base.size, (0, 0, 0, 0))
    tinted.paste(vgrad(base.size, top, bottom).convert("RGBA"), (0, 0))
    tinted.putalpha(mask)
    base.alpha_composite(tinted)
    return mask


# ---------------------------------------------------------------- 主流程
def build(src, name, *, fx, fy, title_xy, sub_xy, rule_x, info_xy,
          seal_xy, banner_xy, left_scrim, bottom_scrim, note_offset=(24, 0),
          title_size=300, sub_size=114, note_pos=None):

    base_img = cover_crop(Image.open(ROOT / src).convert("RGB"), W, H, fx, fy)

    # 调色：压暗、提红、降蓝
    arr = np.asarray(base_img).astype(np.float32) / 255.0
    lum = arr @ np.array([0.299, 0.587, 0.114])
    shadow = np.clip(lum * 1.15, 0, 1)[..., None]
    graded = arr * (0.60 + 0.40 * shadow)
    graded[..., 0] *= 1.07
    graded[..., 1] *= 0.97
    graded[..., 2] *= 0.90
    canvas = Image.fromarray((np.clip(graded, 0, 1) * 255).astype(np.uint8),
                             "RGB").convert("RGBA")

    # 左 / 下 / 上 压暗
    add_scrim(canvas, linear_alpha((W, H), True, left_scrim, 0.0, 0.62), (4, 2, 5))
    add_scrim(canvas, linear_alpha((W, H), False, 0.0, bottom_scrim, 1.0, flip=True),
              (3, 1, 4), 0.85)
    add_scrim(canvas, linear_alpha((W, H), False, 0.55, 0.0, 0.24), (2, 1, 3), 0.9)

    # 暗角
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.sqrt(((xx - W * 0.58) / W) ** 2 + ((yy - H * 0.48) / H) ** 2)
    vig = (np.clip((dist - 0.28) / 0.52, 0, 1) ** 1.5 * 205).astype(np.uint8)
    add_scrim(canvas, Image.fromarray(vig, "L"), (0, 0, 0))

    # 右上角再压一层：盖住原图的 WUTHERING 水印，别和页眉打架
    corner = np.clip(1 - np.sqrt(((xx - (W - 60)) / 420) ** 2
                                 + ((yy - 40) / 300) ** 2), 0, 1) ** 1.4
    add_scrim(canvas, Image.fromarray((corner * 235).astype(np.uint8), "L"),
              (3, 1, 4), 1.0)

    draw = ImageDraw.Draw(canvas)

    # 细金框 + 四角
    inset = 44
    draw.rectangle([inset, inset, W - inset, H - inset], outline=GOLD + (72,), width=1)
    for (x, y, dx, dy) in [(inset, inset, 1, 1), (W - inset, inset, -1, 1),
                           (inset, H - inset, 1, -1), (W - inset, H - inset, -1, -1)]:
        draw.line([(x, y), (x + dx * 74, y)], fill=GOLD_LT + (190,), width=2)
        draw.line([(x, y), (x, y + dy * 74)], fill=GOLD_LT + (190,), width=2)

    # 页眉
    f_kick = ImageFont.truetype(F_LATIN, 25)
    kick = "WUTHERING WAVES  ·  FAN SITE"
    paste_text(canvas, (inset + 30, inset + 26), kick, f_kick,
               top=(232, 222, 208), bottom=(166, 146, 116), spacing=1.2)

    # 主标题 / 副标题
    f_title = ImageFont.truetype(F_BRUSH, title_size)
    paste_text(canvas, title_xy, "锁暝", f_title, top=(255, 249, 241),
               bottom=(204, 158, 104), glow=RED, glow_r=34, glow_a=150,
               tight=0.84)

    f_sub = ImageFont.truetype(F_BRUSH, sub_size)
    paste_text(canvas, sub_xy, "伞下故影", f_sub, top=(246, 226, 190),
               bottom=(180, 134, 82), glow=RED, glow_r=18, glow_a=120, spacing=2)

    # 分隔线 + 菱形
    ry = rule_x[1]
    draw.line([(rule_x[0], ry), (rule_x[0] + 540, ry)], fill=GOLD + (205,), width=2)
    cx = rule_x[0] + 552
    draw.polygon([(cx, ry), (cx + 12, ry - 8), (cx + 24, ry), (cx + 12, ry + 8)],
                 fill=RED_LT + (235,))

    # 说明行
    f_info = ImageFont.truetype(F_TEXT, 33)
    paste_text(canvas, info_xy, "SUOMING · 个人角色专题站", f_info,
               top=(228, 218, 208), bottom=(158, 140, 116), spacing=1.0)

    # 印章
    if seal_xy:
        seal = 96
        seal_layer = Image.new("RGBA", (seal + 40, seal + 40), (0, 0, 0, 0))
        sd = ImageDraw.Draw(seal_layer)
        sd.rectangle([20, 20, 20 + seal, 20 + seal], fill=RED + (208,),
                     outline=(255, 122, 132, 215), width=3)
        sd.rectangle([32, 32, 32 + seal - 24, 32 + seal - 24],
                     outline=(255, 214, 214, 120), width=1)
        f_seal = ImageFont.truetype(F_BRUSH, 62)
        sd.text((20 + seal / 2, 20 + seal / 2 + 4), "契", font=f_seal,
                fill=(255, 242, 238, 242), anchor="mm")
        seal_layer = seal_layer.rotate(-6, resample=Image.BICUBIC,
                                       center=(20 + seal / 2, 20 + seal / 2))
        canvas.alpha_composite(seal_layer, seal_xy)

    # 底部红标签
    tag_text = "鸣潮第二高人气网站"
    f_tag = ImageFont.truetype(F_BOLD, 66)
    tw = draw.textlength(tag_text, font=f_tag)
    pad_x, pad_y = 44, 27
    bw, bh = int(tw + pad_x * 2), int(66 + pad_y * 2)
    tag = Image.new("RGBA", (bw + 80, bh + 80), (0, 0, 0, 0))
    td = ImageDraw.Draw(tag)
    td.rectangle([40, 40, 40 + bw, 40 + bh], fill=(148, 15, 35, 234))
    td.rectangle([40, 40, 40 + bw, 40 + bh], outline=(255, 92, 106, 195), width=2)
    td.rectangle([40 + bw - 16, 40, 40 + bw, 40 + bh], fill=RED + (255,))
    td.text((40 + pad_x, 40 + bh / 2 + 2), tag_text, font=f_tag,
            fill=(255, 247, 241, 255), anchor="lm")
    tag = tag.rotate(-1.3, resample=Image.BICUBIC, expand=False)
    canvas.alpha_composite(tag, banner_xy)

    # 标签右侧的手写小注
    f_note = ImageFont.truetype(F_BRUSH, 36)
    note_xy = note_pos or (banner_xy[0] + bw + 26 + note_offset[0],
                           banner_xy[1] + 40 + bh // 2 + note_offset[1])
    paste_text(canvas, note_xy, "（我自封的）", f_note, anchor="lm",
               top=(238, 228, 214), bottom=(170, 152, 128))
    # 颗粒
    rng = np.random.default_rng(11)
    noise = rng.normal(0, 1, (H, W, 1)).repeat(3, axis=2)
    flat = np.clip(np.asarray(canvas.convert("RGB")).astype(np.float32)
                   + noise * 6.0, 0, 255).astype(np.uint8)
    out = Image.fromarray(flat, "RGB")

    OUT.mkdir(exist_ok=True)
    out.save(OUT / f"{name}-1920x1080.png", optimize=True)
    out.resize((1146, 717), Image.LANCZOS).save(
        OUT / f"{name}-1146x717.jpg", quality=94, subsampling=0)
    print("saved", name)


def draw_run(canvas, xy, text, font, color, glow=None, glow_r=16, spacing=2):
    """逐字排一行（自控字距），返回下一个字的 x。"""
    d = ImageDraw.Draw(canvas)
    x, y = xy
    for ch in text:
        paste_text(canvas, (x, y), ch, font, top=color, bottom=color,
                   glow=glow, glow_r=glow_r, glow_a=135)
        x += d.textlength(ch, font=font) + spacing
    return x


def build_c():
    """亮调版：人物占满画面，底部压暗放标题与网址。"""
    name = "封面C-御姐"
    base_img = cover_crop(
        Image.open(ROOT / "src/assets/images1/1 (2).webp").convert("RGB"),
        W, H, 0.5, 0.44,
    )
    arr = np.asarray(base_img).astype(np.float32) / 255.0
    arr = np.clip((arr ** 0.93) * 1.04, 0, 1)          # 轻微提亮，别糊
    canvas = Image.fromarray((arr * 255).astype(np.uint8), "RGB").convert("RGBA")

    # 底部渐变压暗（给标题一个干净底），加左下角一团，保证网址可读
    yy = np.arange(H, dtype=np.float32).reshape(-1, 1)
    band = (np.clip((yy - 520) / 400.0, 0, 1) ** 1.15 * 246).astype(np.uint8)
    add_scrim(canvas, Image.fromarray(np.tile(band, (1, W)), "L"), (7, 4, 6))

    X, Y = np.mgrid[0:H, 0:W]
    corner = np.clip(1 - np.sqrt(((X - 20) / 900) ** 2
                                 + ((Y - 1120) / 640) ** 2), 0, 1) ** 1.5
    add_scrim(canvas, Image.fromarray((corner * 200).astype(np.uint8), "L"),
              (9, 5, 7))

    d = ImageDraw.Draw(canvas)

    # 左上角小标
    d.polygon([(111, 96), (123, 108), (111, 120), (99, 108)],
              fill=RED_LT + (235,))
    draw_run(canvas, (142, 90), "鸣潮 · 锁暝", ImageFont.truetype(F_TEXT_BD, 28),
             (232, 222, 208), spacing=5)

    # 印章（右上角，避开人物脸）
    seal = 84
    sl = Image.new("RGBA", (seal + 36, seal + 36), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sl)
    sd.rectangle([18, 18, 18 + seal, 18 + seal], fill=RED + (205,),
                 outline=(255, 126, 138, 210), width=3)
    sd.rectangle([29, 29, 29 + seal - 22, 29 + seal - 22],
                 outline=(255, 214, 214, 110), width=1)
    sd.text((18 + seal / 2, 18 + seal / 2 + 4), "契",
            font=ImageFont.truetype(F_BRUSH, 54), fill=(255, 242, 238, 240),
            anchor="mm")
    sl = sl.rotate(-7, resample=Image.BICUBIC, center=(18 + seal / 2, 18 + seal / 2))
    canvas.alpha_composite(sl, (1722, 78))

    # 主标题：感受鸣潮的御姐！
    draw_run(canvas, (110, 682), "锁暝 / SUOMING",
             ImageFont.truetype(F_TEXT_BD, 25), (245, 236, 222), spacing=7)

    f_head = ImageFont.truetype(F_BOLD, 118)
    x = 106
    x = draw_run(canvas, (x, 736), "感受鸣潮的", f_head, (252, 248, 242), spacing=2)
    x = draw_run(canvas, (x, 736), "御姐", f_head, (255, 84, 108),
                 glow=RED, glow_r=24, spacing=2)
    draw_run(canvas, (x, 736), "！", f_head, (252, 248, 242), spacing=2)

    # 分隔线 + 菱形
    ry = 892
    d.line([(110, ry), (468, ry)], fill=GOLD + (145,), width=1)
    d.polygon([(482, ry), (492, ry + 8), (482, ry + 16), (472, ry + 8)],
              fill=RED_LT + (240,))

    draw_run(canvas, (110, 910), "伞下故影 · 一个人做的角色专题站",
             ImageFont.truetype(F_TEXT, 29), (240, 232, 220), spacing=2)

    # 网址
    uy = 962
    d.polygon([(110, uy + 17), (122, uy + 29), (110, uy + 41), (98, uy + 29)],
              fill=RED + (252,))
    draw_run(canvas, (140, uy), "suoming.slty.site",
             ImageFont.truetype(F_MONO, 46), (255, 247, 234), spacing=1)

    # 颗粒
    rng = np.random.default_rng(23)
    noise = rng.normal(0, 1, (H, W, 1)).repeat(3, axis=2)
    flat = np.clip(np.asarray(canvas.convert("RGB")).astype(np.float32)
                   + noise * 5.0, 0, 255).astype(np.uint8)
    out = Image.fromarray(flat, "RGB")

    OUT.mkdir(exist_ok=True)
    out.save(OUT / f"{name}-1920x1080.png", optimize=True)
    out.resize((1146, 717), Image.LANCZOS).save(
        OUT / f"{name}-1146x717.jpg", quality=94, subsampling=0)
    print("saved", name)


def build_d():
    """大字版：标题与网址都放到能当门面的尺寸。"""
    name = "封面D-大字"
    base_img = cover_crop(
        Image.open(ROOT / "src/assets/images1/1 (2).webp").convert("RGB"),
        W, H, 0.5, 0.46,
    )
    arr = np.asarray(base_img).astype(np.float32) / 255.0
    arr = np.clip((arr ** 0.94) * 1.05, 0, 1)
    canvas = Image.fromarray((arr * 255).astype(np.uint8), "RGB").convert("RGBA")

    # 左侧整片压暗 + 底部带，给大字让位
    X = np.arange(W, dtype=np.float32).reshape(1, -1)
    Y = np.arange(H, dtype=np.float32).reshape(-1, 1)
    left = (np.clip(1 - (X - 30) / 980.0, 0, 1) ** 1.9) * 248
    bottom = (np.clip((Y - 850) / 250.0, 0, 1) ** 1.2) * 205
    scrim = np.maximum(left.repeat(H, axis=0), bottom.repeat(W, axis=1))
    add_scrim(canvas, Image.fromarray(scrim.astype(np.uint8), "L"), (12, 7, 9))

    # 标题区一点赤色余光，别让左边发灰
    XX, YY = np.meshgrid(np.arange(W, dtype=np.float32),
                         np.arange(H, dtype=np.float32))
    rad = np.clip(1 - np.sqrt(((XX - 330) / 620) ** 2
                              + ((YY - 620) / 460) ** 2), 0, 1) ** 2
    add_scrim(canvas, Image.fromarray((rad * 92).astype(np.uint8), "L"),
              (150, 20, 34))

    d = ImageDraw.Draw(canvas)

    # 页眉
    draw_run(canvas, (92, 128), "WUTHERING WAVES · FAN SITE",
             ImageFont.truetype(F_TEXT_BD, 23), (214, 176, 116), spacing=7)

    # 红色小牌
    pd = Image.new("RGBA", (300, 70), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(pd)
    pdraw.rectangle([0, 8, 286, 62], fill=RED + (232,))
    pdraw.rectangle([6, 14, 280, 56], outline=(255, 150, 158, 110), width=1)
    canvas.alpha_composite(pd, (92, 176))
    draw_run(canvas, (114, 200), "鸣潮 · 二创站",
             ImageFont.truetype(F_TEXT_BD, 30), (255, 246, 240), spacing=3)

    # 主标题两行
    f1 = ImageFont.truetype(F_BOLD, 150)
    f2 = ImageFont.truetype(F_BOLD, 196)
    draw_run(canvas, (88, 286), "感受鸣潮的", f1, (255, 252, 248),
             glow=(0, 0, 0), glow_r=26, spacing=2, )
    x = draw_run(canvas, (84, 452), "御姐", f2, (255, 66, 96),
                 glow=RED, glow_r=30, spacing=2)
    draw_run(canvas, (x + 4, 452), "！", f2, (255, 252, 248),
             glow=(0, 0, 0), glow_r=26, spacing=2)

    # 分隔线
    d.line([(90, 726), (610, 726)], fill=GOLD + (165,), width=2)
    d.polygon([(628, 726), (640, 738), (628, 750), (616, 738)],
              fill=RED_LT + (245,))

    draw_run(canvas, (90, 748), "伞下故影 · 一个人做的角色专题站",
             ImageFont.truetype(F_TEXT, 36), (238, 230, 218), spacing=3)

    # 网址：大字 + 下方红条
    uf = ImageFont.truetype(F_MONO, 92)
    ux = 90
    ux = draw_run(canvas, (ux, 852), "SUOMING", uf, (255, 246, 230),
                  glow=(0, 0, 0), glow_r=22, spacing=2)
    ux = draw_run(canvas, (ux + 4, 852), ".", uf, (255, 90, 112), spacing=2)
    draw_run(canvas, (ux + 4, 852), "SLTY.SITE", uf, (255, 246, 230),
             glow=(0, 0, 0), glow_r=22, spacing=2)
    d.rectangle([90, 974, 966, 980], fill=RED + (225,))

    # 右上角印章
    seal = 88
    sl = Image.new("RGBA", (seal + 36, seal + 36), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sl)
    sd.rectangle([18, 18, 18 + seal, 18 + seal], fill=RED + (208,),
                 outline=(255, 126, 138, 214), width=3)
    sd.rectangle([30, 30, 30 + seal - 24, 30 + seal - 24],
                 outline=(255, 214, 214, 115), width=1)
    sd.text((18 + seal / 2, 18 + seal / 2 + 4), "契",
            font=ImageFont.truetype(F_BRUSH, 56), fill=(255, 242, 238, 242),
            anchor="mm")
    sl = sl.rotate(-7, resample=Image.BICUBIC, center=(18 + seal / 2, 18 + seal / 2))
    canvas.alpha_composite(sl, (1742, 86))

    rng = np.random.default_rng(31)
    noise = rng.normal(0, 1, (H, W, 1)).repeat(3, axis=2)
    flat = np.clip(np.asarray(canvas.convert("RGB")).astype(np.float32)
                   + noise * 4.5, 0, 255).astype(np.uint8)
    out = Image.fromarray(flat, "RGB")

    OUT.mkdir(exist_ok=True)
    out.save(OUT / f"{name}-1920x1080.png", optimize=True)
    out.resize((1146, 717), Image.LANCZOS).save(
        OUT / f"{name}-1146x717.jpg", quality=94, subsampling=0)
    print("saved", name)


def build_e():
    """大字版 2：文字压在画面下半，脸和上半张画完整留白。"""
    name = "封面E-大字"
    base_img = cover_crop(
        Image.open(ROOT / "src/assets/images1/1 (2).webp").convert("RGB"),
        W, H, 0.5, 0.5,
    )
    arr = np.asarray(base_img).astype(np.float32) / 255.0
    arr = np.clip((arr ** 0.95) * 1.03, 0, 1)
    canvas = Image.fromarray((arr * 255).astype(np.uint8), "RGB").convert("RGBA")

    Y = np.arange(H, dtype=np.float32).reshape(-1, 1)
    band = np.clip((Y - 430) / 330.0, 0, 1) ** 1.35 * 246
    add_scrim(canvas, Image.fromarray(np.tile(band.astype(np.uint8), (1, W)), "L"),
              (8, 4, 6))
    X = np.arange(W, dtype=np.float32).reshape(1, -1)
    side = np.clip((X - 1180) / 620.0, 0, 1) ** 1.4 * 120
    add_scrim(canvas, Image.fromarray(np.tile(side.astype(np.uint8), (H, 1)), "L"),
              (8, 4, 6))

    d = ImageDraw.Draw(canvas)

    draw_run(canvas, (92, 108), "WUTHERING WAVES · FAN SITE",
             ImageFont.truetype(F_TEXT_BD, 22), (232, 198, 140), spacing=7)

    pd = Image.new("RGBA", (300, 70), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(pd)
    pdraw.rectangle([0, 6, 284, 60], fill=RED + (238,))
    pdraw.rectangle([6, 12, 278, 54], outline=(255, 150, 158, 115), width=1)
    canvas.alpha_composite(pd, (92, 154))
    draw_run(canvas, (114, 178), "鸣潮 · 二创站",
             ImageFont.truetype(F_TEXT_BD, 30), (255, 246, 240), spacing=3)

    f1 = ImageFont.truetype(F_BOLD, 128)
    f2 = ImageFont.truetype(F_BOLD, 172)
    draw_run(canvas, (88, 566), "感受鸣潮的", f1, (255, 252, 248),
             glow=(0, 0, 0), glow_r=24, spacing=3)
    x = draw_run(canvas, (86, 706), "御姐", f2, (255, 62, 92),
                 glow=RED, glow_r=30, spacing=3)
    draw_run(canvas, (x + 6, 706), "！", f2, (255, 252, 248),
             glow=(0, 0, 0), glow_r=24, spacing=3)

    d.line([(92, 906), (420, 906)], fill=GOLD + (170,), width=2)
    draw_run(canvas, (92, 924), "伞下故影 · 一个人做的角色专题站",
             ImageFont.truetype(F_TEXT, 32), (240, 232, 220), spacing=3)

    uf = ImageFont.truetype(F_MONO, 74)
    ux = 92
    ux = draw_run(canvas, (ux, 972), "suoming", uf, (255, 246, 230),
                  glow=(0, 0, 0), glow_r=18, spacing=1)
    ux = draw_run(canvas, (ux + 2, 972), ".", uf, (255, 90, 112), spacing=1)
    draw_run(canvas, (ux + 2, 972), "slty.site", uf, (255, 246, 230),
             glow=(0, 0, 0), glow_r=18, spacing=1)

    seal = 84
    sl = Image.new("RGBA", (seal + 36, seal + 36), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sl)
    sd.rectangle([18, 18, 18 + seal, 18 + seal], fill=RED + (206,),
                 outline=(255, 126, 138, 212), width=3)
    sd.rectangle([29, 29, 29 + seal - 22, 29 + seal - 22],
                 outline=(255, 214, 214, 112), width=1)
    sd.text((18 + seal / 2, 18 + seal / 2 + 4), "契",
            font=ImageFont.truetype(F_BRUSH, 54), fill=(255, 242, 238, 242),
            anchor="mm")
    sl = sl.rotate(-7, resample=Image.BICUBIC, center=(18 + seal / 2, 18 + seal / 2))
    canvas.alpha_composite(sl, (1746, 84))

    rng = np.random.default_rng(47)
    noise = rng.normal(0, 1, (H, W, 1)).repeat(3, axis=2)
    flat = np.clip(np.asarray(canvas.convert("RGB")).astype(np.float32)
                   + noise * 4.5, 0, 255).astype(np.uint8)
    out = Image.fromarray(flat, "RGB")

    OUT.mkdir(exist_ok=True)
    out.save(OUT / f"{name}-1920x1080.png", optimize=True)
    out.resize((1146, 717), Image.LANCZOS).save(
        OUT / f"{name}-1146x717.jpg", quality=94, subsampling=0)
    print("saved", name)


if __name__ == "__main__":
    build(
        "src/assets/images1/1 (1).webp", "封面A-伞下故影",
        fx=0.52, fy=0.5,
        title_xy=(126, 232), sub_xy=(134, 586),
        rule_x=(140, 742), info_xy=(140, 768),
        seal_xy=(756, 206), banner_xy=(120, 846),
        left_scrim=0.93, bottom_scrim=0.86,
    )
    build(
        "src/assets/images1/1.webp", "封面B-伞下",
        fx=0.5, fy=0.42,
        title_xy=(86, 148), sub_xy=(96, 446),
        rule_x=(100, 566), info_xy=(100, 592),
        seal_xy=None, banner_xy=(110, 830),
        left_scrim=0.88, bottom_scrim=0.95,
        title_size=250, sub_size=100, note_pos=(122, 1002),
    )
    build_c()
    build_d()
    build_e()

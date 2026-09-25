"""Prepare the existing generated concept assets for independent static hosting."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
import shutil
import subprocess
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.asset-cache'
PUBLIC = ROOT / 'public' / 'tiptop'
ASSETS = PUBLIC / 'assets'
WORLD = ASSETS / 'world'
BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3IDQioFnKEdiBTSpvyKkSdi5fp9/'
SOURCES = {
    'cover.png': 'hf_20260925_155827_b8aff558-002d-43c7-abbe-775b75554db0.png',
    'mark.png': 'hf_20260925_155827_6f27fe74-acf6-4ccd-a44d-8175f59f9287.png',
    'icons.png': 'hf_20260925_155827_2af46e88-420c-48b0-8f99-00733be893d8.png',
    'tools.png': 'hf_20260925_155827_cfc61000-fdd3-48ac-8b92-d51f97c380dd.png',
    'film.mp4': 'hf_20260925_155820_f260811c-198e-4229-8bd2-53693ec435a9.mp4',
}
for directory in (CACHE, WORLD):
    directory.mkdir(parents=True, exist_ok=True)

def download(item):
    name, remote = item
    target = CACHE / name
    if target.exists() and target.stat().st_size:
        return
    request = Request(BASE + remote, headers={'User-Agent': 'MCC-Prototype-Asset-Build/1.0'})
    partial = target.with_suffix(target.suffix + '.part')
    with urlopen(request, timeout=180) as response, partial.open('wb') as output:
        shutil.copyfileobj(response, output)
    partial.replace(target)
    print('Downloaded', name, flush=True)

with ThreadPoolExecutor(max_workers=5) as pool:
    list(pool.map(download, SOURCES.items()))

with Image.open(CACHE / 'cover.png') as im:
    im.convert('RGB').save(ASSETS / 'tiptop_cover.png')
    ImageOps.fit(im.convert('RGB'), (1200, 630), method=Image.Resampling.LANCZOS).save(ASSETS / 'tiptop_og_wide.png')
with Image.open(CACHE / 'mark.png') as im:
    mark = im.convert('RGB')
    mark.resize((160, 160), Image.Resampling.LANCZOS).save(ASSETS / 'mark.png')
    for size in (16, 32):
        mark.resize((size, size), Image.Resampling.LANCZOS).save(PUBLIC / f'favicon-{size}.png')
    mark.resize((180, 180), Image.Resampling.LANCZOS).save(PUBLIC / 'apple-touch-icon.png')
    mark.resize((64, 64), Image.Resampling.LANCZOS).save(PUBLIC / 'favicon.ico')
with Image.open(CACHE / 'tools.png') as im:
    ImageOps.fit(im.convert('RGB'), (896, 1200), method=Image.Resampling.LANCZOS).save(ASSETS / 'tools.webp', quality=90)
with Image.open(CACHE / 'icons.png') as im:
    sheet = im.convert('RGBA')
    for i in range(6):
        col, row = i % 3, i // 3
        cell = sheet.crop((round(col * sheet.width / 3), round(row * sheet.height / 2), round((col + 1) * sheet.width / 3), round((row + 1) * sheet.height / 2)))
        alpha = cell.convert('L').point(lambda value: min(255, max(0, (value - 35) * 3)))
        cell.putalpha(alpha)
        box = alpha.getbbox()
        if box:
            cell = cell.crop(box)
        cell.thumbnail((220, 220), Image.Resampling.LANCZOS)
        icon = Image.new('RGBA', (256, 256))
        icon.alpha_composite(cell, ((256-cell.width)//2, (256-cell.height)//2))
        icon.save(ASSETS / f'icon-{i}.png')

for name, width, crf, gop in [('scene-01', 1920, 23, 8), ('scene-01-mobile', 960, 26, 4)]:
    output = WORLD / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(CACHE/'film.mp4'), '-an', '-vf', f'scale={width}:-2,fps=30', '-c:v', 'libx264', '-preset', 'fast', '-crf', str(crf), '-g', str(gop), '-keyint_min', str(gop), '-sc_threshold', '0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(output)], check=True)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(output), '-frames:v', '1', str(WORLD/f'{name}-poster.png')], check=True)
    print('Prepared', name, flush=True)
print('Prototype assets ready.', flush=True)

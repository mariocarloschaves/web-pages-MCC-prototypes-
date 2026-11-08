"""Foca Foca content, interaction and media regression checks; no requests are sent.

Run with Pillow and Playwright installed. BASE_URL may target the served build or
an explicitly selected public preview. Screenshots/reports go to FOCA_QA_OUTPUT.
"""
import hashlib
import json
import os
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / 'public/foca-foca'
BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:4173/foca-foca/').rstrip('/') + '/'
OUT = Path(os.environ.get('FOCA_QA_OUTPUT', 'qa/foca-foca'))
OUT.mkdir(parents=True, exist_ok=True)
PHOTOS = ['la-parmigiana', 'mortadella', 'messico-nuvole', 'napoli', 'caprese', 'del-giorno']
REMOVED = ['Cornetto simples', 'Cornetto recheado', 'Sfogliatella napolitana', 'Cappuccino com pistáchio',
           'Plain cornetto', 'Filled cornetto', 'Neapolitan sfogliatella', 'Pistachio cappuccino']
report = {'base_url': BASE, 'checks': [], 'external_failures': []}

def check(name, condition):
    assert condition, name
    report['checks'].append(name)

for path in [ROOT/'scripts/foca-bilingual.py', SITE/'index.html', SITE/'en.html']:
    check(f'{path.name}: removed products absent', all(x not in path.read_text() for x in REMOVED))

with sync_playwright() as p:
    browser = p.chromium.launch()
    report['browser'] = browser.version
    for lang, filename in [('pt', 'index.html'), ('en', 'en.html')]:
        for width in [375, 390, 768, 1440]:
            label = f'{lang}-{width}'
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='no-preference')
            page = context.new_page()
            errors, local_failures, video_requests = [], [], []
            page.on('pageerror', lambda e: errors.append(str(e)))
            def response(r):
                if r.status >= 400:
                    (local_failures if r.url.startswith(BASE) else report['external_failures']).append(f'{r.status} {r.url}')
            page.on('response', response)
            page.on('requestfailed', lambda r: (local_failures if r.url.startswith(BASE) else report['external_failures']).append(f'{r.failure} {r.url}'))
            page.on('request', lambda r: video_requests.append(r.url) if 'camada-a-camada.mp4' in r.url else None)
            page.goto(BASE+filename, wait_until='networkidle')
            check(f'{label}: lower film not downloaded at arrival', not video_requests)
            check(f'{label}: noindex', 'noindex' in page.locator('meta[name="robots"]').get_attribute('content'))
            check(f'{label}: twelve dishes', page.locator('.dish').count() == 12)
            check(f'{label}: seven supplied photographs', page.locator('img[data-photo="client"]').count() == 6 and 'foca-02.webp?v=' in page.locator('.story-photo img').get_attribute('src'))
            check(f'{label}: removals absent', all(x not in page.locator('body').text_content() for x in REMOVED))
            for slug in PHOTOS:
                button = page.locator(f'[data-dish="{slug}"]')
                card = page.locator('.dish').filter(has=button)
                photo = card.locator('img')
                button.scroll_into_view_if_needed()
                expect(photo).to_have_js_property('complete', True)
                expected_size = Image.open(SITE/f'images/dish-{slug}.webp').size
                check(f'{label}: {slug} intrinsic dimensions', tuple(photo.evaluate('(el)=>[el.naturalWidth,el.naturalHeight]')) == expected_size)
                check(f'{label}: {slug} layout dimensions', tuple(map(int, [photo.get_attribute('width'),photo.get_attribute('height')])) == expected_size)
                if width in [390,1440]: card.screenshot(path=str(OUT/f'{label}-{slug}.png'), animations='disabled')
                button.press('Enter')
                expect(page.locator('#dish-dialog')).to_be_visible()
                expect(page.locator('#dialog-photo')).to_have_attribute('src', photo.get_attribute('src') if photo.get_attribute('src').startswith('http') else BASE+photo.get_attribute('src').removeprefix('./'))
                check(f'{label}: {slug} real-photo dialog label', ('fornecida' if lang=='pt' else 'supplied') in page.locator('#dialog-image-note').inner_text())
                check(f'{label}: dialog dimensions', page.locator('#dialog-photo').get_attribute('width') == str(expected_size[0]))
                for _ in range(4):
                    page.keyboard.press('Tab')
                    check(f'{label}: focus remains inside dialog', page.evaluate('document.querySelector("#dish-dialog").contains(document.activeElement)'))
                if slug == 'la-parmigiana' and width in [390,1440]: page.locator('#dish-dialog').screenshot(path=str(OUT/f'{label}-dialog.png'), animations='disabled')
                page.keyboard.press('Escape')
                expect(button).to_be_focused()
            page.locator('[data-dish="golosa"]').click()
            check(f'{label}: remaining illustration label', ('ilustrativa' if lang=='pt' else 'Illustrative') in page.locator('#dialog-image-note').inner_text())
            page.keyboard.press('Escape')
            page.locator('.story-photo').scroll_into_view_if_needed()
            expect(page.locator('.story-photo img')).to_have_js_property('naturalWidth', 900)
            if width in [390,1440]: page.locator('#historia').screenshot(path=str(OUT/f'{label}-story.png'), animations='disabled')
            page.locator('#menu-search').fill('MORTADELLA')
            expect(page.locator('.dish:visible')).to_have_count(1)
            page.locator('#menu-search').fill('no-matching-dish-qa')
            expect(page.locator('.menu-empty')).to_be_visible()
            page.locator('#reset-menu').click()
            expect(page.locator('.dish:visible')).to_have_count(12)
            page.locator('[data-filter="signature"]').click()
            expect(page.locator('.dish:visible')).to_have_count(4)
            page.locator('[data-filter="all"]').click()
            report['checks'].append(f'{label}: search, empty results, reset, category filters')
            for summary in page.locator('.menu-details summary').all(): summary.click()
            for name, price in [('Cynar Spritz', '8,00 €' if lang=='pt' else '€8.00'), ('Estrella Bock Damm', '3,50 €' if lang=='pt' else '€3.50')]:
                row = page.locator('.menu-row').filter(has=page.get_by_role('heading', name=name, exact=True))
                expect(row).to_have_count(1)
                check(f'{label}: {name} price', row.locator(':scope > span').inner_text() == price)
            cynar = page.locator('.menu-row').filter(has_text='Cynar Spritz').locator('p').inner_text()
            check(f'{label}: exact Cynar description', cynar == ('Herbal e ligeiramente amargo. Uma tradição do aperitivo veneto.' if lang=='pt' else 'Herbal and slightly bitter. A tradition of the Veneto aperitivo.'))
            wine = page.locator('.wine-table tr').filter(has_text='Barbera d’Alba')
            expect(wine).to_have_count(1)
            check(f'{label}: wine detail', wine.locator('small').inner_text() == ('Tinto · Egidio 2023' if lang=='pt' else 'Red · Egidio 2023'))
            check(f'{label}: wine prices', wine.locator('td').all_text_contents() == (['6,00 €','23,00 €'] if lang=='pt' else ['€6.00','€23.00']))
            check(f'{label}: both Cappuccinos retained', page.get_by_role('heading',name='Cappuccino',exact=True).count()==1 and page.get_by_role('heading',name='Cappuccino com leite vegetal' if lang=='pt' else 'Cappuccino with plant-based milk',exact=True).count()==1)
            if width in [390,1440]: page.locator('.other-menu').screenshot(path=str(OUT/f'{label}-drinks.png'), animations='disabled')
            video = page.locator('#assembly-video')
            video.scroll_into_view_if_needed()
            expect(video).to_have_js_property('paused', False, timeout=15000)
            expect(video).to_have_js_property('videoWidth', 512)
            expect(video).to_have_js_property('videoHeight', 910)
            check(f'{label}: portrait video ratio', abs(video.bounding_box()['width']/video.bounding_box()['height']-512/910)<0.01)
            check(f'{label}: inline muted loop', video.evaluate('(v)=>v.playsInline && v.muted && v.loop'))
            start = video.evaluate('(v)=>v.currentTime')
            page.wait_for_timeout(300)
            check(f'{label}: actual video playback', video.evaluate('(v)=>v.currentTime') != start)
            page.locator('#assembly-toggle').click()
            expect(video).to_have_js_property('paused', True)
            page.locator('#menu-search').scroll_into_view_if_needed()
            video.scroll_into_view_if_needed()
            page.evaluate('document.dispatchEvent(new Event("visibilitychange"))')
            expect(video).to_have_js_property('paused', True)
            report['checks'].append(f'{label}: deliberate pause survives scroll and visibility event')
            if width in [390,1440]: page.locator('#filme').screenshot(path=str(OUT/f'{label}-video.png'), animations='disabled')
            page.locator('#assembly-toggle').press('Enter')
            expect(video).to_have_js_property('paused', False)
            page.emulate_media(reduced_motion='reduce')
            expect(video).to_have_js_property('paused', True)
            page.locator('#assembly-toggle').click()
            expect(video).to_have_js_property('paused', False)
            report['checks'].append(f'{label}: reduced motion and manual playback')
            form = page.locator('#reservation-form')
            form.locator('button[type="submit"]').click()
            expect(page.locator('#reservation-result')).to_be_hidden()
            page.locator('[name="name"]').fill('QA preview — do not send')
            page.locator('[name="date"]').fill((date.today()+timedelta(days=7)).isoformat())
            page.locator('[name="time"]').fill('13:00')
            form.locator('button[type="submit"]').click()
            expect(page.locator('#reservation-result')).to_be_visible()
            check(f'{label}: request not confirmation', ('pedir uma reserva' if lang=='pt' else 'request a reservation') in page.locator('#reservation-message').inner_text())
            check(f'{label}: SMS preparation only', page.locator('#sms-link').get_attribute('href').startswith('sms:+351913602617'))
            page.locator('[name="date"]').fill('2020-01-01')
            form.locator('button[type="submit"]').click()
            expect(page.locator('#reservation-result')).to_be_hidden()
            check(f'{label}: past date invalid', not page.locator('[name="date"]').evaluate('(el)=>el.validity.valid'))
            if width < 650:
                expect(page.locator('.mobile-actions')).to_have_class('mobile-actions at-booking')
                page.locator('.wordmark').click()
                expect(page.locator('.mobile-actions')).not_to_have_class('mobile-actions at-booking')
                page.locator('.menu-toggle').click()
                expect(page.locator('.main-nav')).to_have_class('main-nav open')
                page.keyboard.press('Escape')
                expect(page.locator('.menu-toggle')).to_have_attribute('aria-expanded','false')
                page.locator('.menu-toggle').click()
                page.locator('.main-nav a[href="#menu"]').click()
                expect(page.locator('.menu-toggle')).to_have_attribute('aria-expanded','false')
                report['checks'].append(f'{label}: mobile navigation and sticky actions')
            check(f'{label}: no page overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
            check(f'{label}: wine table fits', page.locator('.wine-table').evaluate('(el)=>el.getBoundingClientRect().right<=innerWidth'))
            links = page.locator('a').evaluate_all('(els)=>els.map(el=>el.getAttribute("href"))')
            check(f'{label}: public contact/map/order links', any(x.startswith('tel:+351913602617') for x in links) and any('google.com/maps' in x for x in links) and any('ubereats.com/pt-en/store/foca-foca' in x for x in links))
            check(f'{label}: no script errors', not errors)
            check(f'{label}: no failed site requests', not local_failures)
            page.goto(BASE+filename+'#menu')
            page.locator('.language-switch a').filter(has_text='EN' if lang=='pt' else 'PT').click()
            expect(page.locator('body')).to_have_attribute('data-lang','en' if lang=='pt' else 'pt')
            check(f'{label}: language switch retains section', page.url.endswith('#menu'))
            context.close()
        context = browser.new_context(viewport={'width':390,'height':844}, reduced_motion='reduce')
        page = context.new_page();page.goto(BASE+filename,wait_until='networkidle')
        page.locator('#assembly-video').scroll_into_view_if_needed()
        expect(page.locator('#assembly-video')).to_have_js_property('paused',True)
        page.locator('#assembly-toggle').click()
        expect(page.locator('#assembly-video')).to_have_js_property('paused',False)
        report['checks'].append(f'{lang}: initial reduced-motion preference respected')
        context.close()
    browser.close()
report['passed'] = len(report['checks'])
(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({'passed':report['passed'],'browser':report['browser'],'external_failures':report['external_failures']},indent=2))

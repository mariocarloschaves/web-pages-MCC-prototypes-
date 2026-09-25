import { access, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = path.join(root, 'dist')
await access(path.join(dist, 'tiptop', 'index.html'))
await access(path.join(dist, 'tiptop', 'assets'))
await mkdir(dist, { recursive: true })

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#111111">
  <title>MCC | Website Prototypes</title>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#111;color:#f4f1eb;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;min-height:100svh;display:grid;place-items:center;padding:32px}main{width:min(100%,720px)}.eyebrow{color:#b6b1ab;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}h1{font-size:clamp(40px,8vw,72px);letter-spacing:-.06em;line-height:1.04;margin:24px 0}p{font-size:17px;line-height:1.65;color:#b6b1ab;max-width:560px}.card{display:block;text-decoration:none;color:inherit;border:1px solid #393736;padding:28px;margin:40px 0 24px;transition:border-color .2s,background .2s}.card:hover{border-color:#b93440;background:#191516}.card:focus-visible{outline:3px solid #b93440;outline-offset:4px}.card strong{font-size:27px;letter-spacing:-.03em}.card span{display:block;margin-top:12px;color:#b6b1ab;line-height:1.5}.open{color:#fff!important;font-weight:600}.note{font-size:13px;color:#97928c}footer{margin-top:52px;color:#777;font-size:12px}
  </style>
</head>
<body>
  <main>
    <div class="eyebrow">MCC / Selected Concepts</div>
    <h1>A first look at<br>what comes next.</h1>
    <p>Website prototypes created by MCC. Explore the design, motion, and experience.</p>
    <a class="card" href="./tiptop/">
      <strong>Tip.TopBarbershop</strong>
      <span>A barbershop website concept for Zwijndrecht.</span>
      <span class="open">Open prototype &rarr;</span>
    </a>
    <p class="note">Design concept with generated visuals. This is an MCC prototype, not the business's official website. The booking demonstration does not submit real appointments.</p>
    <footer>MCC &middot; Website prototypes</footer>
  </main>
</body>
</html>
`

await writeFile(path.join(dist, 'index.html'), html)
await writeFile(path.join(dist, '.nojekyll'), '')
await writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
console.log('MCC portfolio page and GitHub Pages output are ready.')

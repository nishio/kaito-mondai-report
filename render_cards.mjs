// OGP/X カード画像を再生成する（Mac など Chromium が動く環境で実行）。
//   npm i puppeteer
//   node render_cards.mjs
// cards.html?c=1..5 を 1200x675・2x で social/cardN.png に書き出す。
// フォントは _fonts/ の自前 Noto を使うので日本語も正しく出る。
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const site = 'file://' + join(here, 'cards.html');
const out = join(here, 'social');
const CARDS = [1, 2, 3, 4, 5];

const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 675, deviceScaleFactor: 2 });
for (const c of CARDS) {
  await page.goto(`${site}?c=${c}`, { waitUntil: 'networkidle0' });
  try { await page.evaluate(() => document.fonts.ready); } catch (e) {}
  await new Promise(r => setTimeout(r, 500));
  const el = await page.$('.card');
  await el.screenshot({ path: join(out, `card${c}.png`) });
  console.log('wrote social/card' + c + '.png');
}
await browser.close();
console.log('done. social/card1..5.png を更新しました。');

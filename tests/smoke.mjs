import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const baseURL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const executablePath = process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const launch = () => chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });

test('desktop: navigation, maps, keyboard tabs, stories, trailer, and platform dialog', async () => {
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { level: 1 }).waitFor();
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.hero-eyebrow')).opacity === '1');
    assert.match(await page.title(), /PUBG: BATTLEGROUNDS/);
    await page.getByRole('button', { name: 'PLAY NOW', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    assert.match(await dialog.getAttribute('aria-labelledby'), /modal-title/);
    assert.equal(await dialog.locator('.platform-options a').count(), 3);
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Close dialog');
    await page.keyboard.press('Shift+Tab');
    assert.match(await page.evaluate(() => document.activeElement?.getAttribute('href')), /xbox/);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Close dialog');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'PLAY NOW');

    const erangel = page.getByRole('button', { name: 'Explore Erangel', exact: true });
    await erangel.hover();
    await page.waitForTimeout(800);
    const selectedMapWidth = (await erangel.boundingBox()).width;
    const otherMapWidth = (await page.getByRole('button', { name: 'Explore Miramar', exact: true }).boundingBox()).width;
    assert.ok(selectedMapWidth > otherMapWidth + 30, 'Hovered map opens into a larger cinematic frame');
    await erangel.click();
    await dialog.waitFor();
    assert.match(await dialog.locator('h2').innerText(), /ERANGEL/);
    await dialog.getByRole('button', { name: 'NEXT MAP' }).click();
    assert.match(await dialog.locator('h2').innerText(), /MIRAMAR/);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Explore Erangel');

    await page.getByRole('tab', { name: /02.*AKM/ }).click();
    assert.match(await page.getByRole('tabpanel').locator('h3').innerText(), /AKM/);
    await page.keyboard.press('ArrowRight');
    assert.match(await page.getByRole('tabpanel').locator('h3').innerText(), /AWM/);
    await page.keyboard.press('Home');
    assert.match(await page.getByRole('tabpanel').locator('h3').innerText(), /M416/);
    await page.keyboard.press('End');
    assert.match(await page.getByRole('tabpanel').locator('h3').innerText(), /AWM/);
    await page.getByRole('button', { name: 'Next weapon' }).click();
    assert.match(await page.getByRole('tabpanel').locator('h3').innerText(), /M416/);
    await page.waitForTimeout(700);
    const visual = await page.locator('.weapon-image').boundingBox();
    await page.mouse.move(visual.x + visual.width * .7, visual.y + visual.height / 2);
    await page.mouse.down();
    await page.mouse.move(visual.x + visual.width * .3, visual.y + visual.height / 2, { steps: 12 });
    await page.mouse.up();
    await page.waitForFunction(() => document.querySelector('.weapon-info h3')?.textContent === 'AKM');
    const photo = page.getByRole('img', { name: 'AKM assault rifle, full side profile' });
    await photo.waitFor();
    await page.waitForFunction(() => document.querySelector('.weapon-image img')?.complete && document.querySelector('.weapon-image img')?.naturalWidth > 0);

    await page.locator('.news-card').first().click();
    await dialog.waitFor();
    assert.match(await dialog.locator('h2').innerText(), /first drop/);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'WATCH TRAILER', exact: true }).click();
    await dialog.waitFor();
    assert.match(await dialog.locator('iframe').getAttribute('src'), /youtube-nocookie.com\/embed\//);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    // Scroll each section into view so both reveal animations and lazy-loaded imagery execute.
    for (const id of ['game', 'maps', 'arsenal', 'news']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(850);
    }
    await page.waitForFunction(() => [...document.images].filter(image => image.loading !== 'lazy' || image.complete).every(image => image.complete && image.naturalWidth > 0));
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('responsive layouts and reduced-motion mobile navigation', async () => {
  const browser = await launch();
  try {
    for (const width of [1440, 1024, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce', isMobile: width < 700, hasTouch: width < 700 });
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow at ${width}px`);
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
      assert.equal(await page.locator('.reading-progress').evaluate(element => getComputedStyle(element).display), 'none');
      assert.equal(await page.locator('.map-photo').first().evaluate(element => getComputedStyle(element).clipPath), 'none');
      if (width < 700) {
        await page.getByRole('button', { name: 'Open navigation' }).click();
        await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /MAPS/ }).click();
        await page.getByRole('navigation', { name: 'Mobile navigation' }).waitFor({ state: 'detached' });
        assert.equal(new URL(page.url()).hash, '#maps');
        await page.getByRole('button', { name: 'Explore Vikendi' }).click();
        await page.getByRole('dialog').waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.getByRole('button', { name: 'Close dialog' }).click();
      }
      await page.close();
    }
  } finally { await browser.close(); }
});

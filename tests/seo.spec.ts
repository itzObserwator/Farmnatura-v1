import { test, expect } from '@playwright/test';
import { pageMetadata, routePaths } from '../src/data/routes';
import { chapters } from '../src/data/chapters';
for (const chapter of chapters) {
  test(`${chapter.id} retains redesigned copy and crawlable metadata`, async ({page}) => {
    await page.goto(routePaths[chapter.id]);
    await expect(page).toHaveTitle(pageMetadata[chapter.id].title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.farmnatura.in'+routePaths[chapter.id]);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',pageMetadata[chapter.id].description);
    expect(await page.locator('body').textContent()).toContain(chapter.body);
    await expect(page.locator('.published-sections, #farm-overview')).toHaveCount(0);
  });
}
test('production pages expose redesigned content before JavaScript', async ({request,baseURL})=>{
  test.skip(!baseURL?.includes('4173'),'Prerendering is a production build feature.');
  for (const chapter of chapters) {
    const response = await request.get(routePaths[chapter.id]);
    const html = await response.text();
    expect(response.ok()).toBe(true);
    expect(html).toContain('rel="canonical"');
    expect(html).toContain(chapter.body.replaceAll('&','&amp;').replaceAll("'",'&#x27;').replaceAll('"','&quot;'));
    expect(html).not.toContain('published-sections');
  }
  expect(await (await request.get('/robots.txt')).text()).toContain('User-agent: *');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('https://www.farmnatura.in/natural-farming');
  expect(sitemap).not.toContain('/farm-land-for-sale-in-hyderabad');
});

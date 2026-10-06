import {test,expect} from '@playwright/test';
test('responsive page, gallery, FAQ, navigation and enquiry work',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'Growing a Life Rooted in Nature'})).toBeVisible();
 await page.waitForTimeout(1400);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const images=await page.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0));expect(images).toBe(true);
 if(info.project.name==='mobile'){await page.getByRole('button',{name:'Open menu'}).click();await expect(page.getByRole('navigation')).toBeVisible();await page.getByRole('navigation').getByRole('link',{name:'Experiences',exact:true}).click();await expect(page.getByRole('navigation')).not.toBeVisible();}
 await page.locator('.gallery-controls').getByRole('button',{name:'02 The farmhouse'}).click();await expect(page.locator('.gallery-frame img')).toHaveAttribute('src','/images/farmhouse.jpg');
 await page.getByRole('button',{name:'Where is Farm Natura?'}).click();await expect(page.locator('#faq-0')).toBeVisible();
 await page.getByRole('button',{name:'Plan your farm visit'}).click();await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByLabel('Your name').fill('Test visitor');await page.getByLabel('Phone number').fill('9876543210');
 const [popup]=await Promise.all([page.waitForEvent('popup'),page.getByRole('button',{name:'Continue on WhatsApp'}).click()]);expect(popup.url()).toMatch(/wa\.me|api\.whatsapp\.com/);expect(decodeURIComponent(popup.url())).toContain('919579555666');await popup.close();
 await page.getByRole('button',{name:'Close enquiry'}).click();await expect(page.getByRole('dialog')).not.toBeVisible();
 expect(errors).toEqual([]);
});
test('reduced motion leaves content accessible',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('.hero-copy')).toBeVisible();await expect(page.locator('.experience-grid')).toBeVisible();expect(await page.locator('.hero-copy').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');});

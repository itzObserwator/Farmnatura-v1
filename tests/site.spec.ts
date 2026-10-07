import {test,expect} from '@playwright/test';
const enter=async(page:import('@playwright/test').Page)=>{await page.goto('/');await page.getByRole('button',{name:'Skip intro',exact:true}).click();await expect(page.getByRole('button',{name:'Explore Our Story',exact:true})).toBeVisible();await page.waitForTimeout(1300);};
test('chapter carousel supports arrows, wheel, menu, and page transitions',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await enter(page);
 await page.getByRole('button',{name:'Next chapter',exact:true}).click();await expect(page.locator('.chapter-caption h1')).toHaveText('Natural Farming');await page.waitForTimeout(1250);
 if(info.project.name==='desktop'){await page.mouse.move(720,500);await page.mouse.wheel(0,600);}else{await page.getByRole('button',{name:'Next chapter',exact:true}).click();}
 await expect(page.locator('.chapter-caption h1')).toHaveText('Farm Life');await page.waitForTimeout(1250);
 await page.getByRole('button',{name:'Explore Farm Life',exact:true}).click();await expect(page).toHaveURL(/#living$/);await expect(page.getByRole('heading',{level:1})).toContainText('LESS HURRY.');await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'Read this chapter'}).click();await page.waitForTimeout(1200);await expect(page).toHaveURL(/#living$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Open menu'}).click();const menu=page.getByRole('dialog',{name:'Explore Farm Natura'});await expect(menu).toBeVisible();await menu.getByRole('button',{name:'01 Our Story'}).click();await expect(page).toHaveURL(/#story$/);await expect(menu).not.toBeVisible();expect(errors).toEqual([]);
});
test('gallery, FAQ, enquiry and original artwork work',async({page})=>{
 await page.goto('/#living');await page.waitForTimeout(1300);
 const images=await page.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(el=>new Promise<boolean>(resolve=>{const img=new Image();img.onload=()=>resolve(img.naturalWidth>0);img.onerror=()=>resolve(false);img.src=(el as HTMLImageElement).src;}))));expect(images.every(Boolean)).toBe(true);
 await page.getByRole('button',{name:'Next photograph',exact:true}).click();await expect(page.locator('.gallery-photo img')).toHaveAttribute('src','/images/farmhouse.jpg');await page.getByRole('button',{name:'Open photograph'}).click();await expect(page.locator('.photo-dialog')).toBeVisible();await page.getByRole('button',{name:'Close photograph'}).click();
 await page.getByRole('button',{name:'Where is Farm Natura?'}).click();await expect(page.locator('#answer-0')).toBeVisible();
 await page.getByRole('button',{name:'PLAN YOUR VISIT',exact:true}).click();await expect(page.locator('.contact-dialog')).toBeVisible();await page.getByLabel('Your name').fill('Test visitor');await page.getByLabel('Phone number').fill('9876543210');const [popup]=await Promise.all([page.waitForEvent('popup'),page.getByRole('button',{name:'Continue on WhatsApp'}).click()]);expect(popup.url()).toMatch(/wa\.me|api\.whatsapp\.com/);await popup.close();await page.getByRole('button',{name:'Close enquiry'}).click();await expect(page.locator('.contact-dialog')).not.toBeVisible();
});
test('intro, sound preference and reduced motion remain accessible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.getByRole('button',{name:'ENTER THE FARM'})).toBeEnabled();await page.getByRole('button',{name:'ENTER THE FARM'}).click();await expect(page.locator('.intro-film')).toBeVisible();await page.getByRole('button',{name:'Skip intro',exact:true}).click();await expect(page.locator('.chapter-carousel')).toBeVisible();await page.getByRole('button',{name:'Turn sound on'}).click();await expect(page.getByRole('button',{name:'Turn sound off'})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'Turn sound off'}).click();await page.getByRole('button',{name:'Explore Our Story',exact:true}).click();await expect(page).toHaveURL(/#story$/);expect(await page.locator('.hero-title').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
});

import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{baseURL:process.env.FARM_PREVIEW_URL??'http://127.0.0.1:5173',launchOptions:{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}},projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844}}}]});

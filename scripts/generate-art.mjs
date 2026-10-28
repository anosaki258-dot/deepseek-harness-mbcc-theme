// Authored procedural drawings. No game screenshots, logos or scraped map data.
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const assetRoot = new URL('../assets/',import.meta.url); await mkdir(assetRoot,{recursive:true});
let seed = 2831;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const defs = `<defs><filter id="grain"><feTurbulence baseFrequency=".64" numOctaves="3" seed="28" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".1"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#171619"/><stop offset="1" stop-color="#0a0a0c"/></linearGradient></defs>`;
let city = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="760" viewBox="0 0 1600 760">${defs}<path fill="url(#sky)" d="M0 0h1600v760H0z"/>`;
for (let layer=0; layer<3; layer++) {
  let x=-30; const baseline=600+layer*70;
  while (x<1600) {
    const width = 35+Math.floor(random()*108), height=65+Math.floor(random()*(layer===1?410:300));
    const top=baseline-height; const shade=['#222125','#161518','#0b0b0e'][layer];
    city+=`<path fill="${shade}" stroke="#777078" stroke-opacity=".12" d="M${x} ${baseline}V${top+20}l${width*.3} -20h${width*.7}v${height}z"/>`;
    for(let yy=top+35;yy<baseline-12;yy+=22) for(let xx=x+10;xx<x+width-8;xx+=13) {
      if(random()>.7) city+=`<path stroke="${random()>.94?'#8a3a46':'#aaa09a'}" stroke-opacity="${.06+random()*.13}" d="M${xx} ${yy}h5"/>`;
    }
    if(random()>.7) city+=`<path stroke="#82414c" stroke-opacity=".4" d="M${x+width*.7} ${top+8}v${height-15}"/>`;
    x+=width-3;
  }
}
city+='<g fill="none" stroke="#83797c" stroke-opacity=".12"><path d="M-60 760 830 520 1660 705M220 760 840 520 1320 760M-10 685 810 480 1600 625"/><path d="M0 716h1600M0 731h1600"/></g><path fill="#070709" opacity=".32" filter="url(#grain)" d="M0 0h1600v760H0z"/><path fill="#070708" opacity=".12" d="M0 0h1600v760H0z"/></svg>';
await writeFile(new URL('urban-city.svg',assetRoot),city);
let map=`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 1800 1200">${defs}<path fill="#111113" d="M0 0h1800v1200H0z"/><g fill="none" stroke="#b2a6a6" stroke-opacity=".09">`;
for(let i=0;i<90;i++) {
  const x=Math.floor(random()*1900)-50,y=Math.floor(random()*1300)-50,w=25+Math.floor(random()*210),h=20+Math.floor(random()*160);
  map+=`<path d="M${x} ${y}h${w}v${h}h-${w}zM${x+5} ${y+5}h${w-10}v${h-10}h-${w-10}z"/>`;
}
map+='<g stroke-width="3"><path d="M-80 730 350 510 710 460 1200 210 1880 180M-50 760 350 540 735 490 1210 240 1880 210M210 -50 350 320 600 640 550 1300M240 -50 380 320 630 630 580 1300M-50 1030 780 800 1180 810 1860 600"/></g>';
for(let r=75;r<560;r+=80) map+=`<circle cx="320" cy="730" r="${r}" stroke-dasharray="${r%3?'none':'4 7'}"/>`;
for(let x=0;x<1800;x+=100) map+=`<path d="M${x} 0v1200" stroke-opacity=".025"/>`;
map+='</g><path fill="#111113" opacity=".7" filter="url(#grain)" d="M0 0h1800v1200H0z"/><path fill="none" stroke="#74323e" stroke-opacity=".12" d="M0 800 660 590 870 340 1800 270"/></svg>';
await writeFile(new URL('urban-map.svg',assetRoot),map);
console.log('Generated two original city/map SVG drawings.');

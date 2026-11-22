// KMS app: opens without internet too (entries wait in the phone); the Urdu font is kept in the phone after the first time
const C='kms-v7-'+self.registration.scope,F=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.indexOf(self.registration.scope)>=0).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){   // Nastaliq font: from the phone if it has it
    e.respondWith(caches.open('kms-fonts').then(c=>c.match(e.request).then(m=>m||fetch(e.request).then(r=>{c.put(e.request,r.clone());return r}))));return}
  if(u.origin!==location.origin)return;   // Google (data) always from the internet
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});

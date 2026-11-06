'use strict';
const CACHE='thaali-static-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('thaali-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    const hit=await cache.match(event.request,{ignoreSearch:true});
    if(hit)return hit;
    try{
      const response=await fetch(event.request);
      if(response.ok&&response.type==='basic'&&FILES.some(f=>new URL(f,self.registration.scope).pathname===new URL(event.request.url).pathname))await cache.put(event.request,response.clone());
      return response;
    }catch(error){
      if(event.request.mode==='navigate')return (await cache.match('./index.html'))||(await cache.match('./'))||Response.error();
      return Response.error();
    }
  }));
});

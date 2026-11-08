'use strict';
const CACHE='thaali-static-v15';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('thaali-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  const page=event.request.mode==='navigate'||url.pathname===new URL('./index.html',self.registration.scope).pathname;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    if(page){
      // Fetch fresh HTML on every online visit; keep both entry URLs current offline.
      try{
        const response=await fetch(event.request,{cache:'no-cache'});
        if(response.ok&&response.type==='basic'){
          await Promise.all(['./','./index.html'].map(key=>cache.put(key,response.clone())));
          return response;
        }
        return (await cache.match('./index.html'))||(await cache.match('./'))||response;
      }catch(error){
        return (await cache.match('./index.html'))||(await cache.match('./'))||Response.error();
      }
    }
    const hit=await cache.match(event.request,{ignoreSearch:true});
    if(hit)return hit;
    try{
      const response=await fetch(event.request);
      if(response.ok&&response.type==='basic'&&FILES.some(f=>new URL(f,self.registration.scope).pathname===url.pathname))await cache.put(event.request,response.clone());
      return response;
    }catch(error){
      return Response.error();
    }
  }));
});

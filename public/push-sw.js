self.addEventListener('push',event=>{
 let data={};
 try{data=event.data?event.data.json():{};}catch{data={title:'Cockpit Marchés AI',body:event.data?.text()||'Nouvelle alerte de marché'};}
 const title=data.title||'Cockpit Marchés AI';
 const options={body:data.body||'Nouvelle alerte de marché',icon:data.icon||'/favicon.ico',badge:data.badge||'/favicon.ico',data:{url:data.url||'/'},tag:data.tag||undefined,renotify:Boolean(data.renotify)};
 event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const target=event.notification?.data?.url||'/';
 event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
  for(const client of list){if('focus'in client){client.navigate(target);return client.focus();}}
  return clients.openWindow?clients.openWindow(target):undefined;
 }));
});

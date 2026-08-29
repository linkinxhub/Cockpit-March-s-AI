import fs from'node:fs';
const files=['mobile/lib/app_shell.dart','mobile/lib/features/news/presentation/notification_preferences_view.dart','mobile/lib/features/paper_trading/presentation/paper_trading_view.dart'];
let total=0;
for(const file of files){let s=fs.readFileSync(file,'utf8');const before=s;const matches=s.match(/DropdownButtonFormField<String>\(value:/g)??[];s=s.replaceAll('DropdownButtonFormField<String>(value:','DropdownButtonFormField<String>(initialValue:');if(matches.length){fs.writeFileSync(file,s);total+=matches.length;}if(before===s&&file.includes('app_shell'))throw new Error(`Expected dropdowns not found in ${file}`);}
if(total!==6)throw new Error(`Expected 6 deprecated dropdown usages, found ${total}`);
console.log(`Modernized ${total} DropdownButtonFormField usages.`);

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('items.json', 'utf8'));
let result = {};
data.forEach(i => {
    if (i.UniqueName && i.LocalizedNames && i.LocalizedNames['RU-RU'] && !i.UniqueName.includes('QUEST') && !i.UniqueName.includes('TRASH')) {
        result[i.UniqueName] = {
            en: i.LocalizedNames['EN-US'],
            ru: i.LocalizedNames['RU-RU']
        };
    }
});
fs.writeFileSync('items-min.json', JSON.stringify(result));
console.log('Filtered items to ' + Object.keys(result).length + ' entries. Size: ' + fs.statSync('items-min.json').size + ' bytes');

const fs = require('fs');

const path = 'sales.html';
let content = fs.readFileSync(path, 'utf8');

// The mangled symbols and their true characters
const replacements = [
    { bad: 'ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹', good: '₹' },
    { bad: 'ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ', good: '—' },
    { bad: 'ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢', good: '•' }
];

let changed = false;
for (const r of replacements) {
    if (content.includes(r.bad)) {
        content = content.split(r.bad).join(r.good);
        changed = true;
    }
}

if (changed) {
    fs.writeFileSync(path, content, 'utf8');
    console.log('Mojibake fixed in sales.html');
} else {
    console.log('No mojibake found.');
}

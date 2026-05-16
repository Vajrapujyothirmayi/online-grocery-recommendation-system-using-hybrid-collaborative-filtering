const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
};

const jsxFiles = walk(srcDir);

let modifiedFiles = 0;

jsxFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Specifically focus on rendering prices
    content = content.replace(/>\$(<)/g, '>₹<');
    content = content.replace(/>\$(\d)/g, '>₹$1');
    content = content.replace(/\$([0-9.]+)/g, '₹$1');
    content = content.replace(/>\$\{(.*\.toFixed\(2\))\}/g, '>₹{$1}');

    // Specifically looking out for template literal interpolations
    content = content.replace(/\$\$\{(.*?\.toFixed\(2\))\}/g, '₹${$1}');
    // Example from ConsumerOrders: <span className="item-subtotal">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
    content = content.replace(/>\$\{(.*?)\}/g, '>₹{$1}'); // React text


    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedFiles++;
    }
});

console.log(`Refactored ${modifiedFiles} files to use ₹.`);

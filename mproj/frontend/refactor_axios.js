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

// Mapping from service methods to endpoints
const endpoints = {
    // authService
    'authService.login': { method: 'post', url: '/auth/signin', args: ['{ username: arg1, password: arg2 }'] },
    'authService.register': { method: 'post', url: '/auth/signup', args: ['{ username: arg1, email: arg2, password: arg3, roles: [arg4] }'] },

    // productService
    'productService.getAll': { method: 'get', url: '/products', args: [] },
    'productService.getById': { method: 'get', url: '`/products/${arg1}`', args: [] },
    'productService.getByCategory': { method: 'get', url: '`/products/category/${arg1}`', args: [] },
    'productService.getByProducer': { method: 'get', url: '`/products/producer/${arg1}`', args: [] },
    'productService.create': { method: 'post', url: '/products', args: ['arg1'] },
    'productService.update': { method: 'put', url: '`/products/${arg1}`', args: ['arg2'] },
    'productService.delete': { method: 'delete', url: '`/products/${arg1}`', args: [] },

    // cartService
    'cartService.getCart': { method: 'get', url: '/cart', args: [] },
    'cartService.addItem': { method: 'post', url: '/cart/items', args: ['{ productId: arg1, quantity: arg2 }'] },
    'cartService.updateQuantity': { method: 'put', url: '`/cart/items/${arg1}?quantity=${arg2}`', args: [] },
    'cartService.removeItem': { method: 'delete', url: '`/cart/items/${arg1}`', args: [] },
    'cartService.clearCart': { method: 'delete', url: '/cart', args: [] },

    // orderService
    'orderService.getOrders': { method: 'get', url: '/orders', args: [] },
    'orderService.checkout': { method: 'post', url: '/orders/checkout', args: [] },

    // recommendationService
    'recommendationService.getRecommendations': { method: 'get', url: '/recommendations', args: [] },
    'recommendationService.rateProduct': { method: 'post', url: '/recommendations/rate', args: ['{ productId: arg1, score: arg2 }'] }
};

let modifiedFiles = 0;

jsxFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Replace imports
    if (content.includes("from '../../services/api'") || content.includes("from '../services/api'")) {
        content = content.replace(/import\s+\{[^}]+\}\s+from\s+['"]\.\.\/\.\.\/services\/api['"];/g, 'import axios from "axios";');
        content = content.replace(/import\s+\{[^}]+\}\s+from\s+['"]\.\.\/services\/api['"];/g, 'import axios from "axios";');
        modified = true;
    }

    // Replace service calls
    for (const [serviceMethod, config] of Object.entries(endpoints)) {
        // Regex to match serviceMethod(arg1, arg2...)
        // This is a naive regex, it assumes simple arguments without nested parens for the most part
        const regex = new RegExp(`await ${serviceMethod.replace('.', '\\.')}\\(([^)]*)\\)`, 'g');
        content = content.replace(regex, (match, argsString) => {
            modified = true;
            let args = argsString.split(',').map(s => s.trim());

            let dataPayload = '';
            if (config.args.length > 0) {
                let parsedArgs = config.args[0];
                for (let i = 0; i < args.length; i++) {
                    parsedArgs = parsedArgs.replace(`arg${i + 1}`, args[i]);
                }
                dataPayload = `, ${parsedArgs}`;
            }

            // For POST/PUT with no body data explicitly mapped but having args, handle generic body
            if ((config.method === 'post' || config.method === 'put') && dataPayload === '' && config.args.length === 0 && args.length > 0) {
                // For now, no such case in our simplistic mapping except where explicitly handled
                // Wait, checkout takes no args, update takes id and payload (handled by arg2), etc.
            }

            let urlStr = config.url.startsWith('`') ? config.url : `"${config.url}"`;
            urlStr = urlStr.replace('`', '`http://localhost:1234/api').replace('"', '"http://localhost:1234/api');

            const tokenHeader = `headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }`;
            const axiosOptions = `{ withCredentials: true, ${tokenHeader} }`;

            if (config.method === 'get' || config.method === 'delete') {
                return `await axios.${config.method}(${urlStr}, ${axiosOptions})`;
            } else {
                let requestData = dataPayload ? dataPayload.substring(2) : 'null'; // remove leading ', '
                return `await axios.${config.method}(${urlStr}, ${requestData}, ${axiosOptions})`;
            }
        });
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedFiles++;
    }
});

console.log(`Refactored ${modifiedFiles} files.`);

-- Update users.roles_list
UPDATE users u
SET roles_list = (
    SELECT GROUP_CONCAT(r.name SEPARATOR ',')
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = u.id
)
WHERE roles_list IS NULL;

-- Update cart_items.product_name, unit_price, total_price
UPDATE cart_items ci
JOIN products p ON ci.product_id = p.id
SET ci.product_name = p.name,
    ci.unit_price = p.price,
    ci.total_price = p.price * ci.quantity
WHERE ci.product_name IS NULL OR ci.unit_price IS NULL OR ci.total_price IS NULL;

-- Update cart.total_items, total_price
UPDATE cart c
SET total_items = COALESCE((SELECT SUM(quantity) FROM cart_items WHERE cart_id = c.id), 0),
    total_price = COALESCE((SELECT SUM(total_price) FROM cart_items WHERE cart_id = c.id), 0)
WHERE total_items IS NULL OR total_price IS NULL;

-- Update order_items.product_name
UPDATE order_items oi
JOIN products p ON oi.product_id = p.id
SET oi.product_name = p.name
WHERE oi.product_name IS NULL;

-- Update orders.product_name and quantity based on the first item (since it shouldn't really be on Order if it's a list, but we'll populate it if null)
UPDATE orders o
SET productName = (SELECT product_name FROM order_items WHERE order_id = o.id LIMIT 1),
    quantity = (SELECT SUM(quantity) FROM order_items WHERE order_id = o.id)
WHERE productName IS NULL;

-- Update ratings.producer_name
UPDATE ratings r
JOIN products p ON r.product_id = p.id
JOIN users u ON p.producer_id = u.id
SET r.producer_name = u.username
WHERE r.producer_name IS NULL;

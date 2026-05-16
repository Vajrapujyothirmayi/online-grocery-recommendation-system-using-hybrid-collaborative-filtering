-- Update orders.product_name and quantity based on the first item
UPDATE orders o
SET product_name = (SELECT product_name FROM order_items WHERE order_id = o.id LIMIT 1),
    quantity = (SELECT SUM(quantity) FROM order_items WHERE order_id = o.id)
WHERE product_name IS NULL;

-- Update ratings.producer_name
UPDATE ratings r
JOIN products p ON r.product_id = p.id
JOIN users u ON p.producer_id = u.id
SET r.producer_name = u.username
WHERE r.producer_name IS NULL;

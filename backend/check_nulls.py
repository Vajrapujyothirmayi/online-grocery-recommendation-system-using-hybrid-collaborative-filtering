import pymysql

try:
    conn = pymysql.connect(host='localhost', user='root', password='indraja@28', database='grocery_db')
    cursor = conn.cursor()
    
    tables_to_check = {
        'order_items': ['product_name', 'product_category', 'product_brand'],
        'cart_items': ['product_name', 'product_category', 'product_brand'],
        'cart': ['user_name'],
        'users': ['role', 'roles_list'],
        'ratings': ['product_name', 'user_name']
    }
    
    print("Checking for NULL values...")
    for table, columns in tables_to_check.items():
        for col in columns:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE {col} IS NULL")
                count = cursor.fetchone()[0]
                print(f"{table}.{col}: {count} NULLs")
            except Exception as e:
                print(f"Error checking {table}.{col}: {e}")
                
except Exception as e:
    print(f"Connection failed: {e}")

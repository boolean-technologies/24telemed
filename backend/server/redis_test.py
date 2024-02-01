import redis

# Connect to Redis server
r = redis.Redis(host='localhost', port=6379, db=0)

# # Set a key
# r.set('test_key', 'test_value')

# # Get value of the key
# value = r.get('test_key')
# print('Value of test_key:', value)

# Check server info
info = r.info()
print('Server Info:', info)

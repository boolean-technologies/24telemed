import redis
import os

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')

try:
    r = redis.Redis.from_url(redis_url)
    r.ping()  
    print("Connected to Redis")
    info = r.info()
    print('Server Info:', info)
except redis.RedisError as e:
    print(f"Failed to connect to Redis: {e}")

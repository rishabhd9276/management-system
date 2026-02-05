from motor.motor_asyncio import AsyncIOMotorClient
import os

# For a real project, this should be in an env file.
# Using a local mongodb instance for now or a connection string if provided.
# Since user didn't provide one, I'll assume local or standard connection.
# But for "Deployment" requirement, it's better to be configurable.
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "hrms_lite"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def get_database():
    return db

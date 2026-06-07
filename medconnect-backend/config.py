import os

class Config:
    # Secret key used by PyJWT to sign authentication tokens safely
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_super_secret_jwt_key_123')
    
    # MySQL Database Connection Settings
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'          # Change this if your MySQL username is different
    MYSQL_PASSWORD = 'Arpit@123'  # !!! CHANGE THIS to your actual MySQL root password !!!
    MYSQL_DB = 'medconnect_db'

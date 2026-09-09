from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os

# Cargar variables del archivo .env
load_dotenv()

# Obtener la URL completa de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")

# Si no existe DATABASE_URL, usar las variables individuales
if not DATABASE_URL:

    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

# Crear el motor de conexión
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# Crear sesiones para acceder a la base de datos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Clase base para los modelos
Base = declarative_base()


# Función para obtener una sesión de la base de datos
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
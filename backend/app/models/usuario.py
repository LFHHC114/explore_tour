from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, text
from app.database.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    correo = Column(String(150), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    telefono = Column(String(20))
    rol = Column(
        Enum("turista", "guia", "administrador"),
        nullable=False,
        default="turista"
    )
    fecha_registro = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )
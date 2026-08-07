from sqlalchemy import Column, Integer, String, Text, ForeignKey, DECIMAL, Enum
from app.database.database import Base

class Tour(Base):
    __tablename__ = "tours"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=False)
    precio = Column(DECIMAL(10, 2), nullable=False)
    duracion = Column(String(50), nullable=False)
    ubicacion = Column(String(100), nullable=False)
    imagen = Column(String(255))
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    guia_id = Column(Integer, ForeignKey("guias.id"))
    cupos = Column(Integer)
    estado = Column(Enum("activo", "inactivo"))
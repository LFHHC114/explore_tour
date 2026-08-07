from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database.database import Base

class Guia(Base):
    __tablename__ = "guias"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    descripcion = Column(Text)
    experiencia = Column(Integer)
    idiomas = Column(String(200))
    foto = Column(String(255))
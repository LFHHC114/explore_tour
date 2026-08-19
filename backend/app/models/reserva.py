from sqlalchemy import Column, Integer, Date, Enum, ForeignKey
from app.database.database import Base


class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    tour_id = Column(
        Integer,
        ForeignKey("tours.id"),
        nullable=False
    )

    fecha_reserva = Column(
        Date,
        nullable=False
    )

    cantidad_personas = Column(
        Integer,
        nullable=False
    )

    estado = Column(
        Enum("pendiente", "confirmada", "cancelada"),
        nullable=False,
        default="pendiente"
    )
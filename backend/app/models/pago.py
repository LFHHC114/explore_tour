from sqlalchemy import Column, Integer, Numeric, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.database import Base


class Pago(Base):
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True, autoincrement=True)

    reserva_id = Column(
        Integer,
        ForeignKey("reservas.id"),
        nullable=False
    )

    monto = Column(
        Numeric(10, 2),
        nullable=False
    )

    metodo_pago = Column(
        Enum("tarjeta", "efectivo", "transferencia"),
        nullable=False
    )

    estado = Column(
        Enum("pendiente", "pagado", "rechazado"),
        nullable=False,
        default="pendiente"
    )

    fecha_pago = Column(
        DateTime,
        nullable=True,
        server_default=func.current_timestamp()
    )
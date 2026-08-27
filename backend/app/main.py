from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash

from app.database.database import engine, SessionLocal

from app.models.usuario import Usuario
from app.models.tour import Tour
from app.models.categoria import Categoria
from app.models.guia import Guia
from app.models.reserva import Reserva
from app.models.pago import Pago


app = Flask(__name__)

# Permitir conexión desde el frontend React
CORS(app)


# =========================================================
# INICIO
# =========================================================

@app.route("/", methods=["GET"])
def inicio():
    return jsonify({
        "mensaje": "Backend de ExploreTour funcionando"
    })


# =========================================================
# PRUEBA DE BASE DE DATOS
# =========================================================

@app.route("/db-test", methods=["GET"])
def probar_base_datos():
    try:
        with engine.connect() as connection:
            resultado = connection.execute(text("SELECT 1"))
            resultado.fetchone()

        return jsonify({
            "mensaje": "Conexión a MySQL exitosa",
            "base_datos": "exploretour"
        })

    except Exception as e:
        return jsonify({
            "mensaje": "Error de conexión a MySQL",
            "error": str(e)
        }), 500


# =========================================================
# TOURS
# =========================================================

@app.route("/tours", methods=["GET"])
def obtener_tours():
    db = SessionLocal()

    try:
        tours = db.query(Tour).all()

        resultado = []

        for tour in tours:
            resultado.append({
                "id": tour.id,
                "titulo": tour.titulo,
                "descripcion": tour.descripcion,
                "precio": float(tour.precio),
                "duracion": tour.duracion,
                "ubicacion": tour.ubicacion,
                "imagen": tour.imagen,
                "categoria_id": tour.categoria_id,
                "guia_id": tour.guia_id,
                "cupos": tour.cupos,
                "estado": tour.estado
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "mensaje": "Error al consultar los tours",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# CATEGORÍAS
# =========================================================

@app.route("/categorias", methods=["GET"])
def obtener_categorias():
    db = SessionLocal()

    try:
        categorias = db.query(Categoria).all()

        resultado = []

        for categoria in categorias:
            resultado.append({
                "id": categoria.id,
                "nombre": categoria.nombre
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "mensaje": "Error al consultar las categorías",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# GUÍAS
# =========================================================

@app.route("/guias", methods=["GET"])
def obtener_guias():
    db = SessionLocal()

    try:
        guias = db.query(Guia).all()

        resultado = []

        for guia in guias:
            resultado.append({
                "id": guia.id,
                "usuario_id": guia.usuario_id,
                "descripcion": guia.descripcion,
                "experiencia": guia.experiencia,
                "idiomas": guia.idiomas,
                "foto": guia.foto
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "mensaje": "Error al consultar los guías",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# USUARIOS - CONSULTAR
# =========================================================

@app.route("/usuarios", methods=["GET"])
def obtener_usuarios():
    db = SessionLocal()

    try:
        usuarios = db.query(Usuario).all()

        resultado = []

        for usuario in usuarios:
            resultado.append({
                "id": usuario.id,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "correo": usuario.correo,
                "telefono": usuario.telefono,
                "rol": usuario.rol,
                "fecha_registro": str(usuario.fecha_registro)
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "mensaje": "Error al consultar los usuarios",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# USUARIOS - REGISTRAR
# =========================================================

@app.route("/usuarios", methods=["POST"])
def crear_usuario():
    db = SessionLocal()

    try:
        datos = request.get_json()

        if not datos:
            return jsonify({
                "mensaje": "No se recibieron datos"
            }), 400

        campos_obligatorios = [
            "nombre",
            "apellido",
            "correo",
            "password"
        ]

        for campo in campos_obligatorios:
            if campo not in datos or not datos[campo]:
                return jsonify({
                    "mensaje": f"El campo '{campo}' es obligatorio"
                }), 400

        usuario_existente = db.query(Usuario).filter(
            Usuario.correo == datos["correo"]
        ).first()

        if usuario_existente:
            return jsonify({
                "mensaje": "El correo ya está registrado"
            }), 409

        roles_validos = [
            "turista",
            "guia",
            "administrador"
        ]

        rol = datos.get("rol", "turista")

        if rol not in roles_validos:
            return jsonify({
                "mensaje": "El rol no es válido"
            }), 400

        nuevo_usuario = Usuario(
            nombre=datos["nombre"],
            apellido=datos["apellido"],
            correo=datos["correo"],
            password=generate_password_hash(datos["password"]),
            telefono=datos.get("telefono"),
            rol=rol
        )

        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)

        return jsonify({
            "mensaje": "Usuario registrado correctamente",
            "usuario": {
                "id": nuevo_usuario.id,
                "nombre": nuevo_usuario.nombre,
                "apellido": nuevo_usuario.apellido,
                "correo": nuevo_usuario.correo,
                "telefono": nuevo_usuario.telefono,
                "rol": nuevo_usuario.rol,
                "fecha_registro": str(nuevo_usuario.fecha_registro)
            }
        }), 201

    except Exception as e:
        db.rollback()

        return jsonify({
            "mensaje": "Error al registrar el usuario",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# LOGIN
# =========================================================

@app.route("/login", methods=["POST"])
def login():
    db = SessionLocal()

    try:
        datos = request.get_json()

        if not datos:
            return jsonify({
                "mensaje": "No se recibieron datos"
            }), 400

        correo = datos.get("correo")
        password = datos.get("password")

        if not correo or not password:
            return jsonify({
                "mensaje": "El correo y la contraseña son obligatorios"
            }), 400

        usuario = db.query(Usuario).filter(
            Usuario.correo == correo
        ).first()

        if not usuario:
            return jsonify({
                "mensaje": "Correo o contraseña incorrectos"
            }), 401

        if not check_password_hash(usuario.password, password):
            return jsonify({
                "mensaje": "Correo o contraseña incorrectos"
            }), 401

        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "correo": usuario.correo,
                "telefono": usuario.telefono,
                "rol": usuario.rol
            }
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al iniciar sesión",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# RESERVAS - CREAR
# =========================================================

@app.route("/reservas", methods=["POST"])
def crear_reserva():
    db = SessionLocal()

    try:
        datos = request.get_json()

        if not datos:
            return jsonify({
                "mensaje": "No se recibieron datos"
            }), 400

        campos_obligatorios = [
            "usuario_id",
            "tour_id",
            "fecha_reserva",
            "cantidad_personas"
        ]

        for campo in campos_obligatorios:
            if campo not in datos or datos[campo] in [None, ""]:
                return jsonify({
                    "mensaje": f"El campo '{campo}' es obligatorio"
                }), 400

        # Buscar usuario
        usuario = db.query(Usuario).filter(
            Usuario.id == datos["usuario_id"]
        ).first()

        if not usuario:
            return jsonify({
                "mensaje": "El usuario no existe"
            }), 404

        # Buscar tour
        tour = db.query(Tour).filter(
            Tour.id == datos["tour_id"]
        ).first()

        if not tour:
            return jsonify({
                "mensaje": "El tour no existe"
            }), 404

        # Validar cantidad
        try:
            cantidad_personas = int(datos["cantidad_personas"])
        except (ValueError, TypeError):
            return jsonify({
                "mensaje": "La cantidad de personas debe ser un número entero"
            }), 400

        if cantidad_personas <= 0:
            return jsonify({
                "mensaje": "La cantidad de personas debe ser mayor que 0"
            }), 400

        # Validar estado del tour
        if tour.estado != "activo":
            return jsonify({
                "mensaje": "El tour no está disponible"
            }), 400

        # Validar cupos
        if cantidad_personas > tour.cupos:
            return jsonify({
                "mensaje": "No hay suficientes cupos disponibles",
                "cupos_disponibles": tour.cupos
            }), 400

        # Validar fecha
        try:
            fecha_reserva = datetime.strptime(
                datos["fecha_reserva"],
                "%Y-%m-%d"
            ).date()

        except ValueError:
            return jsonify({
                "mensaje": "La fecha debe tener el formato YYYY-MM-DD"
            }), 400

        # Crear reserva
        nueva_reserva = Reserva(
            usuario_id=datos["usuario_id"],
            tour_id=datos["tour_id"],
            fecha_reserva=fecha_reserva,
            cantidad_personas=cantidad_personas,
            estado="pendiente"
        )

        db.add(nueva_reserva)

        # Descontar cupos
        tour.cupos -= cantidad_personas

        db.commit()
        db.refresh(nueva_reserva)

        return jsonify({
            "mensaje": "Reserva creada correctamente",
            "reserva": {
                "id": nueva_reserva.id,
                "usuario_id": nueva_reserva.usuario_id,
                "tour_id": nueva_reserva.tour_id,
                "fecha_reserva": str(nueva_reserva.fecha_reserva),
                "cantidad_personas": nueva_reserva.cantidad_personas,
                "estado": nueva_reserva.estado
            }
        }), 201

    except Exception as e:
        db.rollback()

        return jsonify({
            "mensaje": "Error al crear la reserva",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# RESERVAS - CONSULTAR
# =========================================================

@app.route("/reservas", methods=["GET"])
def obtener_reservas():
    db = SessionLocal()

    try:
        reservas = db.query(Reserva).all()

        resultado = []

        for reserva in reservas:
            resultado.append({
                "id": reserva.id,
                "usuario_id": reserva.usuario_id,
                "tour_id": reserva.tour_id,
                "fecha_reserva": str(reserva.fecha_reserva),
                "cantidad_personas": reserva.cantidad_personas,
                "estado": reserva.estado
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "mensaje": "Error al consultar las reservas",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# PAGOS - CREAR
# =========================================================

@app.route("/pagos", methods=["POST"])
def crear_pago():
    db = SessionLocal()

    try:
        datos = request.get_json()

        if not datos:
            return jsonify({
                "mensaje": "No se recibieron datos"
            }), 400

        campos_obligatorios = [
            "reserva_id",
            "monto",
            "metodo_pago"
        ]

        for campo in campos_obligatorios:
            if campo not in datos or datos[campo] in [None, ""]:
                return jsonify({
                    "mensaje": f"El campo '{campo}' es obligatorio"
                }), 400

        # ============================================
        # BUSCAR RESERVA
        # ============================================

        reserva = db.query(Reserva).filter(
            Reserva.id == datos["reserva_id"]
        ).first()

        if not reserva:
            return jsonify({
                "mensaje": "La reserva no existe"
            }), 404

        # ============================================
        # VERIFICAR SI YA EXISTE UN PAGO
        # ============================================

        pago_existente = db.query(Pago).filter(
            Pago.reserva_id == reserva.id
        ).first()

        if pago_existente:
            return jsonify({
                "mensaje": "Esta reserva ya tiene un pago registrado",
                "pago_id": pago_existente.id,
                "estado": pago_existente.estado
            }), 409

        # ============================================
        # VALIDAR MONTO
        # ============================================

        try:
            monto = float(datos["monto"])
        except (ValueError, TypeError):
            return jsonify({
                "mensaje": "El monto debe ser numérico"
            }), 400

        if monto <= 0:
            return jsonify({
                "mensaje": "El monto debe ser mayor que 0"
            }), 400

        # ============================================
        # VALIDAR MÉTODO DE PAGO
        # ============================================

        metodos_validos = [
            "tarjeta",
            "efectivo",
            "transferencia"
        ]

        metodo_pago = datos["metodo_pago"]

        if metodo_pago not in metodos_validos:
            return jsonify({
                "mensaje": "Método de pago no válido",
                "metodos_validos": metodos_validos
            }), 400

        # ============================================
        # CREAR PAGO COMO PAGADO
        # ============================================

        nuevo_pago = Pago(
            reserva_id=reserva.id,
            monto=monto,
            metodo_pago=metodo_pago,
            estado="pagado"
        )

        db.add(nuevo_pago)

        db.commit()

        db.refresh(nuevo_pago)

        return jsonify({
            "mensaje": "Pago realizado correctamente",
            "pago": {
                "id": nuevo_pago.id,
                "reserva_id": nuevo_pago.reserva_id,
                "monto": float(nuevo_pago.monto),
                "metodo_pago": nuevo_pago.metodo_pago,
                "estado": nuevo_pago.estado,
                "fecha_pago": str(nuevo_pago.fecha_pago)
            }
        }), 201

    except Exception as e:

        db.rollback()

        return jsonify({
            "mensaje": "Error al registrar el pago",
            "error": str(e)
        }), 500

    finally:
        db.close()


# =========================================================
# PAGOS - CONSULTAR
# =========================================================

@app.route("/pagos", methods=["GET"])
def obtener_pagos():
    db = SessionLocal()

    try:
        pagos = db.query(Pago).all()

        resultado = []

        for pago in pagos:
            resultado.append({
                "id": pago.id,
                "reserva_id": pago.reserva_id,
                "monto": float(pago.monto),
                "metodo_pago": pago.metodo_pago,
                "estado": pago.estado,
                "fecha_pago": str(pago.fecha_pago)
            })

        return jsonify(resultado)

    except Exception as e:
        return jsonify({
            "mensaje": "Error al consultar los pagos",
            "error": str(e)
        }), 500

    finally:
        db.close()
        
# =========================================================
# EJECUTAR SERVIDOR
# =========================================================

if __name__ == "__main__":

    print("========================================")
    print("     RUTAS REGISTRADAS - EXPLORETOUR")
    print("========================================")
    print(app.url_map)
    print("========================================")

    print("Iniciando servidor Flask...")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
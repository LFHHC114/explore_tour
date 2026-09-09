from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
import os

from app.database.database import engine, SessionLocal

from app.models.usuario import Usuario
from app.models.tour import Tour
from app.models.categoria import Categoria
from app.models.guia import Guia
from app.models.reserva import Reserva
from app.models.pago import Pago


# =========================================================
# CONFIGURACIÓN DE LA APLICACIÓN
# =========================================================

app = Flask(__name__)

# Permitir solicitudes desde el frontend de ExploreTour
CORS(app)


# =========================================================
# IMÁGENES
# =========================================================

@app.route("/imagenes/<path:nombre>", methods=["GET"])
def servir_imagen(nombre):

    carpeta_imagenes = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../frontend/img"
        )
    )

    return send_from_directory(
        carpeta_imagenes,
        nombre
    )


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

            resultado = connection.execute(
                text("SELECT 1")
            )

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
# TOURS - CONSULTAR
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
# TOURS - CREAR
# =========================================================

@app.route("/tours", methods=["POST"])
def crear_tour():

    db = SessionLocal()

    try:

        datos = request.get_json()

        if not datos:

            return jsonify({
                "mensaje": "No se recibieron datos"
            }), 400

        campos_obligatorios = [
            "titulo",
            "descripcion",
            "precio",
            "duracion",
            "ubicacion"
        ]

        for campo in campos_obligatorios:

            if campo not in datos or datos[campo] in [None, ""]:

                return jsonify({
                    "mensaje": f"El campo '{campo}' es obligatorio"
                }), 400

        # Validar precio
        try:

            precio = float(datos["precio"])

        except (ValueError, TypeError):

            return jsonify({
                "mensaje": "El precio debe ser numérico"
            }), 400

        if precio < 0:

            return jsonify({
                "mensaje": "El precio no puede ser negativo"
            }), 400

        # Validar cupos
        cupos = datos.get("cupos")

        if cupos in [None, ""]:

            cupos = 0

        else:

            try:

                cupos = int(cupos)

            except (ValueError, TypeError):

                return jsonify({
                    "mensaje": "Los cupos deben ser un número entero"
                }), 400

            if cupos < 0:

                return jsonify({
                    "mensaje": "Los cupos no pueden ser negativos"
                }), 400

        # Validar categoría
        categoria_id = datos.get("categoria_id")

        if categoria_id in [None, ""]:

            categoria_id = None

        else:

            try:

                categoria_id = int(categoria_id)

            except (ValueError, TypeError):

                return jsonify({
                    "mensaje": "El ID de categoría debe ser un número entero"
                }), 400

            categoria = db.query(Categoria).filter(
                Categoria.id == categoria_id
            ).first()

            if not categoria:

                return jsonify({
                    "mensaje": "La categoría seleccionada no existe"
                }), 400

        # Validar guía
        guia_id = datos.get("guia_id")

        if guia_id in [None, ""]:

            guia_id = None

        else:

            try:

                guia_id = int(guia_id)

            except (ValueError, TypeError):

                return jsonify({
                    "mensaje": "El ID del guía debe ser un número entero"
                }), 400

            guia = db.query(Guia).filter(
                Guia.id == guia_id
            ).first()

            if not guia:

                return jsonify({
                    "mensaje": "El guía seleccionado no existe"
                }), 400

        # Estado
        estado = datos.get("estado", "activo")

        if not estado:
            estado = "activo"

        # Crear tour
        nuevo_tour = Tour(
            titulo=datos["titulo"].strip(),
            descripcion=datos["descripcion"].strip(),
            precio=precio,
            duracion=datos["duracion"].strip(),
            ubicacion=datos["ubicacion"].strip(),
            imagen=datos.get("imagen"),
            categoria_id=categoria_id,
            guia_id=guia_id,
            cupos=cupos,
            estado=estado
        )

        db.add(nuevo_tour)

        db.commit()

        db.refresh(nuevo_tour)

        return jsonify({
            "mensaje": "Sitio turístico creado correctamente",
            "tour": {
                "id": nuevo_tour.id,
                "titulo": nuevo_tour.titulo,
                "descripcion": nuevo_tour.descripcion,
                "precio": float(nuevo_tour.precio),
                "duracion": nuevo_tour.duracion,
                "ubicacion": nuevo_tour.ubicacion,
                "imagen": nuevo_tour.imagen,
                "categoria_id": nuevo_tour.categoria_id,
                "guia_id": nuevo_tour.guia_id,
                "cupos": nuevo_tour.cupos,
                "estado": nuevo_tour.estado
            }
        }), 201

    except Exception as e:

        db.rollback()

        return jsonify({
            "mensaje": "Error al crear el sitio turístico",
            "error": str(e)
        }), 500

    finally:

        db.close()


# =========================================================
# TOURS - EDITAR
# =========================================================

@app.route("/tours/<int:id>", methods=["PUT"])
def actualizar_tour(id):

    db = SessionLocal()

    try:

        datos = request.get_json()

        if not datos:

            return jsonify({
                "mensaje": "No se recibieron datos"
            }), 400

        tour = db.query(Tour).filter(
            Tour.id == id
        ).first()

        if not tour:

            return jsonify({
                "mensaje": "El sitio turístico no existe"
            }), 404

        titulo = datos.get("titulo")
        descripcion = datos.get("descripcion")
        precio = datos.get("precio")
        duracion = datos.get("duracion")
        ubicacion = datos.get("ubicacion")

        if (
            not titulo
            or not descripcion
            or precio is None
            or not duracion
            or not ubicacion
        ):

            return jsonify({
                "mensaje": "Título, descripción, precio, duración y ubicación son obligatorios"
            }), 400

        tour.titulo = titulo
        tour.descripcion = descripcion
        tour.precio = precio
        tour.duracion = duracion
        tour.ubicacion = ubicacion

        if "imagen" in datos:
            tour.imagen = datos["imagen"]

        if "categoria_id" in datos:
            tour.categoria_id = datos["categoria_id"]

        if "guia_id" in datos:
            tour.guia_id = datos["guia_id"]

        if "cupos" in datos:
            tour.cupos = datos["cupos"]

        if "estado" in datos:
            tour.estado = datos["estado"]

        db.commit()

        db.refresh(tour)

        return jsonify({
            "mensaje": "Sitio turístico actualizado correctamente",
            "tour": {
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
            }
        }), 200

    except Exception as e:

        db.rollback()

        return jsonify({
            "mensaje": "Error al actualizar el sitio turístico",
            "error": str(e)
        }), 500

    finally:

        db.close()


# =========================================================
# TOURS - ELIMINAR
# =========================================================

@app.route("/tours/<int:id>", methods=["DELETE"])
def eliminar_tour(id):

    db = SessionLocal()

    try:

        tour = db.query(Tour).filter(
            Tour.id == id
        ).first()

        if not tour:

            return jsonify({
                "mensaje": "El sitio turístico no existe"
            }), 404

        db.delete(tour)

        db.commit()

        return jsonify({
            "mensaje": "Sitio turístico eliminado correctamente"
        }), 200

    except Exception as e:

        db.rollback()

        return jsonify({
            "mensaje": "Error al eliminar el tour",
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

        if not check_password_hash(
            usuario.password,
            password
        ):

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
# USUARIOS - EDITAR
# =========================================================

@app.route("/usuarios/<int:id>", methods=["PUT"])
def actualizar_usuario(id):

    db = SessionLocal()

    try:

        datos = request.get_json()

        if not datos:

            return jsonify({
                "mensaje": "No se recibieron datos"
            }), 400

        usuario = db.query(Usuario).filter(
            Usuario.id == id
        ).first()

        if not usuario:

            return jsonify({
                "mensaje": "El usuario no existe"
            }), 404

        nombre = datos.get("nombre")
        apellido = datos.get("apellido")
        correo = datos.get("correo")
        telefono = datos.get("telefono")

        if not nombre or not apellido or not correo:

            return jsonify({
                "mensaje": "Nombre, apellido y correo son obligatorios"
            }), 400

        # =========================================
        # VALIDAR CORREO
        # =========================================

        usuario_correo = db.query(Usuario).filter(
            Usuario.correo == correo,
            Usuario.id != id
        ).first()

        if usuario_correo:

            return jsonify({
                "mensaje": "El correo ya está registrado por otro usuario"
            }), 409

        # =========================================
        # ACTUALIZAR DATOS DEL USUARIO
        # =========================================

        usuario.nombre = nombre
        usuario.apellido = apellido
        usuario.correo = correo
        usuario.telefono = telefono

        # =========================================
        # ACTUALIZAR ROL
        # =========================================

        if "rol" in datos:

            roles_validos = [
                "turista",
                "guia",
                "administrador"
            ]

            rol = datos["rol"]

            if rol not in roles_validos:

                return jsonify({
                    "mensaje": "El rol no es válido",
                    "roles_validos": roles_validos
                }), 400

            usuario.rol = rol

        # =========================================
        # GUARDAR CAMBIOS
        # =========================================

        db.commit()

        db.refresh(usuario)

        return jsonify({
            "mensaje": "Usuario actualizado correctamente",
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

        db.rollback()

        return jsonify({
            "mensaje": "Error al actualizar el usuario",
            "error": str(e)
        }), 500

    finally:

        db.close()


# =========================================================
# USUARIOS - ELIMINAR
# =========================================================

@app.route("/usuarios/<int:id>", methods=["DELETE"])
def eliminar_usuario(id):

    db = SessionLocal()

    try:

        usuario = db.query(Usuario).filter(
            Usuario.id == id
        ).first()

        if not usuario:

            return jsonify({
                "mensaje": "El usuario no existe"
            }), 404

        # Eliminar reservas y sus pagos
        reservas_usuario = db.query(Reserva).filter(
            Reserva.usuario_id == id
        ).all()

        for reserva in reservas_usuario:

            pagos_reserva = db.query(Pago).filter(
                Pago.reserva_id == reserva.id
            ).all()

            for pago in pagos_reserva:
                db.delete(pago)

            db.delete(reserva)

        # Eliminar guía asociada
        guia = db.query(Guia).filter(
            Guia.usuario_id == id
        ).first()

        if guia:
            db.delete(guia)

        # Eliminar usuario
        db.delete(usuario)

        db.commit()

        return jsonify({
            "mensaje": "Usuario eliminado correctamente"
        }), 200

    except Exception as e:

        db.rollback()

        return jsonify({
            "mensaje": "Error al eliminar el usuario",
            "error": str(e)
        }), 500

    finally:

        db.close()


# =========================================================
# USUARIOS - CAMBIAR CONTRASEÑA
# =========================================================

@app.route("/usuarios/<int:id>/password", methods=["PUT"])
def cambiar_password(id):

    db = SessionLocal()

    try:

        datos = request.get_json()

        if not datos:

            return jsonify({
                "mensaje": "No se recibieron datos"
            }), 400

        password_actual = datos.get("password_actual")
        password_nueva = datos.get("password_nueva")

        if not password_actual or not password_nueva:

            return jsonify({
                "mensaje": "La contraseña actual y la nueva contraseña son obligatorias"
            }), 400

        usuario = db.query(Usuario).filter(
            Usuario.id == id
        ).first()

        if not usuario:

            return jsonify({
                "mensaje": "El usuario no existe"
            }), 404

        if not check_password_hash(
            usuario.password,
            password_actual
        ):

            return jsonify({
                "mensaje": "La contraseña actual es incorrecta"
            }), 401

        if len(password_nueva) < 6:

            return jsonify({
                "mensaje": "La nueva contraseña debe tener mínimo 6 caracteres"
            }), 400

        if password_actual == password_nueva:

            return jsonify({
                "mensaje": "La nueva contraseña debe ser diferente a la actual"
            }), 400

        usuario.password = generate_password_hash(
            password_nueva
        )

        db.commit()

        return jsonify({
            "mensaje": "Contraseña actualizada correctamente"
        }), 200

    except Exception as e:

        db.rollback()

        return jsonify({
            "mensaje": "Error al cambiar la contraseña",
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

        # Validar cantidad de personas
        try:

            cantidad_personas = int(
                datos["cantidad_personas"]
            )

        except (ValueError, TypeError):

            return jsonify({
                "mensaje": "La cantidad de personas debe ser un número entero"
            }), 400

        if cantidad_personas <= 0:

            return jsonify({
                "mensaje": "La cantidad de personas debe ser mayor que 0"
            }), 400

        # Validar estado
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

        reserva_id = datos.get("reserva_id")
        monto_dato = datos.get("monto")
        metodo_pago = datos.get("metodo_pago")

        # Validar campos obligatorios
        if reserva_id in [None, ""]:

            return jsonify({
                "mensaje": "El campo 'reserva_id' es obligatorio"
            }), 400

        if monto_dato in [None, ""]:

            return jsonify({
                "mensaje": "El campo 'monto' es obligatorio"
            }), 400

        if metodo_pago in [None, ""]:

            return jsonify({
                "mensaje": "El campo 'metodo_pago' es obligatorio"
            }), 400

        # Validar ID de reserva
        try:

            reserva_id = int(reserva_id)

        except (ValueError, TypeError):

            return jsonify({
                "mensaje": "El ID de la reserva debe ser un número entero"
            }), 400

        # Buscar reserva
        reserva = db.query(Reserva).filter(
            Reserva.id == reserva_id
        ).first()

        if not reserva:

            return jsonify({
                "mensaje": "La reserva no existe",
                "reserva_id": reserva_id
            }), 404

        # Verificar pago existente
        pago_existente = db.query(Pago).filter(
            Pago.reserva_id == reserva_id
        ).first()

        if pago_existente:

            return jsonify({
                "mensaje": "Esta reserva ya tiene un pago registrado",
                "pago_id": pago_existente.id,
                "estado": pago_existente.estado,
                "reserva_id": reserva_id
            }), 409

        # Validar monto
        try:

            monto = float(monto_dato)

        except (ValueError, TypeError):

            return jsonify({
                "mensaje": "El monto debe ser numérico"
            }), 400

        if monto <= 0:

            return jsonify({
                "mensaje": "El monto debe ser mayor que 0"
            }), 400

        # Validar método de pago
        metodos_validos = [
            "tarjeta",
            "efectivo",
            "transferencia"
        ]

        metodo_pago = str(
            metodo_pago
        ).strip().lower()

        if metodo_pago not in metodos_validos:

            return jsonify({
                "mensaje": "Método de pago no válido",
                "metodos_validos": metodos_validos
            }), 400

        # Crear pago
        nuevo_pago = Pago(
            reserva_id=reserva_id,
            monto=monto,
            metodo_pago=metodo_pago,
            estado="pagado"
        )

        db.add(nuevo_pago)

        # Confirmar reserva
        reserva.estado = "confirmada"

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
# EJECUTAR SERVIDOR
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
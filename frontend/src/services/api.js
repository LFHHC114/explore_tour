const API_URL = "http://192.168.1.61:5000";

export async function obtenerTours() {
  const respuesta = await fetch(`${API_URL}/tours`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los tours");
  }

  return await respuesta.json();
}
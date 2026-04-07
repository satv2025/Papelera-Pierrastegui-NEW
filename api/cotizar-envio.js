export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const { direccion, origen } = req.body || {};

        if (!direccion || !String(direccion).trim()) {
            return res.status(400).json({ error: "Falta la dirección" });
        }

        if (!origen || typeof origen.lat !== "number" || typeof origen.lon !== "number") {
            return res.status(400).json({ error: "Falta el origen" });
        }

        const direccionCompleta = String(direccion).toLowerCase().includes("argentina")
            ? String(direccion).trim()
            : `${String(direccion).trim()}, Argentina`;

        const destino = await geocodificarDireccion(direccionCompleta);
        const ruta = await calcularRuta(
            { lat: origen.lat, lon: origen.lon },
            { lat: destino.lat, lon: destino.lon }
        );

        return res.status(200).json({
            ok: true,
            destino: destino.displayName,
            distanceMeters: ruta.distanceMeters,
            distanceKm: ruta.distanceKm,
            durationSeconds: ruta.durationSeconds,
            durationMinutes: ruta.durationMinutes
        });
    } catch (error) {
        console.error("Error en /api/cotizar-envio:", error);

        return res.status(500).json({
            error: error?.message || "No se pudo calcular el envío"
        });
    }
}

async function fetchConTimeout(url, options = {}, timeoutMs = 7000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return res;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("La consulta tardó demasiado");
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

async function geocodificarDireccion(direccionCompleta) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ar&q=${encodeURIComponent(direccionCompleta)}`;

    const res = await fetchConTimeout(
        url,
        {
            headers: {
                Accept: "application/json",
                "User-Agent": "papelerapierrastegui/1.0"
            }
        },
        7000
    );

    if (!res.ok) {
        throw new Error("Error consultando geocodificación");
    }

    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
        throw new Error("Dirección no encontrada");
    }

    return {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
        displayName: data[0].display_name || direccionCompleta
    };
}

async function calcularRuta(origen, destino) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=false&geometries=geojson&steps=false`;

    const res = await fetchConTimeout(
        url,
        {
            headers: {
                Accept: "application/json"
            }
        },
        7000
    );

    if (!res.ok) {
        throw new Error("Error consultando ruta");
    }

    const data = await res.json();

    if (!data.routes || !data.routes.length) {
        throw new Error("No se pudo calcular la ruta");
    }

    const route = data.routes[0];

    return {
        distanceMeters: Number(route.distance || 0),
        distanceKm: Number(route.distance || 0) / 1000,
        durationSeconds: Number(route.duration || 0),
        durationMinutes: Number(route.duration || 0) / 60
    };
}
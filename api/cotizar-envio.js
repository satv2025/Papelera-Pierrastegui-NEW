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

        const distanceKm = calcularDistanciaKm(
            origen.lat,
            origen.lon,
            destino.lat,
            destino.lon
        );

        return res.status(200).json({
            ok: true,
            destino: destino.displayName,
            distanceKm,
            distanceMeters: distanceKm * 1000,
            durationMinutes: 0,
            durationSeconds: 0
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

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
}

function toRad(value) {
    return value * Math.PI / 180;
}
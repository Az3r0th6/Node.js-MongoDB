const Records = require('./records.model');
const fs = require('fs');
const readline = require('readline');

// Carga el archivo CSV, lo lee por partes y mete los datos en Mongo.
// Lo hacemos por lotes para que no reviente la RAM si el archivo es muy grande.
const upload = async (req, res) => {
    const { file } = req;

    // Si no mandaron archivo, devolvemos error
    if (!file || !file.path) {
        return res.status(400).json({ message: 'Faltó subir el archivo' });
    }

    const filePath = file.path;
    const BATCH_SIZE = 10000; // podés subirlo si ves que aguanta

    let batch = [];
    let total = 0;

    try {
        const stream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity,
        });

        let primeraLinea = true;

        for await (const linea of rl) {
            if (primeraLinea) {
                primeraLinea = false;
                continue; // salteamos los headers
            }

            if (!linea.trim()) continue; // línea vacía, la salteamos

            const partes = linea.split(',');
            if (partes.length < 6) continue; // línea mal formada

            const [idStr, firstname, lastname, email, email2, profession] = partes;
            const id = Number(idStr);

            const record = {
                id: Number.isNaN(id) ? undefined : id,
                firstname,
                lastname,
                email,
                email2,
                profession,
            };

            batch.push(record);
            total++;

            if (batch.length >= BATCH_SIZE) {
                await Records.insertMany(batch, { ordered: false });
                batch = [];
            }
        }

        // cargamos lo que quedó
        if (batch.length) {
            await Records.insertMany(batch, { ordered: false });
        }

        // limpiamos el archivo temporal
        fs.unlink(filePath, (err) => {
            if (err) console.error('No se pudo borrar el archivo temporal:', err.message);
        });

        return res.status(200).json({ message: `Se procesaron ${total} registros correctamente` });

    } catch (err) {
        // si falla algo, intentamos limpiar igual el archivo
        try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {
            console.error('Error limpiando archivo:', e.message);
        }

        console.error('Error procesando archivo:', err.message);
        return res.status(500).json({ message: 'Hubo un error al procesar el archivo', error: err.message });
    }
};

// Devuelve los primeros 10 registros nomás, para testear o ver qué hay.
const list = async (_, res) => {
    try {
        const registros = await Records.find({}).limit(10).lean();
        return res.status(200).json(registros);
    } catch (err) {
        return res.status(500).json({ message: 'Error al obtener los registros', error: err.message });
    }
};

module.exports = {
    upload,
    list,
};


# Node.js-MongoDB

# 📦 Carga Masiva de Registros CSV con Node.js + MongoDB

Este proyecto fue desarrollado como ejercicio para poner a prueba el manejo de archivos grandes, procesamiento eficiente con streams y carga por lotes en MongoDB usando Node.js.

---

## 🚀 ¿Qué hace?

Permite subir un archivo `.csv` de gran tamaño (~80MB o más), procesarlo línea por línea y guardar cada registro en MongoDB, sin consumir demasiada memoria y manteniendo buena performance.

---

## 🔧 Tecnologías usadas

- Node.js
- Express
- MongoDB (via Mongoose)
- Multer (para subida de archivos)
- FS + Readline (para procesamiento por stream)
- Dotenv

---

## 📁 Estructura del proyecto
📦 raiz
┣ 📂 src
┃ ┣ 📜 controller.js → Lógica principal de carga
┃ ┣ 📜 records.model.js → Modelo de Mongo
┣ 📜 route.js → Rutas de Express
┣ 📜 app.js / index.js → Configuración del servidor
┣ 📜 .env → Configuración del entorno

---

## ⚙️ Cómo levantar el proyecto

1. **Instalá las dependencias**

```bash
npm install

2. Configurá tu .env
PORT=4000
NODE_ENV=production
MONGODB_URL=mongodb://localhost:27017/rog-exercise

3. Iniciá el servidor

npm start

Endpoint para subir archivo
POST /api/upload

    Tipo de body: form-data

    Campo requerido: file

    Valor: archivo .csv descomprimido

📌 El archivo debe tener los siguientes campos, separados por coma:
id, firstname, lastname, email, email2, profession

📎 Ejemplo de respuesta:

{
  "message": "Se procesaron 999991 registros correctamente"
}

📄 Endpoint de consulta
GET /api/list

Devuelve los primeros 10 registros guardados en la base.
⚠️ Consideraciones

    La primera línea del .csv (cabecera) se ignora.

    Líneas vacías o con menos de 6 columnas se omiten.

    El sistema carga los datos en lotes de 10.000 registros para mayor eficiencia.

    El archivo temporal se borra automáticamente una vez terminado el proceso.

    En caso de error, también se intenta limpiar el archivo.

🧪 Tests sugeridos

    Probar con archivos grandes (más de 100MB).

    Simular archivos con líneas corruptas o incompletas.

    Verificar que no se frene ante duplicados.

    Medir tiempo de ejecución (console.time()).

✌️ Hecho por mí

Desarrollado como parte de un desafío técnico.
Con foco en performance, prolijidad de código y buenas prácticas.

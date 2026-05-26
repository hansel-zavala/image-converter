# Image Converter

Herramienta web de conversión de imágenes. Sube, convierte y descarga.

## Stack
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + Sharp + Multer

## Formatos soportados
- **Entrada**: JPG, PNG, WebP, GIF, AVIF, BMP, TIFF
- **Salida**: WebP, PNG, JPEG, AVIF, GIF

## Inicio rápido

```bash
# 1. Backend
cd backend
npm install
npm run dev       # puerto 4000

# 2. Frontend (nueva terminal)
cd frontend
npm install
npm run dev       # puerto 5173
```

Abre http://localhost:5173

## Estructura

```
image-converter/
├── frontend/       # React + Vite
└── backend/        # Express + Sharp
```

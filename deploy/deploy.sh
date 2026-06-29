#!/bin/bash
# Script de actualización — ejecutar en el VPS desde /home/ubuntu/SISTEMAS/RESTAURANTE
# Uso: bash deploy/deploy.sh

set -e
cd /home/ubuntu/SISTEMAS/RESTAURANTE

echo "==> Obteniendo cambios..."
git pull origin main

echo "==> Instalando dependencias del backend..."
cd backend && npm install --omit=dev && cd ..

echo "==> Construyendo frontend..."
cd frontend && npm install && npm run build && cd ..

echo "==> Reiniciando servicio..."
pm2 reload restaurante-api

echo "==> Recargando Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "Despliegue completado"
pm2 status restaurante-api

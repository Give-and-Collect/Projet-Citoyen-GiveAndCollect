# Utiliser l'image de base officielle Node.js
FROM node:20-alpine

# Installer les outils de construction nécessaires
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY give-and-collect/package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet
COPY give-and-collect .

# Générer le client Prisma pour Linux
RUN npx prisma generate

# Construire l'application
RUN npm run build

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]

# Utiliser une image Node.js comme base
FROM node:20-alpine

# Ajouter un label pour indiquer la source du code
LABEL org.opencontainers.image.source=https://github.com/OWNER/REPO

# Définir le répertoire de travail
WORKDIR /app

COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Définir la commande par défaut à exécuter lorsque le conteneur démarre
CMD ["npm", "run", "start"]
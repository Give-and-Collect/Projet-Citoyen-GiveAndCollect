# Utiliser l'image de base officielle Node.js
FROM node:20-alpine

# Installer les outils de construction nécessaires
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Créer et définir le répertoire de travail
WORKDIR /app

# Définir les arguments de construction
ARG DATABASE_TEST_URL
ARG NEXTAUTH_SECRET
ARG EMAIL_USER
ARG EMAIL_PASS
ARG CYPRESS_EMAIL
ARG CYPRESS_PASSWORD
ARG NEXTAUTH_URL

# Définir les variables d'environnement dans le conteneur
ENV DATABASE_TEST_URL=${DATABASE_TEST_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV EMAIL_USER=${EMAIL_USER}
ENV EMAIL_PASS=${EMAIL_PASS}
ENV CYPRESS_EMAIL=${CYPRESS_EMAIL}
ENV CYPRESS_PASSWORD=${CYPRESS_PASSWORD}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

# Copier les fichiers package.json et package-lock.json
COPY give-and-collect/package*.json ./


# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet
COPY give-and-collect .

RUN ls -a

# Générer le client Prisma pour Linux
RUN npx prisma generate
RUN npx prisma db push

# Construire l'application
RUN npm run build

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]

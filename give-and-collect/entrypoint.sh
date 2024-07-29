npm install
RUN npx prisma generate
RUN npx prisma migrate deploy
npm run build
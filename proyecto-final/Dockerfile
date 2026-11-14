FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p public/uploads
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]
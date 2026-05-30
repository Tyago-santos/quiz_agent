ARG TARGET=development

FROM node:20-alpine AS base
WORKDIR /app
EXPOSE 3000

FROM base AS development
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS production
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]

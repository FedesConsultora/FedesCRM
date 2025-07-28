FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Instalamos nodemon globalmente para el entorno dev
RUN npm install -g nodemon

COPY . .

CMD ["npm", "run", "dev"]

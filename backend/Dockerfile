FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Instala nodemon global por si hace falta fuera del npm script
RUN npm install -g nodemon

CMD ["npm", "run", "dev"]

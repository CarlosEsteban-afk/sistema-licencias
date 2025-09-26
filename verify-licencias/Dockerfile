FROM node:18

WORKDIR /app

COPY package*.json ./

# Instalamos pact (CLI incluida)
RUN npm install
 
COPY . .


EXPOSE 3000
# Default command (sobrescrito en docker-compose)
CMD ["node", "src/index.js"]

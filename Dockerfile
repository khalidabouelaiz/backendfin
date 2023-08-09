# Utilisez une image de base Node.js
FROM node:19.5.0-slim

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et le package-lock.json dans le conteneur
COPY package*.json ./

# Installez les dépendances
RUN npm install


                
# RUN pkill -f "node"
# RUN npm install --force
# RUN npm install @sideway/formula
# RUN npm installx @sideway/address
# RUN npm install @sideway/pinpoint
# RUN npm install joi

# RUN npm install -g @angular/cli
# RUN npm install --production 
# RUN npm install pm2 -g

RUN apt-get update && \
    apt-get install -y gnupg wget && \
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org


# Copiez les fichiers du backend dans le conteneur
COPY . .

RUN mkdir -p /data/db

# Exposez le port utilisé par votre application
EXPOSE 7777 27017

# Démarrez l'application backend
# CMD ["pm2","start", "index.js","-f"]
CMD ["sh", "-c", "mongod & node index.js"]

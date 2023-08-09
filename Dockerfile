# Utilisez une image de base Node.js
FROM node:16

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le package.json et le package-lock.json dans le conteneur
COPY package*.json ./

# Installez les dépendances
RUN npm install


                
RUN pkill -f "node"
RUN npm install --force
RUN npm install @sideway/formula
RUN npm install @sideway/address
RUN npm install @sideway/pinpoint
RUN npm install joi

RUN npm install -g @angular/cli
RUN npm install --production 
RUN npm install pm2 -g

# Copiez les fichiers du backend dans le conteneur
COPY . .

# Exposez le port utilisé par votre application
EXPOSE 7777 27017

# Démarrez l'application backend
# CMD ["pm2","start", "index.js","-f"]
CMD ["node", "index.js"]

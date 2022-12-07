# TODO: cambiar esta imagen por una mas segura
FROM node:18-alpine

# Upgrade alpine packages
RUN apk -U upgrade

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

RUN chown -R node:node .
USER node
EXPOSE 8080
# will be overwritten when running docker-compose
CMD [ "node", "server.js" ]
FROM node:carbon

# Create app directory
WORKDIR /usr/src/hermes

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 1883
CMD [ "npm", "start" ]
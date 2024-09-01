# Start by specifying the base image
FROM node:latest

# Create app directory
WORKDIR /usr/src/client

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install all node modules
RUN npm install

# Download wait-for-it.sh script
RUN wget -O wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x wait-for-it.sh

# Bundle app source
COPY . .

CMD ["./wait-for-it.sh", "blockchain-api:8080", "--", "npm", "run", "start"]
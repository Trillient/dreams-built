FROM node:16.13.0-alpine3.13
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true

COPY package*.json /app/
RUN npm install

# Create and set permissions for the .cache directory after installing node modules
RUN mkdir -p /app/node_modules/.cache && chmod -R 777 /app/node_modules/.cache

COPY . /app
EXPOSE 3000
ENTRYPOINT ["npm", "start"]

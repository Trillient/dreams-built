FROM node:16.13.0-alpine3.13
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
COPY package*.json /app/
RUN ["npm", "install"]
COPY . /app
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
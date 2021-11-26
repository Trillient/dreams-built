FROM node:16.13.0-buster
WORKDIR /app
COPY package*.json /app/
RUN ["npm", "install"]
COPY . /app/
EXPOSE 5000
ENTRYPOINT ["npm", "run", "dev"]
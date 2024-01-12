FROM node:18.17.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD [ "npm", "start"]

# docker build -t extractio:1.0 .
# docker run -p 5000:5000 [docker-tag here]
# has some issues with puppeteer, but i'm too lazy to fix https://macarthur.me/posts/puppeteer-with-docker
FROM node
WORKDIR /usr/app
COPY package.json package.json
RUN npm install express spotify-web-api-node ejs express-session
COPY app.js app.js
COPY playback.html playback.html
#COPY key.pem key.pem # self-signed
COPY privkey.pem privkey.pem 
#COPY cert.pem cert.pem # self-signed
COPY fullchain.pem fullchain.pem
RUN mkdir third_party
COPY spotify-web-api-js-1.5.2/src/spotify-web-api.js spotify-web-api.js
ENTRYPOINT node app.js


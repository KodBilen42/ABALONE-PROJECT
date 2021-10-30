FROM node:lts-alpine

# app klasörü oluştur
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Bu development için böyle, productionda alttaki olcak
RUN npm install
# RUN npm ci --only=production
#çünkü "the npm ci command helps provide faster, reliable, reproducible builds for production environments"

# Bundle app source
COPY . .

#port aç
EXPOSE 3

#çalıştır
CMD [ "node", "server.js" ]
FROM node:latest

WORKDIR /home

COPY . .
RUN npm i
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
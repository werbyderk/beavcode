FROM node:latest

WORKDIR /home

# TODO taboo
COPY . .
RUN npm i
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
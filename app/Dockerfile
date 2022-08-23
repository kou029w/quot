FROM node:18.7.0-alpine
WORKDIR /app
COPY . /app
RUN npm ci --production
CMD ["npm", "start"]

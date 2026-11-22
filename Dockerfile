FROM node:22-alpine
WORKDIR /app
COPY lib ./lib
COPY services ./services
# El proceso concreto lo define "command" en docker-compose.yml

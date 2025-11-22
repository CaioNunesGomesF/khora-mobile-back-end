FROM node:latest

WORKDIR /app

# copy package files first for better layer caching
COPY package*.json ./

# install dependencies (includes devDependencies here so `prisma` CLI is available)
RUN npm install

# copy prisma schema before running `prisma generate` so it can find schema.prisma
COPY prisma ./prisma

# generate the Prisma client using the schema in ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# copy rest of the app
COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run", "dev" ]

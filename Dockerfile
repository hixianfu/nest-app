from  node:18-alpine

workdir /app

run npm install -g pnpm

copy pnpm-lock.yaml .
copy package.json .

run pnpm install --frozen-lockfile

copy . .

run pnpm run build

expose 3000

cmd ["pnpm", "start:prod"]
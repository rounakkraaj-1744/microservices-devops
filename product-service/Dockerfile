FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lockb* .

RUN bun install

COPY . .

RUN bun run prisma:generate

EXPOSE 4002

CMD ["bun", "run", "start"]

FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lockb* .

RUN bun install

COPY . .

# Generate Prisma client
RUN bun run prisma:generate

EXPOSE 4003

CMD ["bun", "run", "start"]

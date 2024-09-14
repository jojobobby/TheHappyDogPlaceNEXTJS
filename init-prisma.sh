#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Initializing Prisma..."

# Install Prisma CLI and client
echo "Installing Prisma dependencies..."
npm install prisma --save-dev
npm install @prisma/client

# Initialize Prisma
echo "Setting up Prisma configuration..."
npx prisma init

# Create a basic Prisma schema
echo "Creating basic Prisma schema..."
cat > prisma/schema.prisma << EOL
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
EOL

# Run initial Prisma migration
echo "Running initial Prisma migration..."
npx prisma migrate dev --name init

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Prisma initialization complete!"
echo "You can now start using Prisma in your Next.js project."
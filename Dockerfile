# Use the official Node.js image with Alpine Linux
FROM node:alpine

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json to the working directory
COPY ./app/package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code to the working directory
COPY ./app .

# Install and build Prisma
RUN npx prisma generate

# Build the application
RUN npm run build

ARG PORT=${PORT}
ARG DATABASE_URL=${DATABASE_URL}

# Expose the port the app runs on
EXPOSE 3000

# Set the environment variable for Node.js
ENV NODE_ENV production

RUN npm install -g nodemon

# Command to run the application
CMD ["nodemon", "dist/index.js"]
# Use an official Node.js runtime as a base image
FROM node:slim

# Set the working directory in the container
WORKDIR /app/server

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Command to run your application
CMD ["npm", "start"]


# FROM node:20 AS Production

# ENV NODE_ENV=Production

# WORKDIR /socket-io-react-example/server

# COPY package.json .
# COPY package.lock.json .

# RUN npm install

# COPY . .

# RUN npm run build
# FROM node:slim  
# WORKDIR /app
# COPY . /app/
# RUN npm install
# EXPOSE 3001
# CMD node index.js


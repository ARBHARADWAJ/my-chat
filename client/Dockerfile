# Use an official Node.js runtime as a base image
FROM node:slim

# Set the working directory in the container
WORKDIR /app/client

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]

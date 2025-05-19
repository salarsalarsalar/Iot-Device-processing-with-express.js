# Use official Node.js image
FROM node:18

# Create app directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app files
COPY . .

# Expose the app port
EXPOSE 3002

# Command to run your app
CMD ["npm", "start"]

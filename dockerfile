# Use an official Node.js runtime as a base image
FROM node:14-alpine3.15

# Install necessary build tools
# RUN apk --no-cache add --virtual .builds-deps build-base python3

# Set Python environment variable
# ENV PYTHON=python3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install necessary build tools and Python
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Create a symbolic link to python3 as python
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Copy package.json and yarn-lock.json to the working directory
COPY package.json ./
COPY yarn*.json ./

# Install application dependencies
RUN yarn

# Copy the local code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["yarn", "serve"]

# Use the official AWS Lambda Node.js 18.x runtime as the base image
FROM public.ecr.aws/lambda/nodejs:18

# Set the working directory to /var/task (the Lambda default working directory)
WORKDIR /var/task

# Copy the package.json files for dependency installation
COPY package*.json ./

# Copy the rest of the application files to the container
COPY . .

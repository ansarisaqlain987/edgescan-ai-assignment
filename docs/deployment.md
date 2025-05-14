# Infrastructure Docs

This guide walks you through deploying a Node.js app using Docker, running it on AWS ECS (Fargate), and exposing it via API Gateway.

## Steps

### 1. Dockerize the App

- Create a Dockerfile to containerize your Node.js app.

### 2. Push to ECR

- Build and push the Docker image to AWS Elastic Container Registry.

### 3. Create ECS Cluster & Task

- Set up an ECS Fargate cluster and define a task using the ECR image.

### 4. Run ECS Service

- Launch a Fargate service with public subnets and security group access.

### 5. Set Up VPC Link

- Create a VPC Link in API Gateway to connect to the ECS service.

### 6. Create HTTP API

- Set up an HTTP API in API Gateway with a route pointing to your ECS service.

### 7. Deploy API Gateway

- Deploy the API to get a public endpoint URL.

### 8. Test the Endpoint

- Open the URL in a browser or Postman to confirm your app is running.

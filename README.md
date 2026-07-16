Ledger Service – Docker Compose Setup
    This guide walks you through running the full stack (React frontend, Express + Prisma backend, Postgres database) using Docker Compose.

## Prerequisites
    Install Docker
    Install Docker Compose
    Clone this repository locally

## Run the Application
    docker-compose up --build
    docker-compose ps

## Access the app
    Frontend → http://localhost:3000 (localhost in Bing)
    Backend API → http://localhost:4000 (localhost in Bing)
    Postgres → localhost:5432

## Note
    docker-compose exec backend npx prisma migrate dev

## Frontend UI
    Here’s what the app looks like running locally:
        ![Ledger Frontend Login Screenshot](./docs/login-screen.png)
        ![Ledger Frontend Registration Screenshot](./docs/registration-screen.png)
        ![Ledger Frontend Create and List invoice Screenshot](./docs/Create-list-invoice.png)
        ![Ledger Frontend Ledger Screenshot](./docs/ledger-screen.png)

## Kubernetes cluster deployment
    Deployment Workflow in Cloud Shell
        1. Enable APIs:
            ```# Set your project ID
                gcloud config set project [YOUR_PROJECT_ID]```
            ```# Enable required APIs
                gcloud services enable container.googleapis.com compute.googleapis.com```

        2. Create clusters (if not using Config Connector YAML):
           ```gcloud container clusters create private-cluster \
                --zone us-central1-a \
                --enable-private-nodes \
                --master-ipv4-cidr 172.16.0.0/28 \
                --enable-ip-alias \
                --no-enable-master-authorized-networks```

        3. kubectl apply deployment-setup
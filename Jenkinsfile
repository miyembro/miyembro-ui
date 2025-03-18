pipeline {
    agent any

    environment {
        // You must set the following environment variables
        // ORGANIZATION_NAME
        // DOCKERHUB_USERNAME (it doesn't matter if you don't have one)

        SERVICE_NAME = "miyembro-ui"  // Replace with your service name
        IMAGE_TAG = "angular-miyembro:${BUILD_NUMBER}"
        REPOSITORY_TAG = "${DOCKERHUB_USERNAME}/angular-miyembro:${BUILD_NUMBER}"
        DOCKER_HUB_CREDS = credentials('miyembro-docker-token')  // Use the ID of your Docker Hub credentials
    }

    stages {
        stage('Preparation') {
            steps {
                cleanWs()  // Clean the workspace
                git credentialsId: 'GitHub', url: "https://github.com/${ORGANIZATION_NAME}/${SERVICE_NAME}", branch: 'main'  // Clone the repository
                
            }
        }

        

        stage('Build and Push Image') {
            steps {
                script {

                    echo "REPOSITORY_TAG: ${REPOSITORY_TAG}"

                    // Authenticate with Docker Hub using the credentials
                    sh "echo ${DOCKER_HUB_CREDS_PSW} | docker login -u ${DOCKER_HUB_CREDS_USR} --password-stdin"

                    // Build the Docker image
                    sh "docker image build -t ${IMAGE_TAG} ."

                    // Tag the Docker image for the repository
                    sh "docker tag angular-miyembro ${REPOSITORY_TAG}"

                    // Push the Docker image to Docker Hub
                    sh "docker push ${REPOSITORY_TAG}"

                    sh "docker pull ${REPOSITORY_TAG}"
                }
            }
        }

        stage('Deploy to Cluster') {
            steps {
                sh 'envsubst < ${WORKSPACE}/deploy.yaml | kubectl apply -f -'  // Deploy to Kubernetes
            }
        }
    }
}
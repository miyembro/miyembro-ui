pipeline {
    agent any

    environment {
        // You must set the following environment variables
        // ORGANIZATION_NAME
        // DOCKERHUB_USERNAME (it doesn't matter if you don't have one)

        SERVICE_NAME = "miyembro-ui"  // Replace with your service name
        IMAGE_TAG = "${SERVICE_NAME}-${ORGANIZATION_NAME}:${BUILD_NUMBER}"
        REPOSITORY_TAG = "${DOCKERHUB_USERNAME}/${SERVICE_NAME}-${ORGANIZATION_NAME}:${BUILD_NUMBER}"
        DOCKER_HUB_CREDS = credentials('ee75d658-a41b-48ee-b6fa-168da312c390')  // Use the ID of your Docker Hub credentials
    }

    stages {
        stage('Preparation') {
            steps {
                cleanWs()  // Clean the workspace
                git credentialsId: 'GitHub', url: "https://github.com/${ORGANIZATION_NAME}/${SERVICE_NAME}", branch: 'main'  // Clone the repository
                
            }
        }

        stage('Build') {
            steps {
                npx nx build miyembro --configuration=production

            }
        }

        stage('Build and Push Image') {
            steps {
                script {
                    // Authenticate with Docker Hub using the credentials
                    sh "echo ${DOCKER_HUB_CREDS_PSW} | docker login -u ${DOCKER_HUB_CREDS_USR} --password-stdin"

                    // Build the Docker image
                    sh "docker image build -t ${IMAGE_TAG} ."

                    // Tag the Docker image for the repository
                    sh "docker tag ${SERVICE_NAME}-${ORGANIZATION_NAME} ${REPOSITORY_TAG}"

                    // Push the Docker image to Docker Hub
                    sh "docker push ${REPOSITORY_TAG}"
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
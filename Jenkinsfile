pipeline {
    agent any 
    stages {
        stage("Clean Workspace") {
            steps {
                cleanWs()
            }
        }
        stage("Git: Clone Repository") {
            steps {
                git url: "https://github.com/cloudwithrk/mernstack-auth-app.git", branch: "main"
                echo "cloned"
            }
        }
        stage("File Scan") {
            steps {
                echo "file scan stage!"
            }
        }
        stage("Docker: Build Image") {
            steps {
                script{
                     dir('backend') {
                        sh "docker build -t nodebackend ."
                    }
                    dir('frontend') {
                        sh "docker build -t reactfrontend ."
                    }
                }
                 
            }
        }
        stage("DockerHub: Push Image") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "dockerHubCreds",
                    usernameVariable: "DOCKER_USERNAME",
                    passwordVariable: "DOCKER_PASSWORD"
                )]) {
                    sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                    sh "docker tag nodebackend:latest ${DOCKER_USERNAME}/nodebackend:latest"
                    sh "docker tag reactfrontend:latest ${DOCKER_USERNAME}/reactfrontend:latest"
                    sh "docker push ${DOCKER_USERNAME}/nodebackend:latest" 
                    sh "docker push ${DOCKER_USERNAME}/reactfrontend:latest"
                }
            }
        }
        stage("Docker Compose: Deploy") {
            steps {
                sh "docker compose down && docker compose up -d --build"
            }
        }
    }
}

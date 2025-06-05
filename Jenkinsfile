pipeline {
    agent any

    environment {
        BACKEND_HOST = "https://ct.mysliwczykrafal.webredirect.org/api"
    }

    stages {
        stage('Prepare Environment') {
            steps {
                script {
                    sh """
                    rm .env || true
                    echo "VITE_API_URL=${BACKEND_HOST}" >> .env
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t \"calorie-tracker-frontend\" .'
            }
        }

        stage('Stop and Remove Existing Container') {
            steps {
                sh 'docker stop calorie-tracker-frontend || true'
                sh 'docker rm calorie-tracker-frontend || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d --restart always --name \"calorie-tracker-frontend\" -p 8081:8081 \"calorie-tracker-frontend\"'
            }
        }
    }
}
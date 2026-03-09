pipeline {
    agent any

    environment {
        APP_NAME   = 'my-web-app'
        IMAGE_NAME = 'web-jenkins-app'
        CONTAINER_NAME = 'web-jenkins-container'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('Lint') {
            steps {
                echo '🔍 Linting HTML files...'
                sh '''
                    if command -v tidy > /dev/null 2>&1; then
                        tidy -errors -quiet -utf8 src/index.html || true
                    else
                        echo "tidy not installed — skipping lint."
                    fi
                '''
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh '''
                    test -f src/index.html && echo "✅ index.html found"
                    test -f src/style.css  && echo "✅ style.css found"
                    test -f src/app.js     && echo "✅ app.js found"
                    test -f Dockerfile     && echo "✅ Dockerfile found"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh '''
                    docker build -t ${IMAGE_NAME}:latest .
                    echo "✅ Docker image built!"
                '''
            }
        }

        stage('Deploy with Nginx') {
            steps {
                echo '🌐 Deploying container...'
                sh '''
                    # Stop and remove old container if it exists
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true

                    # Run the new container
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 80:80 \
                        --restart always \
                        ${IMAGE_NAME}:latest

                    echo "✅ App is live!"
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline complete! App is live at http://YOUR-EC2-IP'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs above.'
        }
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}

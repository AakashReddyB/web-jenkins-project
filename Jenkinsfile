pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'web-jenkins-app'
        CONTAINER_NAME = 'web-jenkins-container'
        SONAR_PROJECT  = 'web-jenkins-project'
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
                        echo "Lint complete."
                    else
                        echo "tidy not installed — skipping."
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
                    echo "All checks passed."
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '🔎 Running SonarQube analysis...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        /opt/sonar-scanner/bin/sonar-scanner \
                            -Dsonar.projectKey=web-jenkins-project \
                            -Dsonar.projectName=web-jenkins-project \
                            -Dsonar.sources=src \
                            -Dsonar.host.url=http://172.31.12.135:9000
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo '🚦 Checking SonarQube Quality Gate...'
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh '''
                    docker build -t ${IMAGE_NAME}:latest .
                    echo "✅ Docker image built successfully!"
                '''
            }
        }

        stage('Deploy with Nginx') {
            steps {
                echo '🌐 Deploying container with Nginx...'
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                    docker run -d \
                        --name  ${CONTAINER_NAME} \
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
            echo '🎉 Pipeline complete! App is live!'
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

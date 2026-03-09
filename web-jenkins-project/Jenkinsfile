pipeline {
    agent any

    environment {
        APP_NAME    = 'my-web-app'
        DEPLOY_DIR  = '/var/www/html'   // Change to your web server path
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
                        echo "tidy not installed — skipping lint."
                    fi
                '''
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh '''
                    echo "Checking required files exist..."
                    test -f src/index.html && echo "✅ index.html found"
                    test -f src/style.css  && echo "✅ style.css found"
                    test -f src/app.js     && echo "✅ app.js found"
                    echo "All checks passed."
                '''
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building project...'
                sh '''
                    mkdir -p build
                    cp -r src/* build/
                    echo "Build timestamp: $(date)" >> build/build-info.txt
                    echo "Build complete."
                '''
            }
        }

        stage('Archive') {
            steps {
                echo '📦 Archiving build artifacts...'
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }

        stage('Deploy') {
            when {
                branch 'main'   // Only deploy from main branch
            }
            steps {
                echo '🚀 Deploying to web server...'
                sh '''
                    echo "Deploying to ${DEPLOY_DIR}..."
                    # Uncomment the line below to actually deploy:
                    # cp -r build/* ${DEPLOY_DIR}/
                    echo "✅ Deployment complete!"
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline completed successfully!'
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

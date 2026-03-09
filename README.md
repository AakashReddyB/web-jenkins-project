# 🚀 Web Jenkins Project — Full CI/CD Pipeline

A production-style DevOps project with a fully automated CI/CD pipeline using **Jenkins**, **Docker**, **Nginx**, and **SonarQube** — deployed on **AWS EC2**.

> 🌐 **Live App:** http://65.2.35.75 &nbsp;|&nbsp; 🔧 **Jenkins:** http://65.2.35.75:8080 &nbsp;|&nbsp; 🔍 **SonarQube:** http://172.31.12.135:9000


## 🏗️ Architecture

```
Developer (Local Machine)
         │
         │  git push
         ▼
      GitHub Repo
    (AakashReddyB/web-jenkins-project)
         │
         │  Poll SCM (every 5 min)
         ▼
      Jenkins CI/CD  (AWS EC2 - t2.medium)
         │
         ├── 1. Checkout      → Pull latest code
         ├── 2. Lint          → Validate HTML
         ├── 3. Test          → Check all files exist
         ├── 4. SonarQube     → Code quality scan
         ├── 5. Quality Gate  → Pass/Fail threshold
         ├── 6. Docker Build  → Build Nginx image
         └── 7. Deploy        → Run container on port 80
                                        │
                                        ▼
                              🌐 Live Website (http://65.2.35.75)
```

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Jenkins** | CI/CD Automation | 2.541.2 |
| **Docker** | Containerization | 24.x |
| **Nginx** | Web Server (Alpine) | Latest |
| **SonarQube** | Code Quality Analysis | 9.9 LTS |
| **AWS EC2** | Cloud Hosting | t2.medium |
| **GitHub** | Source Control | — |
| **Ubuntu** | Operating System | 24.04 |

---

## 📁 Project Structure

```
web-jenkins-project/
├── 📄 Jenkinsfile          ← 7-stage pipeline definition
├── 🐳 Dockerfile           ← Nginx container build
├── 📄 README.md            ← You are here
└── 📁 src/
    ├── 🌐 index.html       ← Main web page
    ├── 🎨 style.css        ← Styling
    └── ⚙️  app.js          ← JavaScript
```

---

## 🔄 Step 1 — Push Code to GitHub

Setting up local Git and pushing the project to GitHub for the first time.

![Git Init and Push](images/01-git-init.png)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/AakashReddyB/web-jenkins-project.git
git push -u origin main
```

---

## ⚙️ Step 2 — Configure Jenkins Pipeline

Connecting Jenkins to GitHub via **Pipeline script from SCM**.

![Jenkins Configure](images/02-jenkins-configure.png)

**Settings:**
- Definition: `Pipeline script from SCM`
- SCM: `Git`
- Repository URL: `https://github.com/AakashReddyB/web-jenkins-project.git`
- Branch: `*/main`
- Script Path: `Jenkinsfile`

---

## 🔗 Step 3 — GitHub SCM Integration

Jenkins successfully connected to GitHub and pulling the Jenkinsfile automatically.

![SCM Config](images/03-jenkins-scm-config.png)

---

## ⏱️ Step 4 — Poll SCM Trigger

Jenkins checks GitHub for new commits every 5 minutes and auto-triggers builds.

![Poll SCM](images/04-poll-scm.png)

```
Cron: H/5 * * * *
```

---

## ✅ Step 5 — First Successful Pipeline Run

First full pipeline run — all stages passed in **11 seconds**!

![First Pipeline Success](images/05-first-pipeline-success.png)

```
Checkout SCM ✅ → Checkout ✅ → Lint ✅ → Test ✅ → Build ✅ → Archive ✅ → Deploy ✅
```

---

## 🐳 Step 6 — Docker + Nginx Deployment Pipeline

After adding Docker and Nginx — full 7-stage pipeline all green in **~25 seconds**!

![Docker Nginx Pipeline](images/07-docker-nginx-pipeline.png)

| Stage | Time | What it does |
|-------|------|--------------|
| Checkout SCM | 1s | Pull from GitHub |
| Checkout | 1s | Verify branch |
| Lint | 518ms | HTML syntax check |
| Test | 443ms | File existence check |
| Build Docker Image | 10s | Build Nginx container |
| Deploy with Nginx | 2s | Start container on port 80 |
| Post Actions | 341ms | Clean workspace |

---

## 🐳 Dockerfile

```dockerfile
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY src/ /usr/share/nginx/html/
EXPOSE 80
```

---

## 🔍 Step 7 — SonarQube Code Quality Integration

Integrated SonarQube for automated code quality, security, and bug analysis on every build.

### Installing SonarScanner on EC2

![SonarScanner Install](images/09-sonarscanner-install.png)

```bash
cd /opt
sudo wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
sudo unzip sonar-scanner-cli-5.0.1.3006-linux.zip
sudo mv sonar-scanner-5.0.1.3006-linux sonar-scanner
```

### SonarScanner Verified

![SonarScanner Working](images/10-sonarscanner-working.png)

```
INFO: SonarScanner 5.0.1.3006  ✅
INFO: Java 17.0.7               ✅
INFO: Linux AWS amd64           ✅
```

---

## 📄 Jenkinsfile (Full Pipeline)

```groovy
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
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
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
        success { echo '🎉 Pipeline complete! App is live!' }
        failure { echo '❌ Pipeline failed. Check logs.' }
        always  { cleanWs() }
    }
}
```

---

## ☁️ AWS Infrastructure

| Component | Value |
|-----------|-------|
| Instance Type | t2.medium |
| OS | Ubuntu 24.04 |
| Region | ap-south-1 (Mumbai) |
| Storage | 20 GiB gp3 |
| Public IP | 65.2.35.75 |
| Open Ports | 22 (SSH), 80 (HTTP), 8080 (Jenkins), 9000 (SonarQube) |

---

## 🚀 Run Locally

```bash
# Clone
git clone https://github.com/AakashReddyB/web-jenkins-project.git
cd web-jenkins-project

# Build & Run
docker build -t web-jenkins-app .
docker run -d --name web-app -p 80:80 web-jenkins-app

# Open → http://localhost
output:



<img width="1920" height="1080" alt="Screenshot (1497)" src="https://github.com/user-attachments/assets/c688722f-9602-4efe-8fb6-588331668847" />


## 👨‍💻 Author

**Beduduri Akash Reddy**
- 🐙 GitHub: [@AakashReddyB](https://github.com/AakashReddyB)

---

> ⭐ Star this repo if you found it helpful!

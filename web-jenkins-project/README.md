# My Web App — Jenkins Pipeline Project

A simple HTML/CSS/JS web project configured for a Jenkins CI/CD pipeline.

## Project Structure

```
web-jenkins-project/
├── Jenkinsfile          ← Jenkins pipeline definition
├── README.md
└── src/
    ├── index.html
    ├── style.css
    └── app.js
```

## Jenkins Pipeline Stages

| Stage    | What it does                                      |
|----------|---------------------------------------------------|
| Checkout | Pulls source code from SCM (Git)                  |
| Lint     | Checks HTML with `tidy` (skips if not installed)  |
| Test     | Verifies all required files exist                 |
| Build    | Copies files to `build/` folder                   |
| Archive  | Saves build artifacts in Jenkins                  |
| Deploy   | Deploys to web server *(main branch only)*        |

## How to Use in Jenkins

1. Push this project to a Git repo (GitHub, GitLab, Bitbucket, etc.)
2. In Jenkins → **New Item** → **Pipeline**
3. Under *Pipeline* section, set:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: your repo URL
   - **Script Path**: `Jenkinsfile`
4. Click **Save** → **Build Now**

## Deploy Configuration

Edit `Jenkinsfile` and update `DEPLOY_DIR` to your web server path:
```groovy
DEPLOY_DIR = '/var/www/html'   // Apache / Nginx default
```
Then uncomment the `cp` line in the Deploy stage.

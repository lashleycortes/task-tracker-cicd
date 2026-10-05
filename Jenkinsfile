```groovy
pipeline {

    agent any

    environment {

        SELENIUM_REMOTE_URL = 'http://selenium:4444/wd/hub'

        APP_URL = 'http://jenkins:4000'

        DOCKER_IMAGE = 'task-tracker:latest'

        DOCKER_CONTAINER = 'task-tracker'

    }

    stages {

        stage('Install') {

            steps {

                echo 'Installing dependencies...'

                sh 'npm ci'

            }
        }

        stage('Unit Test') {

            steps {

                echo 'Running 3 unit tests...'

                sh '''
                    export JEST_JUNIT_OUTPUT_NAME=unit-junit.xml

                    npx jest tests/unit \
                    --runInBand \
                    --reporters=default \
                    --reporters=jest-junit
                '''

            }
        }

        stage('Start Application') {

            steps {

                echo 'Starting application for UI testing...'

                sh '''
                    nohup npm start > app.log 2>&1 &
                    echo $! > app.pid
                '''

                sleep 5

                sh '''
                    curl --fail http://localhost:4000
                '''

            }
        }

        stage('UI Test') {

            steps {

                echo 'Running Selenium UI test...'

                sh '''
                    export SELENIUM_REMOTE_URL=${SELENIUM_REMOTE_URL}

                    export APP_URL=${APP_URL}

                    export JEST_JUNIT_OUTPUT_NAME=ui-junit.xml

                    npx jest tests/e2e \
                    --runInBand \
                    --reporters=default \
                    --reporters=jest-junit
                '''

            }
        }

        stage('Stop Test Application') {

            steps {

                echo 'Stopping temporary test application...'

                sh '''
                    if [ -f app.pid ]; then
                        kill $(cat app.pid) || true
                    fi
                '''

            }
        }

        stage('Build Image') {

            steps {

                echo 'Building Docker image...'

                sh '''
                    docker build \
                    -t ${DOCKER_IMAGE} .
                '''

            }
        }

        stage('Deploy') {

            steps {

                echo 'Deploying fresh Docker container...'

                sh '''
                    docker stop ${DOCKER_CONTAINER} || true

                    docker rm ${DOCKER_CONTAINER} || true

                    docker run -d \
                    --name ${DOCKER_CONTAINER} \
                    --network ci-network \
                    -p 4000:4000 \
                    ${DOCKER_IMAGE}
                '''

            }
        }

        stage('Verify Deployment') {

            steps {

                echo 'Verifying deployment...'

                sh '''
                    sleep 5

                    curl --fail http://localhost:4000
                '''

            }
        }

    }

    post {

        always {

            echo 'Publishing JUnit reports...'

            junit(
                testResults: '**/*-junit.xml',
                allowEmptyResults: false
            )

        }

        success {

            echo 'CI/CD Pipeline completed successfully.'

            echo 'Task Tracker deployed on port 4000.'

        }

        failure {

            echo 'CI/CD Pipeline failed.'

            echo 'Check the failed stage and console output.'

        }

    }

}
```

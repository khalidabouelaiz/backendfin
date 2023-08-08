pipeline {
    agent any
    
    environment {
        NODE_VERSION = '1.0.0'
        ANGULAR_VERSION = '0.0.0'
        REMOTE_HOST = 'ec2-13-38-216-193.eu-west-3.compute.amazonaws.com'
        REMOTE_USER = 'ec2-user'
        PRIVATE_KEY = '/tmp/id_rsa'
        DOCKERHUB_CREDENTIALS = credentials('khalidabouelaiz-dockerhub')
    }
    
    stages {
        stage('Checkout backend') {
            steps {
                checkout([$class: 'GitSCM', 
                          branches: [[name: '*/develop']], 
                          doGenerateSubmoduleConfigurations: false, 
                          extensions: [], 
                          submoduleCfg: [], 
                          userRemoteConfigs: [[credentialsId: '9b595c7e-b5ac-4c9a-8c03-b0752e30bbfc', url: 'http://13.39.81.204/khalidaboue/thetiptop-back.git']]
                ])
            }
        }
        
        stage('Build backend') {
            steps {
                sh "sudo mongod --version"
                sh "sudo lsof -i -P -n | grep LISTEN"
                
                sh '''sudo pkill -f "node" '''
                sh "sudo npm install --force" 
                sh "sudo npm install @sideway/formula"
                sh "sudo npm install @sideway/address"
                sh "sudo npm install @sideway/pinpoint"
                sh "sudo npm install joi"
                
                sh "sudo npm cache clean --force"
                sh "sudo npm install -g @angular/cli"
                sh "sudo npm install --production"
                sh "sudo npm install pm2 -g"
                sh "pm2 start index.js -f"
            }
        }
        
        stage('Remove backend container') {
            steps {
                sh 'sudo docker rm -f khalidabouelaiz/backend:latest'
            }
        }
        
        stage('Build backend image') {
            steps {
                script {
                    sh 'sudo docker build -t khalidabouelaiz/backend:latest .'
                }
            }
        }
        
        stage('Login to DockerHub backend') {
            steps {
                sh "echo \$DOCKERHUB_CREDENTIALS_PSW | sudo docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin"
            }
        }
        
        stage('Push backend image') {
            steps {
                sh 'sudo docker push khalidabouelaiz/backend:latest'
            }
        }
        
        stage('Checkout frontend') {
            steps {
                checkout([$class: 'GitSCM', 
                          branches: [[name: '*/develop']], 
                          doGenerateSubmoduleConfigurations: false, 
                          extensions: [], 
                          submoduleCfg: [], 
                          userRemoteConfigs: [[credentialsId: '9b595c7e-b5ac-4c9a-8c03-b0752e30bbfc', url: 'http://13.39.81.204/khalidaboue/thetiptop-front.git']]
                ])
            }
        }
        
        stage('Build frontend') {
            steps {
                sh "sudo rm -rf .angular"
                sh "sudo npm install --force"
                sh "npm cache clean --force"
                sh "sudo npm uninstall -g @angular/cli"
                sh "sudo npm install -g @angular/cli --force"
                sh "sudo ng build --base-href"
            }
        }
        
        stage('Remove frontend container') {
            steps {
                sh 'sudo docker rm -f khalidabouelaiz/frontend:latest'
            }
        }
        
        stage('Build frontend image') {
            steps {
                script {
                    sh 'sudo docker build -t khalidabouelaiz/frontend:latest .'
                }
            }
        }
        
        stage('Login to DockerHub frontend') {
            steps {
                sh "echo \$DOCKERHUB_CREDENTIALS_PSW | sudo docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin"
            }
        }
        
        stage('Push frontend image') {
            steps {
                sh 'sudo docker push khalidabouelaiz/frontend:latest'
            }
        } 
        
        stage('Deploy') {
            steps {
                sh 'ssh-keyscan $REMOTE_HOST >> ~/.ssh/known_hosts'

                sshagent(credentials: ['ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDSlyTTzAFeiY31xYuDEFJ0xRUMP9tSskeI3S8qz3Gn/ZMgxzcyCWnCYfNxkOxaw2+PJfhpnz2pHYtxf4J2jmrzIt90rV2MPxjywcRIZ/wn2sr9q98tfcVqLZ3g/Nvp5jL8SBiU0H2hhVcdkMEM2l+buzwpcbokJVVFWJKlZPh71ePfBT74tMf+mVbv3entx2UHRUZ4Bkk7l7cugNXqUgzDrchP7XIwyNHPHshr+djH4c1iMJLIcnbOc3I+VxvRhL4bcMozQyyB0FgQHtbFjI9/LQdAJflTAfN9Pr9hK5yFeZGlJB5NTR5is8AScHsSWjTfE8/CEaova0y1bV93kMvF']) {
                    // Deploy files to remote host
                    sh '''
                    sudo rm -r /var/www/html/dist;
                    sudo mv ./dist /var/www/html/
                    '''
                }
            }
        }
        
        stage('Generate link') {
            steps {
                sh 'echo "hello"'
            }
        }
    }
}

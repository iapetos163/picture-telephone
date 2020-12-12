pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        dir('backend') {
          sh 'ln -sf /var/terraform/draw cdktf.out'
          sh 'yarn'
          sh 'yarn build'
        }
      }
    }
    stage('Deploy') {
      steps {
        dir('backend') {
          withAWS(credentials: 'cdk-pipeline-aws-user') {
            sh 'yarn deploy'
          }
        }
      }
    }
  }
}
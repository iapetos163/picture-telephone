pipeline {
  agent any

  stages {
    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'ln -sf /var/terraform/draw cdktf.out'
          sh 'yarn'
          sh 'yarn build'
        }
      }
    }
    stage('Build Frontend') {
      steps {
        dir('frontend') {
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
        dir('frontend') {
          withAWS(credentials: 'web-pipeline-aws-user') {
            s3Upload(file:'dist', bucket:'brett.house', path: "draw/")
            s3Upload(file:'dist/index.html', bucket:'brett.house', path: "draw")
          }
        }
      }
    }
  }
}
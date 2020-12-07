pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('TF Plan') {
      steps {
        dir('backend') {
          sh 'ln -sf /var/terraform/draw cdktf.out'
          sh 'yarn'
          sh 'yarn run cdktf get'
          sh 'yarn run cdktf synth'

          dir('cdktf.out') {
            sh 'terraform init'
            sh 'terraform plan -out myplan'
          }
        }
      }
    }
    stage('Approval') {
      steps {
        script {
          def userInput = input(id: 'confirm', message: 'Apply Terraform?', parameters: [ [$class: 'BooleanParameterDefinition', defaultValue: false, description: 'Apply terraform', name: 'confirm'] ])
        }
      }
    }
    stage('TF Apply') {
      steps {
        dir('cdktf.out') {
          sh 'terraform apply -input=false myplan'
        }
      }
    }
  }
}
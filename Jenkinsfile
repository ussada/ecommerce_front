node {
    stage('Source checkout') {
        git credentialsId: 'ussada.a', url: 'https://github.com/ussada/ecommerce_front.git'
    }

    stage('Load deploy environment') {
        withCredentials([file(credentialsId: 'front_deploy_env', variable: 'FRONT_ENV')]) {
           sh "cp \$FRONT_ENV .env"
        }
    }

    stage('Build image') {
        sh 'docker build -t ecommerce_front --rm .'
    }
    
    stage('Create container') {
        sh 'docker stop ecommerce_front || true'
        sh 'docker rm ecommerce_front || true'
        sh 'docker run --name ecommerce_front -p 4001:80 --network=ecommerce_db -d ecommerce_front'
    }
    
    stage('Clean out') {
        sh 'docker image prune -f'
    }
}
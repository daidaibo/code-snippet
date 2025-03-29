pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        GIT_REPO = 'git@github.com:wawotv/frontend-www.wawotv.com.git'
        CRED_ID = '3824d1bf-31cd-4744-a3e7-ff8c0bf02a24'
    }

    parameters {
        gitParameter(
            branch: '',
            branchFilter: 'origin/(.*)',
            defaultValue: 'main',
            listSize: '',
            name: 'BRANCH_NAME',
            quickFilterEnabled: false,
            selectedValue: 'NONE',
            sortMode: 'NONE',
            tagFilter: '*',
            type: 'GitParameterDefinition'
        )
    }

    triggers {
        // http://43.199.125.220:7788/github-webhook/
        githubPush()

        // http://43.199.125.220:7788/generic-webhook-trigger/invoke?token=jenkins
        GenericTrigger(
            genericVariables: [
                [key: 'REF', value: '$.ref'],
                [key: 'GIT_AUTHOR', value: '$.head_commit.author.name'],
            ],
            token: 'jenkins',
            causeString: 'Triggered by GitHub Webhook',
            printContributedVariables: true,
            printPostContent: !true,
            silentResponse: false,
            // regexpFilterText: '$REF',
            // regexpFilterExpression: '^refs/heads/(main|dev)$'
        )
    }

    stages {
        // stage('Print Environment Variables') {
        //     steps {
        //         script {
        //             params.each { param ->
        //                 echo "${param.key} = ${param.value}"
        //             }
        //         }
        //         sh 'printenv'
        //     }
        // }

        stage('获取当前工作区分支') {
            steps {
                script {
                    try {
                        def branchName = sh(returnStdout: true, script: 'git name-rev --name-only HEAD').trim()
                        env.currWorkBranch = branchName.replace('remotes/origin/', '')
                        echo "当前工作区分支: ${branchName}, env.currWorkBranch: ${env.currWorkBranch}"
                    } catch (Exception e) {
                        echo "工作区异常: ${e.message}"
                    }
                }
            }
        }

        stage('判断是否由 GitHubPush 触发') {
            steps {
                script {
                    if (currentBuild.getBuildCauses().toString().contains('GitHubPushCause')) {
                        env.isWebhookTrigger = true
                        env.GIT_BRANCH = env.currWorkBranch
                    }
                }
            }
        }

        stage('获取 GenericTrigger 触发的分支') {
            when {
                environment name: 'isWebhookTrigger', value: null
            }
            steps {
                script {
                    env.isWebhookTrigger = env.REF != null
                    // echo "env.isWebhookTrigger getClass: ${env.isWebhookTrigger.getClass()}"
                    // echo "env.isWebhookTrigger toString: ${env.isWebhookTrigger.toString()}"
                    if (env.isWebhookTrigger.toBoolean()) {
                        env.GIT_BRANCH = env.REF.replace('refs/heads/', '')
                        echo "GenericTrigger 触发的分支: ${env.REF}, env.GIT_BRANCH: ${env.GIT_BRANCH}"
                    }
                }
            }
        }

        stage('Abort') {
            when {
                expression {
                    return env.isWebhookTrigger.toBoolean() && env.GIT_BRANCH != env.currWorkBranch
                }
            }
            steps {
                script {
                    env.deleteCurrentBuild = true
                }
                error 'Webhook 触发的分支 和 当前工作区分支 不同'
            }
        }

        stage('Checkout') {
            steps {
                script {
                    def branch = env.isWebhookTrigger.toBoolean() ? env.GIT_BRANCH : params.BRANCH_NAME

                    // env.PREVIOUS_BRANCH = currentBuild.description

                    echo "params.BRANCH_NAME: ${params.BRANCH_NAME}"
                    echo "env.BRANCH_NAME: ${env.BRANCH_NAME}"
                    echo "env.GIT_BRANCH: ${env.GIT_BRANCH}"

                    env.BRANCH_NAME = branch
                    env.isProd = branch == 'main'

                    try {
                        def scmVars = checkout([
                            $class: 'GitSCM',
                            branches: [[name: branch]],
                            userRemoteConfigs: [[url: env.GIT_REPO, credentialsId: env.CRED_ID]]
                        ])
                    } catch (Exception e) {
                        echo "Failed to checkout: ${e.message}"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME}.."
                script {
                    try {
                        sh '''
                            NODE_PATH="/home/ubuntu/.nvm/versions/node/v18.20.2/bin"
                            YARN_PATH="/home/linuxbrew/.linuxbrew/bin"
                            export PATH="$NODE_PATH:$YARN_PATH:$PATH"

                            pnpm install
                            npm run build

                            cp ecosystem.config.cjs .next/standalone
                            cp -r public .next/standalone
                            mv .next/static .next/standalone

                            cd .next/
                            tar -zcf www.wawotv.com.tar.gz standalone
                            cd -
                            mv -f .next/www.wawotv.com.tar.gz www.wawotv.com.tar.gz
                        '''
                    } catch (Exception e) {
                        error("Build failed: ${e.message}")
                    }
                }
                /* pm2 nextjs

                    node .next/standalone/server.js

                    pm2 start npm --name "wawotv" -- start
                    pm2 start "npm run dev" --name wawotv

                    npx pm2 start ecosystem.config.cjs

                    开机自启
                        pm2 startup

                        pm2 save❌
                        删除 PIDFile=/home/ubuntu/.pm2/pm2.pid

                        ls /etc/systemd/system/pm2-*.service

                        sudo vim /etc/systemd/system/pm2-ubuntu.service
                        ExecStart=pm2 restart /www/wwwroot/www.dreamemovie.com/standalone/ecosystem.config.cjs --no-daemon

                        sudo systemctl daemon-reload

                        sudo systemctl enable pm2-ubuntu
                        systemctl status pm2-ubuntu
                        sudo systemctl restart pm2-ubuntu.service

                    Nginx
                        server {
                            listen 443 ssl http2 ;
                            listen [::]:80;
                            
                            listen [::]:443 ssl http2 ;

                            server_name wawotv.com;
                            return 308 https://www.wawotv.com$request_uri;
                        }
                        location /_next/ {
                            alias /www/wwwroot/www.dreamemovie.com/standalone/;
                        }
                */
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying branch: ${env.BRANCH_NAME}.."
                script {
                    if (env.isProd.toBoolean()) {
                        sshPublisher(publishers: [sshPublisherDesc(
                            configName: 'wawovideo',
                            transfers: [
                                sshTransfer(
                                    cleanRemote: false,
                                    excludes: '',
                                    execCommand: '''
                                        cd /home/ubuntu
                                        ls
                                    ''',
                                    execTimeout: 120000,
                                    flatten: false,
                                    makeEmptyDirs: false,
                                    noDefaultExcludes: false,
                                    patternSeparator: '[, ]+',
                                    remoteDirectory: '/',
                                    remoteDirectorySDF: false,
                                    removePrefix: '',
                                    sourceFiles: 'www.wawotv.com.tar.gz'
                                )
                            ],
                            usePromotionTimestamp: false,
                            useWorkspaceInPromotion: false,
                            verbose: false
                        )])
                    } else {
                        sh '''
                            sudo mv www.wawotv.com.tar.gz /www/wwwroot/www.dreamemovie.com
                            cd /www/wwwroot/www.dreamemovie.com
                            sudo tar -zxf www.wawotv.com.tar.gz
                            sudo rm -rf www.wawotv.com.tar.gz

                            cd standalone

                            sudo -u ubuntu pm2 restart ecosystem.config.cjs
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            // echo "env.JOB_NAME: ${env.JOB_NAME}"
            // echo "env.BUILD_NUMBER: ${env.BUILD_DISPLAY_NAME}"
            // echo "currentBuild.result: ${currentBuild.result}"
            // echo "currentBuild.duration: ${String.format("%.2f", currentBuild.duration / 1000)} s."
            script {
                if (env.isProd.toBoolean() || currentBuild.result != 'SUCCESS') {
                    def message = """
                        {
                            "msg_type": "text",
                            "content": {
                                "text": "Jenkins Job ${env.JOB_NAME} ${env.BUILD_DISPLAY_NAME} completed with status ${currentBuild.result}. Time consuming: ${String.format("%.2f", currentBuild.duration / 1000)}s."
                            }
                        }
                    """
                    def response = httpRequest(
                        url: 'https://open.feishu.cn/open-apis/bot/v2/hook/b5491d48-84b9-4325-bbc2-213ee75e46aa',
                        httpMode: 'POST',
                        acceptType: 'APPLICATION_JSON',
                        contentType: 'APPLICATION_JSON',
                        requestBody: message
                    )
                    echo "httpRequest: ${response.status} ${response.content}"
                }
            }
        }
        success {
            echo "Build and deployment succeeded!"
        }
        failure {
            script {
                if (env.deleteCurrentBuild != null) {
                    // 获取当前构建号
                    def currentBuildNumber = currentBuild.number
                    echo "Current build number: ${currentBuildNumber}"

                    // 删除当前构建记录
                    currentBuild.rawBuild.delete()
                    echo "Current build record deleted."

                    // 重置下一个构建编号
                    def job = currentBuild.rawBuild.getParent()
                    job.updateNextBuildNumber(currentBuildNumber)
                    echo "Next build number reset to: ${currentBuildNumber}"
                }
            }
            echo "Build or deployment failed!"
        }
    }
}

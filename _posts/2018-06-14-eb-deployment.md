---
layout: post
title: Deploying apis using Elastic Beanstalk
subtitle: Patterns for AWS Elastic Beanstalk deployment and code organisation
date: '2018-06-14T14:40:00.164791000+05:30'
author: Shubham Chaudhary
permalink: deployment/aws/eb
comments: true
published: false
tags:
  - zomato
  - deployment
  - ml
  - aws
  - elastic beanstalk
  - beanstalk
---

# Packaging

Given a simple (or complex application) like this

```python
# file: my_app/flask_api.py

from flask import Flask
from flask import request
from flask_restful import Api
from flask_restful import reqparse
from flask_restful import Resource


# App configurations
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
logs.setup_flask_app_logging(flask_app=app)
api = Api(app)
logger = logging.getLogger(__name__)

ROOT_PATH = '/api'
PREFIX = '{root_path}/v1'.format(root_path=ROOT_PATH)


def parse_arg_from_requests(arg, **kwargs):
    parse = reqparse.RequestParser()
    parse.add_argument(arg, **kwargs)
    args = parse.parse_args()
    return args[arg]


def skip_health_check(function_to_protect):
    import functools

    @functools.wraps(function_to_protect)
    def wrapper(*args, **kwargs):
        if PREFIX + '/health' == request.path:
            pass
        else:
            return function_to_protect(*args, **kwargs)

    return wrapper


@app.before_request
@skip_health_check
@auth.is_allowed()
def before_each():
    pass


class HealthCheck(Resource):
    """ A health check used by ELBs """

    def get(self):
        return {'status': 'success', 'message': 'This only tells that web server is up.'}


class Restaurants(Resource):
    """ Get data for row """

    def get(self):
        user_id = parse_arg_from_requests('user_id', type=str)
        recommender = Recommender()
        res_ids = recommender.restaurants(user_id=user_id)
        return {
            'res_ids': res_ids
        }
        

def __setup():
    logs.setup_logging()
    load_model()
    warm_model_cache()


# External endpoints
api.add_resource(HealthCheck, PREFIX + '/health')
api.add_resource(Restaurants, PREFIX + '/recommend/restaurants')

__setup()

if __name__ == '__main__':
    # ModelProvider.warm_model_cache()
    app.run(host='0.0.0.0', port=8000, debug=True)
```

To run this app, you'd need a server. You could use gunicorn as follows:

```python
# file: my_app/runners/gunicorn_flask_api.py

#!/usr/bin/env python
# -*- coding: utf-8 -*-
import multiprocessing

bind = '0.0.0.0:8000'
loglevel = 'debug'
timeout = 30
daemon = False
reload = False
# As a rule-of-thumb set the --workers (NUM_WORKERS) according to the following formula: 2 * CPUs + 1.
# The idea being, that at any given time half of your workers will be busy doing I/O.
# For a single CPU machine it would give you 3.
workers = int((multiprocessing.cpu_count() / 2.0) + 1)
threads = 1
errorlog = '-'
accesslog = '-'
# errorlog = os.path.expanduser('~/logs/gunicorn_error.log')
# accesslog = os.path.expanduser('~/logs/gunicorn_access.log')

if __name__ == '__main__':
    import sys
    sys.exit("""FATAL ERROR: This is configuration file for gunicorn - `gunicorn -c gunicorn_cfg.py`""")
```

Then you could run this with:

```bash
# file: my_app/runners/gunicorn_flask_api.sh
#!/usr/bin/env sh
set -eux

gunicorn my_app.flask_api:app -c my_app/runners/gunicorn_flask_api.py
```

## Creating Docker Image

To create docker image you need following things:

```text
# file: my_app/requirements.txt

gunicorn==
flask==

```

and a `Dockerfile`:

```dockerfile
# file: my_app/Dockerfile
FROM continuumio/miniconda3:4.3.14

MAINTAINER Zomato <ml@zomato.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 8000
RUN mkdir -p ~/logs

COPY requirements.txt /tmp/my-app-requirements.txt
RUN set -eux \
    && pip install --no-cache-dir -r /tmp/my-app-requirements.txt \
    && rm -fv /tmp/my-app-requirements.txt \
    && conda clean --all -y

CMD ["bash", "my_app/runners/gunicorn_flask_api.sh"]
```

## Pushing Docker Image

```groovy
// file: Jenkinsfile
#!groovy

//noinspection GroovyAssignabilityCheck,GroovyUntypedAccess
pipeline {
  agent any
  triggers { pollSCM('* * * * *') }
  options {
    //  disableConcurrentBuilds()  // Because we need to have a manually configured setting.php in workspace
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  environment {
    git_commit_message = ''
    git_commit_diff = ''
    git_commit_author = ''
    git_commit_author_name = ''
    git_commit_author_email = ''
  }

  stages {
    // Stage, is to tell the Jenkins that this is the new process/step that needs to be executed
    stage('Checkout') {
      steps {
        notifyBuild('STARTED')
        // Pull the code from the repo
        checkout scm
      }
    }

    // Unit Tests
    stage('Unit Tests') {
      agent {
        dockerfile {
          filename 'jenkins.Dockerfile'
        }
      }
      steps {
        sh "echo 'Run Unit Tests'"
        sh "ln -sf dummy/config.ini ./"
        sh "make clean || true"
        sh "make test"
        sh "make check_coverage"
        sh "make coverage # Generate html report"
        sh "rm -fv config.ini"
        // publish html
        publishHTML target: [
          allowMissing: false,
          alwaysLinkToLastBuild: false,
          keepAll: true,
          reportDir: 'htmlcov',
          reportFiles: 'index.html',
          reportName: "${currentBuild.fullDisplayName} Report"
        ]
      }
    }

    // Static Code Analysis
    stage('Static Code Analysis') {
      agent {
        dockerfile {
          filename 'jenkins.Dockerfile'
        }
      }
      steps {
        sh "make describe || true"
        sh "piprot requirements-dev.txt --outdated || true"
      }
    }
    stage('Build docker images') {
      agent {
        label 'production'
      }
      when {
        branch 'master'
        //environment name: 'DEPLOY_TO', value: 'production'
      }
      environment {
        PROD_CONFIG = credentials('prod-config-file')
        AWS_ACCESS_KEY_ID = credentials('s3-data-aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('s3-data-aws-secret-access-key')
      }
      steps {
        sh "echo 'Building production images'"
        sh 'rm -fv config.ini'
        sh 'cp -p ${PROD_CONFIG} config.ini'
        sh 'make build_docker'
        sh 'make login_ecr_jenkins'
        sh 'export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} && ' +
          'export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} && ' +
          'make push_docker'
      }
    }
  }
  post {
    changed {
      sendMail("Status changed to ${currentBuild.currentResult}")
      sendMailExt("Status changed to ${currentBuild.currentResult}")
      notifyBuild("Status changed to ${currentBuild.currentResult}")
    }
  }
}

def sendMail(String buildStatus) {
  to_addr = getMailRecepients()
  mail(
    subject: "${buildStatus}: Job ${env.JOB_NAME} #${env.BUILD_NUMBER}",
    to: "${to_addr}",
    body: """Job '${currentBuild.fullDisplayName} [${env.BUILD_NUMBER}]':
          Check console output at ${env.BUILD_URL} ${env.JOB_NAME} [${env.BUILD_NUMBER}]"""
  )
}
```

# EB Deployment

```python
# file: scripts/eb_zip_generator.py

#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import zipfile

import click

REGISTRY = '931301707529.dkr.ecr.ap-southeast-1.amazonaws.com'


def version_tag():
    return os.popen('git describe --always --tags').read().strip()


def docker_image_name(repo, tag):
    return '{registry}/{repo}:{version_tag}'.format(registry=REGISTRY, repo=repo, version_tag=tag)


def json_str(repo, port, tag):
    import json
    return json.dumps(
        {
            'AWSEBDockerrunVersion': '1',
            'Image': {
                'Name': docker_image_name(repo, tag),
                'Update': 'true'
            },
            'Ports': [{
                'ContainerPort': '{}'.format(port)
            }]
        },
        indent=2,
        sort_keys=True
    )


@click.command()
@click.option('--model-type', '-m', default='fm', help='Type of Model: [fm, xgb]')
@click.option('--tag', '-t', default='', help='Type of Model: [fm, xgb]')
def main(model_type, tag):
    repo = 'ml/core-recs-api-prod'
    port = 8000

    if not tag:
        print('Creating tag from current git state.')
        tag = version_tag()

    docker_run_dump = json_str(repo, port, tag)
    docker_run_dump += os.linesep
    docker_run_filename = 'Dockerrun.aws.json'
    with open(docker_run_filename, 'w') as f:
        f.write(docker_run_dump)

    zipfile_name = '{base} {model_type} {tag}.zip'.format(base=docker_run_filename, model_type=model_type, tag=tag)
    with zipfile.ZipFile(zipfile_name, 'w') as zipf:
        zipf.write(docker_run_filename)
    print('Saved zipfile {}'.format(zipfile_name))
    return 0


if __name__ == '__main__':
    import sys

    sys.exit(main())
```

and use following script to deploy

```bash
# file: deploy_to_eb.sh
#!/usr/bin/env bash
set -eux

EB_BUCKET="elasticbeanstalk-ap-southeast-1-931301707529"
APPLICATION_NAME="core-recs-api-prod"
model_type="${1}"
environment_name=z-ml-core-rec-api-env

description="$(git describe --always --tags 2>/dev/null)"
application_version_label="${model_type} ${description}"

echo "Creating EB source zip for model: ${model_type}"
docker run -i -v `pwd`:/usr/src/app nitro-recsys bash -c \
"PYTHONPATH=. python nitro/core_rec_api/scripts/eb_zip_generator.py --model-type '${model_type}' --tag '${description}'"
zip_file_name="Dockerrun.aws.json ${application_version_label}.zip"
s3_zip_file_path="recs/eb/sources/${zip_file_name}"
zip_s3_uri="s3://${EB_BUCKET}/${s3_zip_file_path}"

echo "Copying EB source zip at: ${zip_s3_uri}"
aws s3 cp "${zip_file_name}" "${zip_s3_uri}"

echo "Creating version '${application_version_label}' in ${APPLICATION_NAME}"
aws elasticbeanstalk create-application-version \
    --application-name "${APPLICATION_NAME}" \
    --version-label "${application_version_label}" \
    --source-bundle S3Bucket="${EB_BUCKET}",S3Key="${s3_zip_file_path}" \
    --process

echo "Updating version to ${application_version_label}"
aws elasticbeanstalk update-environment \
    --application-name "${APPLICATION_NAME}" \
    --environment-name "${environment_name}" \
    --version-label "${application_version_label}"
```

and use following jenkins file to automate this:

```groovy
// file: deploy.Jenkinsfile

stages {
  stage('Deploy to Elastic Beanstalk') {
    agent {
      label 'production'
    }
    //when {
    //  branch 'master'
    //  //environment name: 'DEPLOY_TO', value: 'production'
    //}
    environment {
      AWS_ACCESS_KEY_ID = credentials('ecr-aws-access-key-id')
      AWS_SECRET_ACCESS_KEY = credentials('ecr-aws-secret-access-key')
    }
    steps {
      notifyBuild('STARTED')
      sh "echo 'Building production images'"
      sh "make build_docker"  // Needed to run eb generator script
      sh 'export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} && ' +
        'export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} && ' +
        'export AWS_DEFAULT_REGION=ap-southeast-1 && ' +
        "bash ./deploy_to_eb.sh"
    }
  }
}
```

# Automation with Jenkins

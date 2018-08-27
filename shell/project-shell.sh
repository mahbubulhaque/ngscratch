ENERGIEQ_PROJECT_NAME="energieq"
ENERGIEQ_PROJECT_NAME_UNDERSCORE="energieq"
ENERGIEQ_PROJECT_NAME_CAMEL_CASE="energieQ"

energieqFrontEndInstall() {
  if [ -z "$1" ]; then
    echo 'null value not allowed as first parameter! You must pass the required parameter(s).'
    return $1
  fi;
  eval ${1}_fe_dir
  npm install
}

energieqFrontEndUpdate() {
  if [ -z "$1" ]; then
    echo 'null value not allowed as first parameter! You must pass the required parameter(s).'
    return $1
  fi;
  energieqFrontEndInstall $1
  npm update
  npm update --save-dev
}

energieqFrontEndRun() {
  if [ -z "$1" ]; then
    echo 'null value not allowed as first parameter! You must pass the required parameter(s).'
    return $1
  fi;
  eval ${1}_fe_dir
  energieqFrontEndInstall $1
  npm run start
}

energieqFrontEndBranchChange() {
  if [ -z "$1" ]; then
    echo 'null value not allowed as first parameter! You must pass the required parameter(s).'
    return $1
  fi;
  if [ -z "$2" ]; then
    echo 'null value not allowed as second parameter! You must pass the required parameter(s).'
    return $2
  fi;
  eval ${1}_fe_dir
  eval git_f
  gitCheckout $2
  gitResetHard
  bashRefresh
  energieqFrontEndRun $1
}

energieqGitRebase() {
  if [ -z "$1" ]; then
    echo 'null value not allowed as first parameter! You must pass the required parameter(s).'
    return $1
  fi;
  if [ -z "$2" ]; then
    echo 'null value not allowed as second parameter! You must pass the required parameter(s).'
    return $2
  fi;
  eval ${1}_fe_dir
  eval "git_r $2"
  npm install
}

energieqDockerComposeBuild() {
  if [ -z "$1" ]; then
    echo 'null value not allowed as first parameter! You must pass the required parameter(s).'
    return $1
  fi;
  eval ${1}_fe_dir
  docker_compose_build
}

energieqDockerComposeUp() {
  if [ -z "$1" ]; then
    echo 'null value not allowed as first parameter! You must pass the required parameter(s).'
    return $1
  fi;
  eval ${1}_fe_dir
  docker_compose_up
}

energieqDockerComposeBuildUp() {
  if [ -z "$1" ]; then
    echo 'null value not allowed as first parameter! You must pass the required parameter(s).'
    return $1
  fi;
  eval ${1}_fe_dir
  eval ${1}_fe_docker_compose_build
  eval ${1}_fe_docker_compose_up
}

alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_ansible_staging="cd $SYSTEM_ROOT_GIT_REPO_FOLDER/conf-mgnt/ansible/ && ansible-playbook -i hosts playbooks/energieq_front_end_staging.yml -vvv"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_ansible_production="cd $SYSTEM_ROOT_GIT_REPO_FOLDER/conf-mgnt/ansible/ && ansible-playbook -i hosts playbooks/energieq_front_end_production.yml -vvv"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_bc="energieqFrontEndBranchChange $ENERGIEQ_PROJECT_NAME_UNDERSCORE "
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_bcd="energieqFrontEndBranchChange $ENERGIEQ_PROJECT_NAME_UNDERSCORE develop"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_dir="cd $SYSTEM_ROOT_GIT_REPO_FOLDER/energieq-1369-frontend"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_docker_compose_build="energieqDockerComposeBuild $ENERGIEQ_PROJECT_NAME_UNDERSCORE"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_docker_compose_up="energieqDockerComposeUp $ENERGIEQ_PROJECT_NAME_UNDERSCORE"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_docker_compose_up_build="energieqDockerComposeBuildUp $ENERGIEQ_PROJECT_NAME_UNDERSCORE"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_git_r="energieqGitRebase $ENERGIEQ_PROJECT_NAME_UNDERSCORE "
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_git_rd="energieqGitRebase $ENERGIEQ_PROJECT_NAME_UNDERSCORE develop"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_start="energieqFrontEndRun $ENERGIEQ_PROJECT_NAME_UNDERSCORE"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_fe_update="energieqFrontEndUpdate $ENERGIEQ_PROJECT_NAME_UNDERSCORE"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_staging_server="ssh-keyscan -H '18.184.32.140' >> ~/.ssh/known_hosts && chmod 600 ~/.ssh/energieq_front_end_staging.pem && ssh -i ~/.ssh/energieq_front_end_staging.pem ubuntu@18.184.32.140"
alias ${ENERGIEQ_PROJECT_NAME_UNDERSCORE}_production_server="ssh-keyscan -H '35.157.157.32' >> ~/.ssh/known_hosts && chmod 600 ~/.ssh/energieq_front_end_production.pem && ssh -i ~/.ssh/energieq_front_end_production.pem ubuntu@35.157.157.32"

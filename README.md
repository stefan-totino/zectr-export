# zectr-export

**WIP**

## *local env*

download all of the dependencies (seen in the last section) and follow their installation instructions. 

create a clone of this repository using the git tools and techniques of your choice.

if you didn't already do so while installing the AWS SAM CLI, run the following command: 

`aws configure` 

[aws configure cmd --help](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config)

## *cloud env*

one of the following is a possibility given the developer's preferences:

1. pre-configured AWSenv.
2. roll-your-own AWS env
3. run completely offline

## [i] *local startup*

you may have to run the following command **one time only**:

`serverless plugin install -n serverless-offline`

`serverless offline start`

## [ii] *remote startup*

`serverless deploy`

## [iii] *runtime commands*

TODO

## *dependencies*

https://www.npmjs.com/package/serverless

https://github.com/gitbrent/PptxGenJS

https://www.npmjs.com/package/xlsx

https://aws.amazon.com/cli/

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

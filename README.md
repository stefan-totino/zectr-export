# zectr-export

## *local env*

ask an admin to provide you with a copy of the AWS access keys that are required to run any bit of the software that utilizes the public cloud. Save these in safe and local location, they will be used shortly.

download all of the dependencies (seen in last section) and follow their installation instructions. 

create a clone of this repository using the git tools and techniques of your choice.

have the admin's AWS access keys ready, anf if you didn't already do so while installing the AWS SAM CLI, run the following command: 

`aws configure`

this command will create a very minimal AWS *profile* locally on your machine, for more information on what the profile entails, the local files it creates, etc.. see [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

#### *note*

creating and managing your own AWS environment may be the better choice for you, that being said, additional setup will be required. to learn how to build the environment as we did ours see [here]().

## [i] *local startup*

you may have to run the following command **one time only**:

`serverless plugin install -n serverless-offline`

`serverless offline start`

## [ii] *remote startup*

`serverless deploy`

## [iii] *runtime commands*



## *dependencies*

https://www.npmjs.com/package/serverless

https://github.com/gitbrent/PptxGenJS

https://www.npmjs.com/package/xlsx

https://aws.amazon.com/cli/

https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

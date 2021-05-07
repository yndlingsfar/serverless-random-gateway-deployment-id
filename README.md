<p align="center">
  <a href="https://npmjs.com/package/serverless-random-gateway-deployment-id">
    <img src="https://flat.badgen.net/npm/v/serverless-random-gateway-deployment-id?icon=npm&label=npm@latest"></a>
<a href="https://www.npmjs.com/package/serverless-random-gateway-deployment-id">
    <img src="https://flat.badgen.net/npm/dt/serverless-random-gateway-deployment-id?icon=npm"></a>
  <a href="https://packagephobia.now.sh/result?p=serverless-random-gateway-deployment-id">
    <img src="https://flat.badgen.net/packagephobia/install/serverless-random-gateway-deployment-id"></a>
  <a href="https://www.npmjs.com/package/serverless-random-gateway-deployment-id">
    <img src="https://flat.badgen.net/npm/license/serverless-random-gateway-deployment-id"></a>
  <br/>
</p>

_Feedback is appreciated! If you have an idea for how this plugin/library can be improved (or even just a complaint/criticism) then please open an issue._

# Serverless Plugin: Random Gateway deploymentId

1. [Overview](#overview)
1. [Installation & Setup](#installation--setup)
1. [Example](#example)

# Overview
When using serverless framework only to deploy your aws resources **without having any lambda functions or triggers**, the AWS Gateway deploymemt does not behave as expected.
Any deployment to an existing stage will be ignored, since CloudFormation does not redeploy a stage if the DeploymentIdentifier has not changed.

The plugin parses the custom Cloudformation resources and adds a random id to the deployment-name and all references to it

See the **examples** folder for a full working [example](https://github.com/yndlingsfar/serverless-random-gateway-deployment-id/tree/main/examples)

# Installation & Setup

Run `npm install` in your Serverless project.

`$ npm install --save-dev serverless-random-gateway-deployment-id`

Add the plugin to your serverless.yml file

```yml
plugins:
  - serverless-random-gateway-deployment-id
```

# Example

The following example demonstrates a simple gateway deployment configuration. On every deploy the plugin will attach a random identifier to  **ApiGatewayDeployment** 

```yml
service:
  name: user-registration

provider:
  name: aws
  stage: dev
  region: eu-central-1

plugins:
  - serverless-random-gateway-deployment-id

functions:

resources:
  Resources:
    ApiGatewayRestApi:
      Type: AWS::ApiGateway::RestApi
      Properties:
        ApiKeySourceType: HEADER
        Body: ${file(api.yml)}
        Description: "Some Description"
        FailOnWarnings: false
        Name: ${opt:stage, self:provider.stage}-some-name
        EndpointConfiguration:
          Types:
            - REGIONAL
    ApiGatewayDeployment:
      Type: AWS::ApiGateway::Deployment
      Properties:
        Description: ${opt:stage, self:provider.stage}
        RestApiId: !Ref ApiGatewayRestApi
    ApiGatewayStage:
      Type: AWS::ApiGateway::Stage
      Properties:
        StageName: ${opt:stage, self:provider.stage}
        Description: ${opt:stage, self:provider.stage} Stage
        RestApiId: !Ref ApiGatewayRestApi
        DeploymentId: !Ref ApiGatewayDeployment
        MethodSettings:
          - DataTraceEnabled: true
            HttpMethod: "*"
            LoggingLevel: ERROR
            ResourcePath: "/*"
            MetricsEnabled: true
    ApiGatewayBasePath:
      Type: AWS::ApiGateway::BasePathMapping
      DependsOn: ApiGatewayStage
      Properties:
        BasePath: some-path
        DomainName: www.test.de
        RestApiId: !Ref ApiGatewayRestApi
        Stage: ${opt:stage, self:provider.stage}
```

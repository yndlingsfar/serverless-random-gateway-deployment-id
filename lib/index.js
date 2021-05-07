class RandomGatewayDeploymentIdPlugin {
    constructor(serverless, options) {
        this.serverless = serverless;

        this.hooks = {
            'before:aws:package:finalize:mergeCustomProviderResources': this.randomizeDeploymentId.bind(this)
        };
    }

    randomizeDeploymentId() {
        let resources = this.serverless.service.resources.Resources;
        Object.entries(resources).forEach(([resourceName, resource]) => {
            if (resource.Type === 'AWS::ApiGateway::Deployment') {
                const randomizedName = this.randomize(resourceName)
                const variableRegex = new RegExp(resourceName, 'g')
                resources = JSON.parse(JSON.stringify(resources).replace(variableRegex, randomizedName));
            }

            this.serverless.service.resources.Resources = resources;
        });
    }

    randomize(resourceName) {
        return resourceName + Date.now();
    }
}

module.exports = RandomGatewayDeploymentIdPlugin;

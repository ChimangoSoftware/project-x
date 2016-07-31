import _ = require('lodash');

let endpointPermissions = new Map<string, string[]>();

function getEndpointPermission(service: string, operation: string, roles: string[]): boolean {
    if(!service || !operation) return false;
    const endpoint = `${service}.${operation}`;

    const grantedRoles = endpointPermissions.get(endpoint);

    if(!grantedRoles) return true;

    const intersection = _.intersection(grantedRoles, roles);
    if(!intersection.length) return false;

    return true;
}

function setEndpointPermission(value: { service: string, roles: string[] }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        endpointPermissions.set(`${value.service}.${propertyKey}`, value.roles);
    };
}

export = {
    getEndpointPermission: getEndpointPermission,
    setEndpointPermission: setEndpointPermission
};

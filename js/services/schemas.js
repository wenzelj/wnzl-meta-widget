angular.module('myApp').factory('schemaService', function() {
    var defaultSchemas = {
        person: {
            properties: {
                firstname: {
                    type: 'string',
                    required: true,
                    minLength: 2,
                    maxLength: 50
                },
                surname: {
                    type: 'string',
                    required: true,
                    minLength: 2,
                    maxLength: 50
                },
                age: {
                    type: 'number',
                    required: true,
                    minimum: 0
                },
                occupation: {
                    restLookup: 'occupations'
                }
            }
        },
        address: {
            properties: {
                street: {
                    type: 'string'
                },
                city: {
                    type: 'string'
                },
                postcode: {
                    type: 'string'
                }
            }
        },
        child: {
            properties: {
                name: {
                    type: 'string'
                },
                age: {
                    type: 'number',
                    minimum: 0
                }
            }
        }
    };

    return {
        getDefaultSchemas: function() {
            return defaultSchemas;
        }
    };
});

angular.module('myApp').component('schemaEditor', {
    templateUrl: 'js/components/schema-editor.html',
    controller: ['personRepository', 'METAWIDGET_TYPES', function(personRepository, METAWIDGET_TYPES) {
        var $ctrl = this;

        $ctrl.schemas = {};
        $ctrl.selectedSchemaKey = null;
        $ctrl.types = METAWIDGET_TYPES;
        $ctrl.newProperty = {
            name: '',
            type: METAWIDGET_TYPES[0]
        };

        $ctrl.$onInit = function() {
            personRepository.getSchemas().then(function(schemas) {
                $ctrl.schemas = schemas;
                if (schemas && Object.keys(schemas).length > 0) {
                    $ctrl.selectedSchemaKey = Object.keys(schemas)[0];
                }
            }).catch(function(error) {
                console.error("Error fetching schemas in schema-editor:", error);
            });
        };

        $ctrl.addProperty = function() {
            if ($ctrl.newProperty.name && $ctrl.selectedSchemaKey) {
                var selectedSchema = $ctrl.schemas[$ctrl.selectedSchemaKey];
                if (!selectedSchema.properties) {
                    selectedSchema.properties = {};
                }
                selectedSchema.properties[$ctrl.newProperty.name] = {
                    type: $ctrl.newProperty.type
                };
                $ctrl.newProperty.name = '';
            }
        };

        $ctrl.saveSchemas = function() {
            personRepository.saveSchemas($ctrl.schemas);
        };
    }]
});

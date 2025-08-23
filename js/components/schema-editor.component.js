angular.module('myApp').component('schemaEditor', {
    templateUrl: 'js/components/schema-editor.html',
    controller: ['personRepository', 'METAWIDGET_TYPES', function(personRepository, METAWIDGET_TYPES) {
        var $ctrl = this;

        $ctrl.$onInit = function() {
            personRepository.getSchemas().then(function(schemas) {
                $ctrl.schemas = schemas;
                $ctrl.selectedSchemaKey = Object.keys(schemas)[0];
                $ctrl.newProperty = {
                    name: '',
                    type: METAWIDGET_TYPES[0]
                };
            });
            $ctrl.types = METAWIDGET_TYPES;
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

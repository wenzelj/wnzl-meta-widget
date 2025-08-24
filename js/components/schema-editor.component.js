angular.module('myApp').component('schemaEditor', {
    template: `
    <div class="card p-4">
    <h2>Schema Editor</h2>

    <div class="form-group">
        <label for="schemaSelect">Select Schema to Edit:</label>
        <select id="schemaSelect" class="form-control" ng-model="$ctrl.selectedSchemaKey">
            <option ng-repeat="(key, schema) in $ctrl.schemas" value="{{key}}">{{key}}</option>
        </select>
    </div>

    <div ng-if="$ctrl.selectedSchemaKey">
        <hr>
        <h4>Add New Property to {{$ctrl.selectedSchemaKey}}</h4>
        <div class="form-row">
            <div class="col">
                <input type="text" class="form-control" placeholder="Property Name" ng-model="$ctrl.newProperty.name">
            </div>
            <div class="col">
                <select class="form-control" ng-model="$ctrl.newProperty.type" ng-options="type for type in $ctrl.types"></select>
            </div>
            <div class="col">
                <button class="btn btn-success" ng-click="$ctrl.addProperty()">Add Property</button>
            </div>
        </div>

        <hr>
        <h4>Properties for {{$ctrl.selectedSchemaKey}}</h4>
        <ul class="list-group">
            <li class="list-group-item" ng-repeat="(propName, propDetails) in $ctrl.schemas[$ctrl.selectedSchemaKey].properties">
                <strong>{{propName}}</strong>: {{propDetails.type}}
            </li>
        </ul>

        <hr>
        <button class="btn btn-primary" ng-click="$ctrl.saveSchemas()">Save All Changes</button>
    </div>
</div>
    `,
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

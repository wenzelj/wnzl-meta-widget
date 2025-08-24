angular.module('myApp').component('schemaEditor', {
    template: `
<div class="container mt-4">
    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <h2 class="card-title">Schema Editor</h2>
            <p class="card-text text-muted">Select a schema to view and add new properties.</p>
            <div class="form-group mb-3">
                <label for="schemaSelect" class="form-label"><strong>Select Schema to Edit:</strong></label>
                <select id="schemaSelect" class="form-select" ng-model="$ctrl.selectedSchemaKey">
                    <option ng-repeat="(key, schema) in $ctrl.schemas" value="{{key}}">{{key}}</option>
                </select>
            </div>
        </div>
    </div>

    <div ng-if="!$ctrl.selectedSchemaKey" class="alert alert-info">
        Please select a schema to begin editing.
    </div>

    <div ng-if="$ctrl.selectedSchemaKey">
        <!-- Add New Property Card -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h4 class="card-title">Add New Property to <strong>{{$ctrl.selectedSchemaKey}}</strong></h4>
                <div class="row g-3 align-items-end">
                    <div class="col-md-5">
                        <label class="form-label">Property Name</label>
                        <input type="text" class="form-control" placeholder="e.g., 'email'" ng-model="$ctrl.newProperty.name">
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Property Type</label>
                        <select class="form-select" ng-model="$ctrl.newProperty.type" ng-options="type for type in $ctrl.types"></select>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-success w-100" ng-click="$ctrl.addProperty()">
                            <i class="fas fa-plus-circle"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Properties List Card -->
        <div class="card shadow-sm">
            <div class="card-body">
                <h4 class="card-title">Properties for <strong>{{$ctrl.selectedSchemaKey}}</strong></h4>
                <ul class="list-group list-group-flush" ng-if="($ctrl.schemas[$ctrl.selectedSchemaKey].properties | keys).length > 0">
                    <li class="list-group-item" ng-repeat="(propName, propDetails) in $ctrl.schemas[$ctrl.selectedSchemaKey].properties">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>
                                <i class="fas fa-cog text-secondary me-2"></i>
                                <strong>{{propName}}</strong>
                            </span>
                            <span class="badge bg-primary rounded-pill">{{propDetails.type}}</span>
                        </div>
                    </li>
                </ul>
                <div ng-if="!($ctrl.schemas[$ctrl.selectedSchemaKey].properties | keys).length" class="alert alert-light mt-3">
                    This schema has no properties yet. Add one above!
                </div>
            </div>
        </div>

        <div class="mt-4 text-end">
            <button class="btn btn-primary btn-lg" ng-click="$ctrl.saveSchemas()">
                <i class="fas fa-save"></i> Save All Changes
            </button>
        </div>
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
            if (window.confirm("Are you sure you want to save all changes?")) {
                personRepository.saveSchemas($ctrl.schemas);
            }
        };
    }]
});

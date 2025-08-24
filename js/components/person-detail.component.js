angular.module('myApp').component('personDetail', {
    bindings: {
        person: '<'
    },
    controller: ['personRepository', function(personRepository) {
        var $ctrl = this;
        $ctrl.isEditing = false;

        this.$onInit = function() {
            $ctrl.populateDetails();
        };

        $ctrl.populateDetails = function() {
            $ctrl.details = [];
            $ctrl.addressDetails = [];
            $ctrl.childrenDetails = [];

            if (!$ctrl.person) {
                return;
            }

            // Handle all properties except address and children
            for (var key in $ctrl.person) {
                if ($ctrl.person.hasOwnProperty(key) && !key.startsWith('$$')) {
                    if (key !== 'address' && key !== 'children') {
                        $ctrl.details.push({ key: key, value: $ctrl.person[key] });
                    }
                }
            }

            // Handle address
            if ($ctrl.person.address && typeof $ctrl.person.address === 'object') {
                Object.keys($ctrl.person.address).forEach(function(addressKey) {
                    $ctrl.addressDetails.push({ key: addressKey, value: $ctrl.person.address[addressKey] });
                });
            }

            // Handle children
            if ($ctrl.person.children && Array.isArray($ctrl.person.children)) {
                $ctrl.childrenDetails = $ctrl.person.children;
            }
        };

        $ctrl.toggleEdit = function() {
            $ctrl.isEditing = !$ctrl.isEditing;
            if ($ctrl.isEditing) {
                // Create a copy of the person object for editing
                $ctrl.editablePerson = angular.copy($ctrl.person);
            }
        };

        $ctrl.saveChanges = function() {
            if (window.confirm('Are you sure you want to save the changes?')) {
                personRepository.update($ctrl.editablePerson).then(function() {
                    $ctrl.person = $ctrl.editablePerson;
                    $ctrl.populateDetails();
                    $ctrl.isEditing = false;
                });
            }
        };

        this.formatKey = function(key) {
            return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        };
    }],
    template: `
        <div class="card p-4">
            <h3 class="card-title text-center mb-4">Selected Person Details</h3>

            <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-secondary me-2" ng-if="$ctrl.isEditing" ng-click="$ctrl.toggleEdit()">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn btn-success me-2" ng-if="$ctrl.isEditing" ng-click="$ctrl.saveChanges()">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="btn btn-primary" ng-if="!$ctrl.isEditing" ng-click="$ctrl.toggleEdit()">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>

            <!-- All Details -->
            <div class="card mb-4" ng-if="$ctrl.details.length > 0">
                <div class="card-header">
                    <h4><i class="fas fa-user"></i> Details</h4>
                </div>
                <div class="card-body">
                    <div ng-repeat="detail in $ctrl.details" class="row mt-2">
                        <div class="col-md-6"><strong>{{$ctrl.formatKey(detail.key)}}:</strong></div>
                        <div class="col-md-6">
                            <span ng-if="!$ctrl.isEditing">{{detail.value}}</span>
                            <input ng-if="$ctrl.isEditing" type="text" class="form-control" ng-model="$ctrl.editablePerson[detail.key]" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Address Details -->
            <div class="card mb-4" ng-if="$ctrl.addressDetails.length > 0">
                <div class="card-header">
                    <h4><i class="fas fa-map-marker-alt"></i> Address</h4>
                </div>
                <div class="card-body">
                    <div ng-repeat="detail in $ctrl.addressDetails" class="row mt-2">
                        <div class="col-md-6"><strong>{{$ctrl.formatKey(detail.key)}}:</strong></div>
                        <div class="col-md-6">
                            <span ng-if="!$ctrl.isEditing">{{detail.value}}</span>
                            <input ng-if="$ctrl.isEditing" type="text" class="form-control" ng-model="$ctrl.editablePerson.address[detail.key]" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Children Details -->
            <div class="card" ng-if="$ctrl.childrenDetails.length > 0">
                <div class="card-header">
                    <h4><i class="fas fa-child"></i> Children</h4>
                </div>
                <div class="card-body">
                    <ul class="list-group">
                        <li ng-repeat="child in $ctrl.childrenDetails" class="list-group-item">
                            <div ng-repeat="(key, value) in child">
                                <strong>{{$ctrl.formatKey(key)}}:</strong> {{value}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `
});

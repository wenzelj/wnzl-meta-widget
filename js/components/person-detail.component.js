angular.module('myApp').component('personDetail', {
    bindings: {
        person: '<'
    },
    controller: function() {
        var $ctrl = this;

        this.$onInit = function() {
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

        this.formatKey = function(key) {
            return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        };
    },
    template: `
        <div class="card p-4">
            <h3 class="card-title text-center mb-4">Selected Person Details</h3>

            <!-- All Details -->
            <div class="card mb-4" ng-if="$ctrl.details.length > 0">
                <div class="card-header">
                    <h4><i class="fas fa-user"></i> Details</h4>
                </div>
                <div class="card-body">
                    <div ng-repeat="detail in $ctrl.details" class="row mt-2">
                        <div class="col-md-6"><strong>{{$ctrl.formatKey(detail.key)}}:</strong></div>
                        <div class="col-md-6">{{detail.value}}</div>
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
                        <div class="col-md-6">{{detail.value}}</div>
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

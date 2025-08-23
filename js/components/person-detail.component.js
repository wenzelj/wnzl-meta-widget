angular.module('myApp').component('personDetail', {
    bindings: {
        person: '<'
    },
    template: `
        <div class="card p-3">
            <h4>Person Details</h4>
            <div><strong>Firstname:</strong> {{$ctrl.person.firstname}}</div>
            <div><strong>Surname:</strong> {{$ctrl.person.surname}}</div>
            <div><strong>Age:</strong> {{$ctrl.person.age}}</div>
            <div ng-if="$ctrl.person.occupation"><strong>Occupation:</strong> {{$ctrl.person.occupation}}</div>
        </div>

        <div class="card p-3 mt-3" ng-if="$ctrl.person.address && ($ctrl.person.address.street || $ctrl.person.address.city || $ctrl.person.address.postcode)">
            <h4>Address</h4>
            <div><strong>Street:</strong> {{$ctrl.person.address.street}}</div>
            <div><strong>City:</strong> {{$ctrl.person.address.city}}</div>
            <div><strong>Postcode:</strong> {{$ctrl.person.address.postcode}}</div>
        </div>

        <div class="card p-3 mt-3" ng-if="$ctrl.person.children && $ctrl.person.children.length > 0">
            <h4>Children</h4>
            <ul class="list-group">
                <li ng-repeat="child in $ctrl.person.children" class="list-group-item">
                    {{child.name}} ({{child.age}} years old)
                </li>
            </ul>
        </div>
    `
});

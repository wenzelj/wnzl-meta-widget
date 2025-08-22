angular
  .module("myApp", ["metawidget"])
  .controller("myController", function ($scope) {
    // This example demonstrates two uses of REST: one for retrieving the schema,
    // and another for retrieving lookup values.
    //
    // Simulate some back-end REST values

    var schemas = {
      person: {
        properties: {
          firstname: {
            type: "string",
            required: true,
            minLength: 2,
            maxLength: 50,
          },
          surname: {
            type: "string",
            required: true,
            minLength: 2,
            maxLength: 50,
          },
          age: {
            type: "number",
            required: true,
          },
          occupation: {
            restLookup: "occupations",
          },
        },
      },
      address: {
        properties: {
          street: {
            type: "string"
          },
          city: {
            type: "string"
          },
          postcode: {
            type: "string"
          },
        },
      },
      child: {
        properties: {
          name: {
            type: "string",
            required: true
          },
          age: {
            type: "number",
            required: true
          },
        },
      },
    };

    var restLookup = {
      occupations: [
        {
          id: "A",
          name: "Accountant",
        },
        {
          id: "B",
          name: "Bartender",
        },
        {
          id: "F",
          name: "Farmer",
        },
        {
          id: "N",
          name: "Nuclear Plant Worker",
        },
      ],
    };

    // Configure Metawidget

    $scope.myConfig = {
      inspectionResultProcessors: [
        function (inspectionResult, mw, toInspect, type, names) {
          // Simulate a REST call to retrieve the schema.
          //
          // Normally instead of 'setTimeout' you'd use '$http.get'

          setTimeout(function () {
            var schemaToUse;

            if (type === 'person') {
              if (names && names.length === 1 && names[0] === 'address') {
                schemaToUse = schemas.address;
              } else {
                schemaToUse = schemas.person;
              }
            } else if (type === 'newChild') {
              schemaToUse = schemas.child;
            }

            if (schemaToUse) {
              metawidget.util.combineInspectionResults(
                inspectionResult,
                schemaToUse
              );
            }
            mw.buildWidgets(inspectionResult);
          }, 1);

          // Return nothing to suspend Metawidget operation until REST call returns
        },
      ],

      widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder([
        function (elementName, attributes, mw) {
          // Support our custom 'restLookup' attribute. This is used to determine
          // the REST path to call

          if (attributes.restLookup !== undefined) {
            var key = attributes.name + "Lookup";

            // Simulate a REST call to retrieve the values.
            //
            // Normally instead of 'setTimeout' you'd use '$http.get' (and you
            // wouldn't need to manually call $apply)

            setTimeout(function () {
              $scope[key] = restLookup[attributes.restLookup];
              $scope.$apply();
            }, 1);

            return angular.element(
              '<select ng-options="item.id as item.name for item in ' +
                key +
                '">'
            )[0];
          }
        },
        new metawidget.widgetbuilder.HtmlWidgetBuilder(),
      ]),
    };

    // Model
    $scope.person = {
      address: {},
      children: [],
    };
    $scope.newChild = {};

    // Wizard
    $scope.wizardStep = 1;

    $scope.nextStep = function () {
      $scope.wizardStep++;
    };

    $scope.prevStep = function () {
      $scope.wizardStep--;
    };

    $scope.addChild = function () {
      $scope.person.children.push($scope.newChild);
      $scope.newChild = {};
    };

    $scope.save = function () {
      console.log($scope.person);
    };
  });

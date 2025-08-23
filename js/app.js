angular
  .module("myApp", ["metawidget"])
  .controller("myController", [
    "$scope",
    "personRepository",
    function ($scope, personRepository) {
      var schemas;

      personRepository.getSchemas().then(function (result) {
        schemas = result;
      });

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

      $scope.myConfig = {
        inspectionResultProcessors: [
          function (inspectionResult, mw, toInspect, type, names) {
            setTimeout(function () {
              var schemaToUse;

              if (type === "person") {
                if (names && names.length === 1 && names[0] === "address") {
                  schemaToUse = schemas.address;
                } else {
                  schemaToUse = schemas.person;
                }
              } else if (type === "newChild") {
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
          },
        ],

        widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder([
          function (elementName, attributes, mw) {
            if (attributes.restLookup !== undefined) {
              var key = attributes.name + "Lookup";
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

      $scope.person = new Person();
      $scope.newChild = new Child();

      $scope.wizardStep = 1;
      $scope.wizardStepTitles = [
          "Your Details",
          "Your Address",
          "Your Children",
          "Summary"
      ];
      $scope.showSummary = false;
      $scope.view = "landing";

      $scope.showWizard = function () {
        $scope.view = "wizard";
      };

      $scope.showSchemaEditor = function () {
        $scope.view = "schemaEditor";
      };

      $scope.search = {
        term: ""
      };
      $scope.searchResults = [];
      $scope.selectedPerson = null;
      $scope.searchPerformed = false;

      $scope.searchPerson = function () {
        $scope.searchPerformed = true;
        personRepository.search($scope.search.term).then(function (results) {
          $scope.searchResults = results;
          $scope.selectedPerson = null;
        });
      };

      $scope.selectPerson = function (person) {
        var personInstance = new Person(
            person.firstname,
            person.surname,
            person.age,
            person.occupation
        );
        personInstance.address = person.address;
        personInstance.children = person.children;
        $scope.selectedPerson = personInstance;
      };

      $scope.nextStep = function () {
        $scope.wizardStep++;
      };

      $scope.prevStep = function () {
        $scope.wizardStep--;
      };

      $scope.startOver = function () {
        $scope.person = new Person();
        $scope.newChild = new Child();
        $scope.wizardStep = 1;
        $scope.view = "landing";
        personRepository.getSchemas().then(function (result) {
          schemas = result;
        });
      };

      $scope.addChild = function () {
        $scope.person.children.push(angular.copy($scope.newChild));
        $scope.newChild = new Child();
      };

      $scope.save = function () {
        // Use JSON stringify and parse to create a plain JavaScript object
        // that can be safely stored in IndexedDB. This removes the class prototype.
        var personToSave = JSON.parse(JSON.stringify($scope.person));
        personRepository.save(personToSave).then(function () {
          $scope.wizardStep++;
        });
      };
    },
  ]);

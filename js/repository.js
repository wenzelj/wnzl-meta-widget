angular.module('myApp').factory('personRepository', ['$q', function($q) {

    let persons = [];
    let nextId = 1;

    return {
        save: function(person) {
            return $q((resolve) => {
                person.id = nextId++;
                persons.push(angular.copy(person));
                resolve();
            });
        },
        getAll: function() {
            return $q.when(angular.copy(persons));
        },
        search: function(term) {
            return this.getAll().then(allPersons => {
                if (!term) {
                    return allPersons;
                }
                term = term.toLowerCase();
                return allPersons.filter(person => {
                    return (person.firstname && person.firstname.toLowerCase().includes(term)) ||
                           (person.surname && person.surname.toLowerCase().includes(term));
                });
            });
        },
        clear: function() {
            return $q((resolve) => {
                persons = [];
                nextId = 1;
                resolve();
            });
        }
    };
}]);

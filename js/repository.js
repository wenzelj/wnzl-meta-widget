angular.module('myApp').factory('personRepository', ['$q', function($q) {

    var db;

    function getDb() {
        if (db) {
            return $q.when(db);
        }

        return $q(function(resolve, reject) {
            var request = indexedDB.open('myApp', 1);

            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                if (!db.objectStoreNames.contains('persons')) {
                    db.createObjectStore('persons', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = function(event) {
                db = event.target.result;
                resolve(db);
            };

            request.onerror = function(event) {
                reject(event.target.error);
            };
        });
    }

    return {
        save: function(person) {
            return getDb().then(function(db) {
                return $q(function(resolve, reject) {
                    var transaction = db.transaction(['persons'], 'readwrite');
                    var store = transaction.objectStore('persons');
                    var request = store.put(person);

                    request.onsuccess = function() {
                        resolve();
                    };

                    request.onerror = function(event) {
                        reject(event.target.error);
                    };
                });
            });
        },
        getAll: function() {
            return getDb().then(function(db) {
                return $q(function(resolve, reject) {
                    var transaction = db.transaction(['persons'], 'readonly');
                    var store = transaction.objectStore('persons');
                    var request = store.getAll();

                    request.onsuccess = function(event) {
                        resolve(event.target.result);
                    };

                    request.onerror = function(event) {
                        reject(event.target.error);
                    };
                });
            });
        },
        search: function(term) {
            return this.getAll().then(function(allPersons) {
                if (!term) {
                    return allPersons;
                }
                term = term.toLowerCase();
                return allPersons.filter(function(person) {
                    return (person.firstname && person.firstname.toLowerCase().includes(term)) ||
                           (person.surname && person.surname.toLowerCase().includes(term));
                });
            });
        },
        clear: function() {
            return getDb().then(function(db) {
                return $q(function(resolve, reject) {
                    var transaction = db.transaction(['persons'], 'readwrite');
                    var store = transaction.objectStore('persons');
                    var request = store.clear();

                    request.onsuccess = function() {
                        resolve();
                    };

                    request.onerror = function(event) {
                        reject(event.target.error);
                    };
                });
            });
        }
    };
}]);

angular.module('myApp').factory('personRepository', ['$q', function($q) {

    let dbPromise = null;

    function getDb() {
        if (!dbPromise) {
            dbPromise = $q((resolve, reject) => {
                const request = indexedDB.open('personsDB', 3);

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    let store;
                    if (!db.objectStoreNames.contains('persons')) {
                        store = db.createObjectStore('persons', { keyPath: 'id', autoIncrement: true });
                    } else {
                        store = event.target.transaction.objectStore('persons');
                    }

                    if (!store.indexNames.contains('firstname')) {
                        store.createIndex('firstname', 'firstname', { unique: false });
                    }
                    if (!store.indexNames.contains('surname')) {
                        store.createIndex('surname', 'surname', { unique: false });
                    }
                };

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        }
        return dbPromise;
    }

    function performDbOperation(storeName, mode, operation) {
        return getDb().then(db => {
            return $q((resolve, reject) => {
                const transaction = db.transaction([storeName], mode);
                const store = transaction.objectStore(storeName);
                const request = operation(store);

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    }

    return {
        save: function(person) {
            return performDbOperation('persons', 'readwrite', store => store.add(person));
        },
        getAll: function() {
            return performDbOperation('persons', 'readonly', store => store.getAll());
        },
        search: function(term) {
            return this.getAll().then(persons => {
                if (!term) {
                    return persons;
                }
                term = term.toLowerCase();
                return persons.filter(person => {
                    return (person.firstname && person.firstname.toLowerCase().includes(term)) ||
                           (person.surname && person.surname.toLowerCase().includes(term));
                });
            });
        },
        clear: function() {
            return performDbOperation('persons', 'readwrite', store => store.clear());
        }
    };
}]);

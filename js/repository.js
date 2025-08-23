angular.module('myApp').factory('personRepository', ['$q', function($q) {

    let dbPromise = null;

    function getDb() {
        if (!dbPromise) {
            dbPromise = $q((resolve, reject) => {
                const request = indexedDB.open('personsDB', 2);

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('persons')) {
                        const store = db.createObjectStore('persons', { keyPath: 'id', autoIncrement: true });
                        store.createIndex('firstname', 'firstname', { unique: false });
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
            if (!term) {
                return this.getAll();
            }
            term = term.toLowerCase();

            const searchFirstname = performDbOperation('persons', 'readonly', store => {
                const index = store.index('firstname');
                const range = IDBKeyRange.bound(term, term + '\uffff');
                return index.getAll(range);
            });

            const searchSurname = performDbOperation('persons', 'readonly', store => {
                const index = store.index('surname');
                const range = IDBKeyRange.bound(term, term + '\uffff');
                return index.getAll(range);
            });

            return $q.all([searchFirstname, searchSurname]).then(results => {
                const [firstnameResults, surnameResults] = results;
                const combinedResults = [...firstnameResults];

                surnameResults.forEach(person => {
                    if (!combinedResults.some(p => p.id === person.id)) {
                        combinedResults.push(person);
                    }
                });

                return combinedResults;
            });
        },
        clear: function() {
            return performDbOperation('persons', 'readwrite', store => store.clear());
        }
    };
}]);

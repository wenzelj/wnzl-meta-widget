angular.module('myApp').factory('personRepository', ['$q', 'schemaService', function($q, schemaService) {

    var db;

    function getDb() {
        if (db) {
            return $q.when(db);
        }

        return $q(function(resolve, reject) {
            var request = indexedDB.open('myApp', 2);

            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                if (!db.objectStoreNames.contains('persons')) {
                    db.createObjectStore('persons', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('schemas')) {
                    db.createObjectStore('schemas', { keyPath: 'id' });
                }
            };

            request.onsuccess = function(event) {
                db = event.target.result;
                var transaction = db.transaction(['schemas'], 'readwrite');
                var store = transaction.objectStore('schemas');
                var countRequest = store.count();

                countRequest.onsuccess = function() {
                    if (countRequest.result === 0) {
                        var defaultSchemas = schemaService.getDefaultSchemas();
                        var promises = [];
                        for (var key in defaultSchemas) {
                            if (defaultSchemas.hasOwnProperty(key)) {
                                var deferred = $q.defer();
                                var addRequest = store.add({ id: key, schema: defaultSchemas[key] });
                                addRequest.onsuccess = function() {
                                    deferred.resolve();
                                };
                                addRequest.onerror = function(event) {
                                    deferred.reject(event.target.error);
                                };
                                promises.push(deferred.promise);
                            }
                        }
                        $q.all(promises).then(function() {
                            resolve(db);
                        }, reject);
                    } else {
                        resolve(db);
                    }
                };
                countRequest.onerror = function(event) {
                    reject(event.target.error);
                };
            };

            request.onerror = function(event) {
                reject(event.target.error);
            };
        });
    }

    function getSchemas() {
        return getDb().then(function(db) {
            return $q(function(resolve, reject) {
                var transaction = db.transaction(['schemas'], 'readonly');
                var store = transaction.objectStore('schemas');
                var request = store.getAll();

                request.onsuccess = function(event) {
                    var result = {};
                    event.target.result.forEach(function(item) {
                        result[item.id] = item.schema;
                    });
                    resolve(result);
                };

                request.onerror = function(event) {
                    reject(event.target.error);
                };
            });
        });
    }

    function saveSchemas(schemas) {
        return getDb().then(function(db) {
            return $q(function(resolve, reject) {
                var transaction = db.transaction(['schemas'], 'readwrite');
                var store = transaction.objectStore('schemas');

                var promises = [];
                for (var key in schemas) {
                    if (schemas.hasOwnProperty(key)) {
                        var deferred = $q.defer();
                        var request = store.put({ id: key, schema: schemas[key] });
                        request.onsuccess = function() {
                            deferred.resolve();
                        };
                        request.onerror = function(event) {
                            deferred.reject(event.target.error);
                        };
                        promises.push(deferred.promise);
                    }
                }

                $q.all(promises).then(resolve, reject);
            });
        });
    }

    return {
        getSchemas: getSchemas,
        saveSchemas: saveSchemas,
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
        },
        deleteDatabase: function() {
            return $q(function(resolve, reject) {
                if (db) {
                    db.close();
                    db = null;
                }
                var request = indexedDB.deleteDatabase('myApp');

                request.onsuccess = function() {
                    resolve();
                };

                request.onerror = function(event) {
                    reject(event.target.error);
                };

                request.onblocked = function(event) {
                    console.warn("Delete database request is blocked", event);
                    reject("Database deletion blocked");
                };
            });
        }
    };
}]);

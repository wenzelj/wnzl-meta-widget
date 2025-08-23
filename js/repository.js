const personRepository = {
    dbPromise: null,
    getDb: function() {
        if (!this.dbPromise) {
            this.dbPromise = new Promise((resolve, reject) => {
                const request = indexedDB.open('personsDB', 1);

                request.onupgradeneeded = (event) => {
                    let db = event.target.result;
                    db.createObjectStore('persons', { keyPath: 'id', autoIncrement: true });
                };

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        }
        return this.dbPromise;
    },
    save: function(person) {
        return this.getDb().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['persons'], 'readwrite');
                const store = transaction.objectStore('persons');
                const request = store.add(person);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    },
    getAll: function() {
        return this.getDb().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['persons'], 'readonly');
                const store = transaction.objectStore('persons');
                const request = store.getAll();

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
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
        return this.getDb().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['persons'], 'readwrite');
                const store = transaction.objectStore('persons');
                const request = store.clear();

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    }
};

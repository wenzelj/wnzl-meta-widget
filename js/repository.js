const personRepository = {
    db: null,
    init: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('personsDB', 1);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                this.db.createObjectStore('persons', { keyPath: 'id', autoIncrement: true });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    },
    save: function(person) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('DB not initialized');
            }
            const transaction = this.db.transaction(['persons'], 'readwrite');
            const store = transaction.objectStore('persons');
            const request = store.add(person);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    },
    getAll: function() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('DB not initialized');
            }
            const transaction = this.db.transaction(['persons'], 'readonly');
            const store = transaction.objectStore('persons');
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
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
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject('DB not initialized');
            }
            const transaction = this.db.transaction(['persons'], 'readwrite');
            const store = transaction.objectStore('persons');
            const request = store.clear();

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
};

personRepository.init();

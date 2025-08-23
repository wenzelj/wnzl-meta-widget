const personRepository = {
    save: function(person) {
        let persons = this.getAll();
        if (!persons) {
            persons = [];
        }
        persons.push(person);
        localStorage.setItem('persons', JSON.stringify(persons));
    },
    getAll: function() {
        const personsJson = localStorage.getItem('persons');
        if (personsJson) {
            return JSON.parse(personsJson);
        }
        return [];
    },
    search: function(term) {
        const persons = this.getAll();
        if (!term) {
            return persons;
        }
        term = term.toLowerCase();
        return persons.filter(person => {
            return person.firstname.toLowerCase().includes(term) ||
                   person.surname.toLowerCase().includes(term);
        });
    },
    clear: function() {
        localStorage.removeItem('persons');
    }
};

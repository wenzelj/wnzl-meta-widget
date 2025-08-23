const personRepository = {
    save: function(person) {
        localStorage.setItem('person', JSON.stringify(person));
    },
    get: function() {
        const personJson = localStorage.getItem('person');
        if (personJson) {
            return JSON.parse(personJson);
        }
        return null;
    },
    clear: function() {
        localStorage.removeItem('person');
    }
};

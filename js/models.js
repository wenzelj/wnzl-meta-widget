class Address {
    constructor(street, city, postcode) {
        this.street = street;
        this.city = city;
        this.postcode = postcode;
    }
}

class Child {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

class Person {
    constructor(firstname, surname, age, occupation, address, children) {
        this.firstname = firstname;
        this.surname = surname;
        this.age = age;
        this.occupation = occupation;
        this.address = address || new Address();
        this.children = children || [];
    }
}

export class ContactPerson {

    personDetails: PersonDetail[] = [];
    constructor()
    {
        this.personDetails.push(new PersonDetail());
    }
}

// Item   PersonDetail

// items    personDetails

export class PersonDetail {
    salutation!: string;
    fname!: string;
    lname!: string;
    email!: string;
    phone!: string;
    mobile!: string;
}

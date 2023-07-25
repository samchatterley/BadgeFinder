// Importing the necessary error classes
const {
    InvalidBadgesError,
    InvalidFirstNameError,
    InvalidLastNameError,
    InvalidEmailError,
    InvalidMembershipNumberError,
    InvalidUsernameError,
    InvalidEarnedBadgesError,
    InvalidRequiredBadgesError,
    InvalidPasswordError,
} = require("./UserErrors");

/**
 * The User class defines the structure and functionality of a user.
 * @class
 * @property {String} _id - The id of the user.
 * @property {String} _firstName - The first name of the user.
 * @property {String} _lastName - The last name of the user.
 * @property {String} _email - The email of the user.
 * @property {String} _membershipNumber - The membership number of the user.
 * @property {Array} _badges - The badges of the user.
 * @property {Array} _earned_badges - The earned badges of the user.
 * @property {String} _password - The password of the user.
 * @property {Array} _required_badges - The required badges of the user.
 * @property {String} _username - The username of the user.
 */
class User {
    constructor({
        _id,
        firstName,
        lastName,
        email,
        membershipNumber,
        badges,
        earned_badges,
        password,
        required_badges,
        username
    }) {
        this._id = _id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._membershipNumber = membershipNumber;
        this._badges = badges;
        this._earned_badges = earned_badges;
        this._password = password;
        this._required_badges = required_badges;
        this._username = username;
    }

/**
 * Get the first name of the user.
 * @return {string} The first name of the user.
 */
getFirstName() {
    return this._firstName;
}

/**
 * Get the last name of the user.
 * @return {string} The last name of the user.
 */
getLastName() {
    return this._lastName;
}

/**
 * Get the full name of the user.
 * @return {string} The full name of the user.
 */
getFullName() {
    return `${this._firstName} ${this._lastName}`;
}

/**
 * Get the email of the user.
 * @return {string} The email of the user.
 */
getEmail() {
    return this._email;
}

/**
 * Get the ID of the user.
 * @return {string} The ID of the user.
 */
getId() {
    return this._id;
}

/**
 * Get the membership number of the user.
 * @return {string} The membership number of the user.
 */
getMembershipNumber() {
    return this._membershipNumber;
}

/**
 * Get the badges of the user.
 * @return {Array} The badges of the user.
 */
getBadges() {
    return this._badges;
}

/**
 * Get the earned badges of the user.
 * @return {Array} The earned badges of the user.
 */
getEarnedBadges() {
    return this._earned_badges;
}

/**
 * Get the required badges of the user.
 * @return {Array} The required badges of the user.
 */
getRequiredBadges() {
    return this._required_badges;
}

/**
 * Get the username of the user.
 * @return {string} The username of the user.
 */
getUsername() {
    return this._username;
}

/**
 * Get the password of the user.
 * @return {string} The password of the user.
 */
getPassword() {
    return this._password;
}

    set firstName(name) {
        if (!name || typeof name !== "string") {
            throw new InvalidFirstNameError();
        }
        this._firstName = name;
    }

    set lastName(name) {
        if (!name || typeof name !== "string") {
            throw new InvalidLastNameError();
        }
        this._lastName = name;
    }

    set email(email) {
        const emailRegex = /^[\\w-]+(\\.[\\w-]+)*@([\\w-]+\\.)+[a-zA-Z]{1,7}$/;
        if (!email || typeof email !== "string" || !emailRegex.test(email)) {
            throw new InvalidEmailError();
        }
        this._email = email;
    }

    set membershipNumber(number) {
        if (!number || typeof number !== "string") {
            throw new InvalidMembershipNumberError();
        }
        this._membershipNumber = number;
    }

    set username(username) {
        if (!username || typeof username !== "string") {
            throw new InvalidUsernameError();
        }
        this._username = username;
    }

    set badges(badges) {
        if (!Array.isArray(badges)) {
            throw new InvalidBadgesError();
        }
        this._badges = badges;
    }

    set earned_badges(badges) {
        if (!Array.isArray(badges)) {
            throw new InvalidEarnedBadgesError();
        }
        this._earned_badges = badges;
    }

    set required_badges(badges) {
        if (!Array.isArray(badges)) {
            throw new InvalidRequiredBadgesError();
        }
        this._required_badges = badges;
    }

    set password(password) {
        const passwordRegex = /^(?=.*\\d)/;
        if (!password || typeof password !== "string" || password.length < 8 || !passwordRegex.test(password)) {
            throw new InvalidPasswordError();
        }
        this._password = password;
    }
    

}

// Exporting the User class so it can be used in other parts of the application
module.exports = User;

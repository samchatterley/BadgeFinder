const {
    UserError,
    UserNotFoundError,
    BadgeNotFoundError,
    AlreadyHasBadgeError,
    DoesNotHaveBadgeError,
    RequirementNotFoundError,
    InvalidBadgesError,
    InvalidFirstNameError,
    InvalidLastNameError,
    InvalidEmailError,
    InvalidMembershipNumberError,
    InvalidUsernameError,
    InvalidEarnedBadgesError,
    InvalidRequiredBadgesError,
    InvalidPasswordError,
    InvalidCompletionStatusError,
    DuplicateUsernameError
} = require("../../Models/UserErrors");

describe("Verifing that the Error subclasses are defined correctly and can be thrown and caught.", () => {
    it("should throw a UserError", () => {
        expect(() => {
            throw new UserError();
        }).toThrow(UserError);
    });

    it("should throw a UserNotFoundError", () => {
        expect(() => {
            throw new UserNotFoundError();
        }).toThrow(UserNotFoundError);
    });

    it("should throw a BadgeNotFoundError", () => {
        expect(() => {
            throw new BadgeNotFoundError();
        }).toThrow(BadgeNotFoundError);
    });

    it("should throw an AlreadyHasBadgeError", () => {
        expect(() => {
            throw new AlreadyHasBadgeError();
        }).toThrow(AlreadyHasBadgeError);
    });

    it("should throw a DoesNotHaveBadgeError", () => {
        expect(() => {
            throw new DoesNotHaveBadgeError();
        }).toThrow(DoesNotHaveBadgeError);
    });

    it("should throw a RequirementNotFoundError", () => {
        expect(() => {
            throw new RequirementNotFoundError();
        }).toThrow(RequirementNotFoundError);
    });

    it("should throw an InvalidBadgesError", () => {
        expect(() => {
            throw new InvalidBadgesError();
        }).toThrow(InvalidBadgesError);
    });

    it("should throw an InvalidFirstNameError with a specific message", () => {
        expect(() => {
            throw new InvalidFirstNameError();
        }).toThrow("firstName must be a non-empty string");
    });

    it("should throw an InvalidLastNameError with a specific message", () => {
        expect(() => {
            throw new InvalidLastNameError();
        }).toThrow("lastName must be a non-empty string");
    });

    it("should throw an InvalidEmailError with a specific message", () => {
        expect(() => {
            throw new InvalidEmailError();
        }).toThrow("email must be a valid email address");
    });

    it("should throw an InvalidMembershipNumberError with a specific message", () => {
        expect(() => {
            throw new InvalidMembershipNumberError();
        }).toThrow("membershipNumber must be a non-empty string");
    });

    it("should throw an InvalidUsernameError with a specific message", () => {
        expect(() => {
            throw new InvalidUsernameError();
        }).toThrow("username must be a non-empty string");
    });

    it("should throw an InvalidEarnedBadgesError with a specific message", () => {
        expect(() => {
            throw new InvalidEarnedBadgesError();
        }).toThrow("earned_badges must be an array");
    });

    it("should thow an InvalidRequiredBadgesError with a specific message", () => {
        expect(() => {
            throw new InvalidRequiredBadgesError();
        }).toThrow("required_badges must be an array");
    });

    it("should throw an InvalidPasswordError with a specific message", () => {
        expect(() => {
            throw new InvalidPasswordError();
        }).toThrow("password must be a string of at least 8 characters");
    });

    it("should have the correct name for DuplicateUsernameError", () => {
        try {
            throw new DuplicateUsernameError();
        } catch (e) {
            expect(e.name).toBe("DuplicateUsernameError");
        }
    });

    it("should have the correct name for InvalidCompletionStatusError", () => {
        try {
            throw new InvalidCompletionStatusError();
        } catch (e) {
            expect(e.name).toBe("InvalidCompletionStatusError");
        }
    });
});

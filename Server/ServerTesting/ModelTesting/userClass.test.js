const User = require("../../Models/UserClass");
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
} = require("../../Models/UserErrors");


describe("Testing User Class Getters and Setters as well as error states", () => {
    let user;

    beforeEach(() => {
        user = new User({
            _id: "1234",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@test.com",
            membershipNumber: "5678",
            badges: [],
            earned_badges: [],
            password: "password123",
            required_badges: [],
            username: "johndoe"
        });
    });

    it("Should get the first name of the user", () => {
        expect(user.getFirstName()).toEqual("John");
    });

    it("Should get the last name of the user", () => {
        expect(user.getLastName()).toEqual("Doe");
    });

    it("Should get the full name of the user", () => {
        expect(user.getFullName()).toEqual("John Doe");
    });

    it("Should get the email of the user", () => {
        expect(user.getEmail()).toEqual("john.doe@test.com");
    });

    it("Should get the id of the user", () => {
        expect(user.getId()).toEqual("1234");
    });

    it("Should get the membership number of the user", () => {
        expect(user.getMembershipNumber()).toEqual("5678");
    });

    it("Should get the badges of the user", () => {
        expect(user.getBadges()).toEqual([]);
    });

    it("Should get the earned badges of the user", () => {
        expect(user.getEarnedBadges()).toEqual([]);
    });

    it("Should get the username of the user", () => {
        expect(user.getUsername()).toEqual("johndoe");
    });

    it("Should get the required badges of the user", () => {
        expect(user.getRequiredBadges()).toEqual([]);
    });

    it("Should throw an error when setting an invalid first name", () => {
        expect(() => {
            user.firstName = "";
        }).toThrow(InvalidFirstNameError);
    });

    it("Should throw an error when setting an invalid last name", () => {
        expect(() => {
            user.lastName = "";
        }).toThrow(InvalidLastNameError);
    });

    it("Should throw an error when setting an invalid email", () => {
        expect(() => {
            user.email = "invalid";
        }).toThrow(InvalidEmailError);
    });

    it("Should throw an error when setting an invalid membership number", () => {
        expect(() => {
            user.membershipNumber = "";
        }).toThrow(InvalidMembershipNumberError);
    });

    it("Should throw an error when setting an invalid username", () => {
        expect(() => {
            user.username = "";
        }).toThrow(InvalidUsernameError);
    });

    it("should throw an error when setting an invalid badge", () => {
        expect(() => {
            user.badges = "invalid";
        }).toThrow(InvalidBadgesError);
    });

    it("Should throw an error when setting an invalid earned_badges", () => {
        expect(() => {
            user.earned_badges = "invalid";
        }).toThrow(InvalidEarnedBadgesError);
    });

    it("Should throw an error when setting an invalid required_badges", () => {
        expect(() => {
            user.required_badges = "invalid";
        }).toThrow(InvalidRequiredBadgesError);
    });

    it("Should throw an error when setting an invalid password", () => {
        expect(() => {
            user.password = "123";
        }).toThrow(InvalidPasswordError);
    });

    it("Should accept a password of exactly 8 characters", () => {
      expect(() => {
          user.password = "abcd3fgh";
      }).not.toThrow();
  })

    it("Should accept a minimal valid email", () => {
        expect(() => {
            user.email = "a@b.c";
        }).not.toThrow();
    });

    it("Should throw an error when setting earned_badges to a non-array type", () => {
        expect(() => {
            user.earned_badges = 123;
        }).toThrow(InvalidEarnedBadgesError);
        expect(() => {
            user.earned_badges = true;
        }).toThrow(InvalidEarnedBadgesError);
        expect(() => {
            user.earned_badges = {};
        }).toThrow(InvalidEarnedBadgesError);
    });

    it("Should throw an error when setting required_badges to a non-array type", () => {
        expect(() => {
            user.required_badges = 123;
        }).toThrow(InvalidRequiredBadgesError);
        expect(() => {
            user.required_badges = false;
        }).toThrow(InvalidRequiredBadgesError);
        expect(() => {
            user.required_badges = {};
        }).toThrow(InvalidRequiredBadgesError);
    });

    it("Should correctly set and get non-empty earned_badges", () => {
        const badges = ["badge1", "badge2", "badge3"];
        user.earned_badges = badges;
        expect(user.getEarnedBadges()).toEqual(badges);
    });

    it("Should correctly set and get non-empty required_badges", () => {
        const badges = ["badgeA", "badgeB", "badgeC"];
        user.required_badges = badges;
        expect(user.getRequiredBadges()).toEqual(badges);
    });

    it("Should get the id of the user", () => {
        expect(user.getId()).toEqual("1234");
    });

    it("Should get the password of the user", () => {
        expect(user.getPassword()).toEqual("password123");
    });

    it("Should throw an error when setting an invalid password", () => {
        expect(() => {
            user.password = "123";
        }).toThrow(InvalidPasswordError);
    });

    it("Should correctly set the first name when given valid data", () => {
      user.firstName = "Jane";
      expect(user.getFirstName()).toEqual("Jane");
  });
  
  it("Should throw an error when setting a password without a number", () => {
      expect(() => { user.password = "Password"; }).toThrow(InvalidPasswordError);
  });
  
  it("Should throw an error when setting a username to a non-string value", () => {
      expect(() => { user.username = 123; }).toThrow(InvalidUsernameError);
  });

});
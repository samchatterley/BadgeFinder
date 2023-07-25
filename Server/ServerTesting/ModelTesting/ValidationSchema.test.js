const {
    findOneSchema,
    findByIdSchema,
    findByEmailSchema,
    createSchema,
    updateSchema,
    findOneAndUpdateSchema,
    deleteByIdSchema,
    findOneAndUpdateWithOperationsSchema,
    registerUserSchema,
    registerSecondaryUserSchema,
    authenticateUserSchema,
    updateBadgeRequirementSchema,
    removeBadgeSchema,
    addBadgeSchema
} = require("../../Models/ValidationSchema");

describe("ValidationSchema tests", () => {
    it("findOneSchema - valid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@test.com",
            membershipNumber: "5678",
            badges: [],
            earned_badges: [],
            required_badges: [],
            username: "johndoe",
        };
        const {
            error
        } = findOneSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("findOneSchema - invalid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e",
            // Missing firstName
            lastName: "Doe",
            email: "john.doe@test.com",
            membershipNumber: "5678",
            badges: [],
            earned_badges: [],
            required_badges: [],
            username: "johndoe",
        };
        const {
            error
        } = findOneSchema.validate(mockUser);
        expect(error).toBeDefined();
    });

    it("findByIdSchema - valid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e"
        };
        const {
            error
        } = findByIdSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("findByIdSchema - invalid data", () => {
        const mockUser = {};
        const {
            error
        } = findByIdSchema.validate(mockUser);
        expect(error).toBeDefined();
    });

    it("findByEmailSchema - valid data", () => {
        const mockUser = {
            email: "john.doe@test.com"
        };
        const {
            error
        } = findByEmailSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("findByEmailSchema - invalid data", () => {
        const mockUser = {};
        const {
            error
        } = findByEmailSchema.validate(mockUser);
        expect(error).toBeDefined();
    });

    it("createSchema - valid data", () => {
        const mockUser = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@test.com",
            membershipNumber: "5678"
        };
        const {
            error
        } = createSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("createSchema - invalid data", () => {
        const mockUser = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@test.com",
            // Missing membershipNumber
        };
        const {
            error
        } = createSchema.validate(mockUser);
        expect(error).toBeDefined();
    });

    it("updateSchema - valid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@test.com",
            membershipNumber: "5678",
            badges: [],
            earned_badges: [],
            required_badges: [],
            username: "johndoe",
        };
        const {
            error
        } = updateSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("updateSchema - invalid data", () => {
        const mockUser = {
          _id: "1234", 
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@test.com",
          membershipNumber: "5678",
          badges: [],
          earned_badges: [],
          password: "N3p@Qj7e",
          required_badges: [],
          username: "johndoe",
        };
        const { error } = updateSchema.validate(mockUser);
        console.log(mockUser, error);
        expect(error).toBeDefined();
      });
      

    it("findOneAndUpdateSchema - valid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@test.com",
            membershipNumber: "5678",
            badges: [],
            earned_badges: [],
            required_badges: [],
            username: "johndoe",
        };
        const {
            error
        } = findOneAndUpdateSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("findOneAndUpdateSchema - invalid data", () => {
        const mockUser = {
          _id: "1234", 
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@test.com",
          membershipNumber: "5678",
          badges: [],
          earned_badges: [],
          password: "N3p@Qj7e",
          required_badges: [],
          username: "johndoe",
        };
        const { error } = findOneAndUpdateSchema.validate(mockUser);
        console.log(mockUser, error);
        expect(error).toBeDefined();
      });

    it("deleteByIdSchema - valid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e",
        };
        const {
            error
        } = deleteByIdSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("deleteByIdSchema - invalid data", () => {
        const mockUser = {};
        const {
            error
        } = deleteByIdSchema.validate(mockUser);
        expect(error).toBeDefined();
    });

    it("findOneAndUpdateWithOperationsSchema - valid data", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e", // 24 characters long
            operations: {
                $set: {
                    firstName: "Jane",
                },
                $inc: {
                    age: 1,
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeUndefined();
    });

    it("findOneAndUpdateWithOperationsSchema - invalid id", () => {
        const mockData = {
            _id: "1234", // too short
            operations: {
                $set: {
                    firstName: "Jane",
                },
                $inc: {
                    age: 1,
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeDefined();
    });

    it("findOneAndUpdateWithOperationsSchema - invalid operations", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e",
            operations: {
                $set: "Jane", // should be an object
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeDefined();
    });

    it("findOneAndUpdateWithOperationsSchema - operations object contains only $set field", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e",
            operations: {
                $set: {
                    firstName: "Jane",
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeUndefined();
    });

    it("findOneAndUpdateWithOperationsSchema - operations object contains only $push field", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e",
            operations: {
                $push: {
                    badges: "newBadge",
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeUndefined();
    });

    it("findOneAndUpdateWithOperationsSchema - operations object contains only $inc field", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e",
            operations: {
                $inc: {
                    age: 1,
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeUndefined();
    });

    it("findOneAndUpdateWithOperationsSchema - operations object contains only $addToSet field", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e",
            operations: {
                $addToSet: {
                    badges: "newBadge",
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeUndefined();
    });

    it("findOneAndUpdateWithOperationsSchema - operations object contains only $pull field", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e",
            operations: {
                $pull: {
                    badges: "oldBadge",
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeUndefined();
    });

    it("findOneAndUpdateWithOperationsSchema - operations object contains all possible fields", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e",
            operations: {
                $set: {
                    firstName: "Jane",
                },
                $push: {
                    badges: "newBadge",
                },
                $inc: {
                    age: 1,
                },
                $addToSet: {
                    badges: "newBadge",
                },
                $pull: {
                    badges: "oldBadge",
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeUndefined();
    });

    it("findOneAndUpdateWithOperationsSchema - Each field in the operations object has a value of each possible type", () => {
        const mockData = {
            _id: "60d6ec9f1094b39d1328774e",
            operations: {
                $set: {
                    stringField: "Jane",
                    numberField: 123,
                    booleanField: true,
                    arrayField: ["element1", "element2"],
                    objectField: {
                        key: "value"
                    },
                },
            },
        };
        const {
            error
        } = findOneAndUpdateWithOperationsSchema.validate(mockData);
        expect(error).toBeUndefined();
    });

    it("registerUserSchema - valid data", () => {
        const mockUser = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@test.com",
            membershipNumber: "5678"
        };
        const {
            error
        } = registerUserSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("registerUserSchema - invalid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e",
            firstName: "John",
            lastName: "Doe",
            // Missing Email 
            membershipNumber: "5678"
        };
        const {
            error
        } = registerUserSchema.validate(mockUser);
        expect(error).toBeDefined();
        console.log("Error", JSON.stringify({
            ...error
        }));
    });

    it("registerSecondaryUserSchema - valid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e",
            earned_badges: [],
            required_badges: [],
            username: "johndoe",
            password: "password",
        };
        const {
            error
        } = registerSecondaryUserSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("registerSecondaryUserSchema - invalid data", () => {
        const mockUser = {
            _id: "60d6ec9f1094b39d1328774e",
            earned_badges: [],
            required_badges: [],
            // Missing username
            password: "password",
        };
        const {
            error
        } = registerSecondaryUserSchema.validate(mockUser);
        expect(error).toBeDefined();
        console.log("Error", JSON.stringify({
            ...error
        }));
    });

    it("authenticateUserSchema - valid data", () => {
        const mockUser = {
            username: "johndoe",
            password: "password",
        };
        const {
            error
        } = authenticateUserSchema.validate(mockUser);
        expect(error).toBeUndefined();
    });

    it("authenticateUserSchema - invalid data", () => {
        const mockUser = {
            // Missing username
            password: "password",
        };
        const {
            error
        } = authenticateUserSchema.validate(mockUser);
        expect(error).toBeDefined();
        console.log("Error", JSON.stringify({
            ...error
        }));
    });

    it("addBadgeSchema - valid data", () => {
        const mockBadge = {
            userId: "60d6ec9f1094b39d1328774e",
            badgeId: "64527a53b431de7e0e8b1a1e",
        };
        const { error } = addBadgeSchema.validate(mockBadge);
        expect(error).toBeUndefined();
      });
      
    it("addBadgeSchema - invalid data", () => {
        const mockBadge = {
            userId: "1234",
            badgeId: "64527a53b431de7e0e8b1a1e",
        };
        const { error } = addBadgeSchema.validate(mockBadge);
        expect(error).toBeDefined();
        console.log("Error", JSON.stringify({ ...error }));
        });
    
    it("removeBadgeSchema - valid data", () => {
        const mockBadge = {
            userId: "60d6ec9f1094b39d1328774e",
            badgeId: "64527a53b431de7e0e8b1a1e",
        };
        const { error } = removeBadgeSchema.validate(mockBadge);
        expect(error).toBeUndefined();
      });

    it("removeBadgeSchema - invalid data", () => {
        const mockBadge = {
            userId: "1234",
            badgeId: "64527a53b431de7e0e8b1a1e",
        };
        const { error } = removeBadgeSchema.validate(mockBadge);
        expect(error).toBeDefined();
        console.log("Error", JSON.stringify({ ...error }));
        });
    
      it("updateBadgeRequirementSchema - valid data", () => {
        const mockBadge = {
            userId: "60d6ec9f1094b39d1328774e",
            badgeId: "64527a53b431de7e0e8b1a1e",
        };
        const mockRequirement = {
            ...mockBadge,
            requirementId: "643fcd86eee6843daca02b1c",
            completed: true,
        };
        const { error } = updateBadgeRequirementSchema.validate(mockRequirement);
        expect(error).toBeUndefined();
      });

    it("updateBadgeRequirementSchema - invalid data", () => {
        const mockBadge = {
            userId: "1234",
            badgeId: "64527a53b431de7e0e8b1a1e",
        };
        const mockRequirement = {
            ...mockBadge,
            requirementId: "643fcd86eee6843daca02b1c",
            completed: true,
        };
        const { error } = updateBadgeRequirementSchema.validate(mockRequirement);
        expect(error).toBeDefined();
        console.log("Error", JSON.stringify({ ...error }));
        });
});
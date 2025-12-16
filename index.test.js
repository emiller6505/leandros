import { ObjectSchema } from ".";

describe("ObjectSchema tests", () => {
  const validAddress = {
    street: "123 Main St.",
    city: "Southtown",
    state: "Georgia",
    country: "USA"
  };

  const otherValidPerson = {
    firstName: "Jane",
    lastName: "Doe",
    address: validAddress,
  }

  const validPerson = {
    firstName: "Joe",
    lastName: "Schmoe",
    address: validAddress,
    friends: [
      otherValidPerson
    ]
  };

  const AddressSchema = new ObjectSchema({
    street: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    country: { type: "string" }
  }, "Address");

  const PersonSchema = new ObjectSchema({
    firstName: { type: "string" },
    lastName: { type: "string" },
    address: { type: "object:ObjectSchema", schema: AddressSchema },
    friends: { type: "array:self" }
  }, "Person");

  it("Validates a valid person and their address successfully", () => {
    expect(PersonSchema.validate(validPerson)).toBe(true);
  });
})
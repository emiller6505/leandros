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

  const validBook = {
  name: "The Fellowship of the Ring",
  pages: 423,
  author: "J.R.R. Tolkien",
  price: 30,
  allSequels: [
    {
      name: "The Two Towers",
      pages: 352,
      author: "J.R.R. Tolkien",
      price: 30
    },
    {
      name: "The Return of the King",
      pages: 416,
      author: "J.R.R. Tolkien",
      price: 30
    }
  ],
  directSequel: {
    name: "The Two Towers",
    pages: 352,
    author: "J.R.R. Tolkien",
    price: 30,
    directSequel: {
      name: "The Return of the King",
      pages: 416,
      author: "J.R.R. Tolkien",
      price: 30
    }
  },
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

  const BookSchema = new ObjectSchema({
    name: { type: "string" },
    pages: { type: "number" },
    author: { type: "string" },
    price: { type: "number" },
    allSequels: { type: "array:self" },
    directSequel: { type: "object:self" }
}, "Book");

  it("Validates a valid schema and with a nested other schema", () => {
    expect(PersonSchema.validate(validPerson)).toBe(true);
  });

  it("Validates a valid schema with a nested self-referential schema", () => {
    expect(BookSchema.validate(validBook)).toBe(true);
  });

  it("Throws an error if schema contains unsupported type", () => {
    let result;
    try {
      const BadSchema = new ObjectSchema({
        something: {type: "fake"}
      }, "Fake");
    } catch (err) {
      result = err;
    }
    expect(result.message).toEqual(`Schema key something.type must be 'number', 'string', 'boolean', 'object', 'array', 
          'object:self', 'object:ObjectSchema', 'array:self', 'array:object', or 'array:ObjectSchema'. 
          Received: fake`)
  })
})
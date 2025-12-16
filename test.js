import { ObjectSchema } from "./index.js";

console.log("Beginning Leandros test...")

// init test variables
const book = {
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

const address = {
  street: "123 Main St.",
  city: "Southtown",
  state: "Georgia",
  country: "USA"
};

const person = {
  firstName: "Joe",
  lastName: "Schmoe",
  address,
};

try {
  const BookSchema = new ObjectSchema({
    name: { type: "string" },
    pages: { type: "number" },
    author: { type: "string" },
    price: { type: "number" },
    allSequels: { type: "array:self" },
    directSequel: { type: "object:self" }
  }, "Book");
  const validIsValid = BookSchema.validate(book);

  const AddressSchema = new ObjectSchema({
    street: "string",
    city: "string",
    state: "string",
    country: "string"
  }, "Address");

  const PersonSchema = new ObjectSchema({
    firstName: "string",
    lastName: "string",
    address: AddressSchema,
  }, "Person");

  PersonSchema.validate(person);
  if (validIsValid === true) {
    console.log("TEST PASSED: schema with self-referential array and object is working correctly.")
  }
} catch (err) {
  console.error("TEST FAILURE: valid schema failed. Error message: ", err.message);
}
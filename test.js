import { ObjectSchema } from "./index.js";

console.log("Beginning Leandros test...")

// init test variables
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

const address = {
  street: "123 Main St.",
  city: "Southtown",
  state: "Georgia",
  country: "USA"
};

const otherPerson = {
  firstName: "Jane",
  lastName: "Doe",
  address,
}

const person = {
  firstName: "Joe",
  lastName: "Schmoe",
  address,
  friends: [
    otherPerson
  ]
};


const BookSchema = new ObjectSchema({
  name: { type: "string" },
  pages: { type: "number" },
  author: { type: "string" },
  price: { type: "number" },
  allSequels: { type: "array:self" },
  directSequel: { type: "object:self" }
}, "Book");
const bookIsValid = BookSchema.validate(validBook);

if(bookIsValid) {
  console.log("TEST PASSED: book validated.");
}

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

const personIsValid = PersonSchema.validate(person);
if (personIsValid === true) {
  console.log("TEST PASSED: person and address validated.")
}


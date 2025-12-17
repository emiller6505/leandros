# leandros
A simple JSON validator.

# Example Usage

```
import {ObjectSchema} from 'leandros';

const TestSchema = new ObjectSchema({property: {type: "string"}}, "TestSchema");

TestSchema.validate({property: "yes"});

console.log(
  TestSchema.validate({property: "yes"})
); // true

const NestedSelfSchema = new ObjectSchema({
  a: {type: "string"},
  b: {type: "number"},
  c: {type: "object:self"}
}, "NestSchema");

const nested = {
  a: "1",
  b: 2,
  c: {
    a: "3",
    b: 4
  }
};

console.log(NestedSelfSchema.validate(nested)); // true
```
const SpecializedTypes = [
  "array:ObjectSchema", // for other nested ObjectSchema instances
  "object:ObjectSchema", // for other nested ObjectSchema instances
];

const SchemaTypes = [
  "number",
  "string",
  "boolean",
  "array:number",
  "array:string",
  "array:boolean",
  "array:object",
  "object",
  "array:self", // allows for self-referential recursion
  "object:self", // allows for self-referential recursion
  ...SpecializedTypes
];

export class ObjectSchema {
  /***
  * @constructor
  * @param {object} schema: {strict?: boolean = false, [key: string]: {type: string, required?: boolean = false, schema?: ObjectSchema}}
  * @param {string} name
  */
  constructor(schema, name) {
    if (!name) {
      throw new Error("Error: please provide a name for this schema.");
    }
    if (schema.strict !== undefined && typeof schema.strict !== 'boolean') {
      throw new Error(`Error: non-boolean value received for 'strict' property. Please provide true, false, or undefined. Received: ${schema.strict}`)
    }
    Object.keys(schema).forEach(key => {
      if (!SchemaTypes.includes(schema[key].type)) {
        throw new Error(
          `Schema key ${key}.type must be 'number', 'string', 'boolean', 'object', 'array', 
          'object:self', 'object:ObjectSchema', 'array:self', 'array:object', or 'array:ObjectSchema'. 
          Received: ${schema[key]}`
        );
      }
      if (
        SpecializedTypes.includes(schema[key].type) &&
        (
          schema[key].schema === undefined ||
          !(schema[key].schema instanceof ObjectSchema)
        )
      ) {
        throw new Error(`Schema key ${key} has type ${schema[key].type} which requires its own schema property.`)
      }
    });
    this.name = name;
    this.schema = schema;
  }

  /***
    * Validates that a provided object matches this schema instance.
    * @param {object} obj
    */
  validate(obj) {
    /***
     * Cases to cover:
     * 1. schema set to strict and not all the properties are there in the obj. check
     * 2. existing properties in the obj match the types in the schema
     * 3. recursive calls to nested schemas
     */

    const errorText = `LEANDROS: 'ERROR: The provided object shows signs of corruption and must be sanctified.`;

    Object.keys(this.schema).forEach(schemaKey => {
      if (obj[schemaKey] === undefined && this.schema.strict === true) {
        throw new Error(
          `${errorText} Property ${schemaKey} is required for schema ${this.name}. 
            Received: \n${JSON.stringify(obj)}`
        )
      } else if (SpecializedTypes.includes(this.schema[schemaKey].type)) {
        // handle nested ObjectSchemas
        this.schema[schemaKey].schema.validate(obj[schemaKey]);
      } else if (this.schema[schemaKey].type.includes(":self")) {
        // handle self-referential arrays and objects
        if (Array.isArray(obj[schemaKey])) {
          // it's an array of the same time, so do a loop
          obj[schemaKey].forEach(item => {
            this.validate(item);
          })
        } else {
          // it's an object, so just do the one
          this.validate(obj[schemaKey]);
        }
      } else if (this.schema[schemaKey].type.includes("array:" && Array.isArray(obj[schemaKey]))) {
        // handle array of regular types: string, number, boolean, or object
        // NOTE: this class does not process nested arrays. An array must be an array of a specific non-array type.
        const typeString = this.schema[schemaKey].type.split(":"[1]);
        obj[schemaKey].forEach(item => {
          if (Array.isArray(item)) {
            throw new Error(`${errorText} Received an array of arrays for property ${schemaKey} with schema ${this.name}. 
              Nested arrays are not supported at this time.`);
          }
          if (typeof item !== typeString) {
            throw new Error(
              `${errorText} Property ${schemaKey} should be an array of type ${typeString} for schema ${this.name}, 
                but one or more array values were of type ${typeof obj[schemaKey]}.`
            )
          }
        });
      } else {
        // handle primitives
        if (typeof obj[schemaKey] !== this.schema[schemaKey].type) {
          throw new Error(
            `${errorText} Property ${schemaKey} should be of type ${this.schema[schemaKey].type} for schema ${this.name}; received ${typeof obj[schemaKey]}`
          );
        }
      }
    });
    return true;
  };
};

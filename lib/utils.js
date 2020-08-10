import pluralize from 'pluralize';
import camelCase from 'camelcase';

/**
 * 
 * @param {String} typeName the typeName in the graphql schema 
 * @param {Map} fields the fields that the grapqhl type has
 * @param {Boolean} withInputs does the type need input
 * @param {Map} inputsFields the fields that are required from an input that is of typeName 
 * this is optional, if not provided, the package will return a input filed of the same type
 * not containing the ID field.
 * 
 * @returns a graphql mergable string that you can merge into your main type-defs files
 */
export const type=(typeName, fields= {}, withInputs = false, inputsFields= null) => {
  if(withInputs) {
    return typeWithInputs(typeName, fields, inputsFields);
  }

  const fieldPairs = Object.keys(fields).map(k => [k, fields[k]]);

  const typeSchema = `type ${typeName} {
    ${fieldPairs.map(([field, type]) => `${field}: ${type}`).join('\n\t')}
  }`;

  return `
    ${typeSchema}
  `;
}

/**
 * 
 * @param {String} typeName the typeName in the graphql schema 
 * @param {Map} fields the fields that the grapqhl type has
 * @param {Map} inputsFields the fields that are required from an input that is of typeName 
 * this is optional, if not provided, the package will return a input filed of the same type
 * not containing the ID field.
 * 
 * @returns a graphql mergable string that you can merge into your main type-defs files
 */
const typeWithInputs = (typeName, fields = {}, inputsFields = null) => {
  const fieldPairs = Object.keys(fields).map(k => [k, fields[k]]);

  const inputsFieldsPair = !inputsFields
    ? fieldPairs.filter(([_, type]) => type !== 'ID!')
    : Object.entries(inputsFields);

  const typeSchema = `type ${typeName} {
    ${fieldPairs.map(([field, type]) => `${field}: ${type}`).join('\n\t')}
  }`;

  const inputNewSchema = `input ${typeName}New {
    ${inputsFieldsPair.map(([field, type]) => `${field}: ${type}`).join('\n\t')}
  }`;

  const inputUpdateSchema = `input ${typeName}Update {
    ${inputsFieldsPair
      .map(([field, type]) => `${field}: ${type.replace(/!$/i, '')}`)
      .join('\n\t')}
  }`;

  return `
  ${typeSchema}
  ${inputNewSchema}
  ${inputUpdateSchema}
  `;
};

const createPaginatedTypeWithInputs = () => {
  const types = new Set();

  return {
    typeWithInputs(typeName, fields = {}, inputsFields = null) {
      types.add(typeName);
      return typeWithInputs(typeName, fields, inputsFields);
    },
    paginationType(typeName = 'Pageable', otherTypes = []) {
      if (types.size === 0) return '';

      return `
      union AnyType = ${[...types, ...otherTypes].join(' | ')}
      type ${typeName} {
        data: [AnyType!]!
        total: Int!
      }
      `;
    },
  };
};

/**
 * 
 * @param {String} typeName the schema name;
 * @returns { String } a graphql mergable string that you can merge into your main type-defs files
 * @example for a user typeName, the returend string will be, createUser, updateUser, deleteUser
 */
export const crudOf = typeName => {
  const Type = camelCase(typeName, {
    pascalCase: true,
  });

  return `
    create${Type}(data: ${Type}New): ${Type}!

    update${Type}(id: ID!, data: ${Type}Update): Boolean!

    delete${Type}(id: ID!): Boolean!
  `;
};
export const pluralOf = type => {
  return pluralize(type);
};

export const pascalCaseOf = type => {
  return camelCase(type, {
    pascalCase: true,
  });
};


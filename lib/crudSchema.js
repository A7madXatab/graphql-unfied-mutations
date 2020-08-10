import gql from 'graphql-tag';
import { pascalCaseOf } from './utils';

/**
 *
 * @param {String} schema
 * @param {String} fields
 * 
 * @description
 * this function is entended to be used with the front end code only!,
 * do not use with backend code, if you want backend code use the other
 * functions provided by the library.
 * 
 */
export const crudSchemaOf = (schema, fields) => {
  const Type = pascalCaseOf(schema);

  const addMutation = gql`
  mutation CreateMutation($data: ${Type}New){
      create${Type}(data: $data) {
          ${fields}
      }
  }
`;


  const updateMutation = gql`
  mutation updateMutation($id: ID!, $data: ${Type}Update) {
      update${Type}(id: $id, data: $data) 
  }
`;

  const deleteItem = gql`
  mutation DeleteMutation($id: ID!){
      delete${Type}(id: $id)
  }
`;

  return {
    add: addMutation,
    delete: deleteItem,
    update: updateMutation,
  };
};

## a set of utility functions to make your graphql mutations have the same signature.

# Installation

using npm

```
npm install graphql-unified-mutations
```

or yarn

```
yarn add graphql-unified-mutations
```

# usage


```
//type-defs.js

import { type } from "graphql-unified-mutations";

const typeDefs = gql`

  ${type('SellPrice', {
      id: 'ID!',
      name: 'String!',
      value: 'Float!',
      currencyId: 'String!',
      productBatchId: 'String!',
  })}

  ${type('User', {
    email: 'String!',
    fullName: 'String!',
    password: 'String!',
    role: 'String!',
  }, true)} // true indicates that we need input types for this type

  ${type('Currency', {
    id: 'ID!',
    name: 'String!',
    multiplier: 'Float!',
    isBase: ' Boolean!',
  }, false, {
    name: 'String!',
    multiplier: 'Float!',
  })} // the third parameter is that we explictly define our required keys for the update
 
`
```

will yeild the following graphql schema

```

type SellPrice {
    id: 'ID!',
    name: 'String!',
    value: 'Float!',
    currencyId: 'String!',
    productBatchId: 'String!',
}

type User {
    id: 'ID',
    email: 'String!',
    fullName: 'String!',
    password: 'String!',
    role: 'String!',
}

input UserNew {
    email: 'String!',
    fullName: 'String!',
    password: 'String!',
    role: 'String!',
}

input UserUpdate {
    email: 'String!',
    fullName: 'String!',
    password: 'String!',
    role: 'String!',
}

type Currency {
    id: 'ID!',
    name: 'String!',
    multiplier: 'Float!',
    isBase: 'Boolean!',
}

input CurrencyNew {
    name: 'String!',
    multiplier: 'Float!',
}

input CurrencyUpdate {
    name: 'String!',
    multiplier: 'Float!',
}

```
## Creating mutations for the type
you dont have to manually write the mutations for each type, that's cumbersome and no one wants to do it,
let the package do the heavy lifting for you, here is how

having this call to  `type`

```
 ${type('User', {
    email: 'String!',
    fullName: 'String!',
    password: 'String!',
    role: 'String!',
  }, true)} // t
```
to get the mutations for this type, you can use the `crudOf` function.

```
//type-defs.

import { crudOf } from "graphql-unified-mutations"

type Mutation {
  ${crudOf('user')}
}
```

the casing dose not matter since the function will **CamelCase** the types according to Graphql standards.


## using in the front end code

to use the graphql endpoints created by this library, use the `crudSchemaOf` function.
which will return graphql dynamic mutations that are ready to be used and called

```
import { crudSchemaOf } from "./graphql-unified-mutations";

const mutations = crudSchemaOf('user'); // will return the create, delete, and update mutations for this schema

```

#### an example of add mutation

```
const mutations = crudSchemaOf('user', `id name email role`);

client
    .mutate({
        mutation.add,
        variables: {
        data: entity,
        },
    })
    .then(({ data }) => console.log(data))
    .catch(err => console.log(err));

```
#### an example of update mutation

```
const mutations = crudSchemaOf('user', `id name email role`);

    return client
      .mutate({
        mutations.update,
        variables: {
          id,
          data,
        },
      })
      .then(({ data }) => console.log(data))
      .catch(err => console.log(err));

```
#### an example of delete mutation

```
const mutations = crudSchemaOf('user', `id name email role`);

client
    .mutate({
    mutations.delete,
    variables: {
        id,
    },
    })
    .then(({ data }) => console.log(data))
    .catch(err => console.log(err));

```

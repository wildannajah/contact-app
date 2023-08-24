import { gql } from '@apollo/client'

export const GET_CONTACT_LIST = gql`
  query GetContactList(
    $distinct_on: [contact_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [contact_order_by!]
    $where_favorit: contact_bool_exp
    $where_regular: contact_bool_exp
  ) {
    favorit: contact(distinct_on: $distinct_on, order_by: $order_by, where: $where_favorit) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
    regular: contact(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where_regular
    ) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`
export const DELETE_CONTACT = gql`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`

export const CREATE_CONTACT = gql`
  mutation AddContactWithPhones(
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: { first_name: $first_name, last_name: $last_name, phones: { data: $phones } }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`
export const DETAIL_CONTACT = gql`
  query GetContactDetail($id: Int!) {
    contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`

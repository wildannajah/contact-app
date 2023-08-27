export interface ContactList {
  favorit: Contact[]
  regular: Contact[]
  contact_aggregate: ContactAggregate
}

export interface Contact {
  created_at: string
  first_name: string
  id: number
  last_name: string
  phones: Phone[]
}

export interface Phone {
  number: string
}
export interface InitialStateContact {
  first_name: string
  id: number | null
  last_name: string
  phones: Phone[]
}

export interface EditData {
  update_contact_by_pk: UpdateContactByPk
}

export interface UpdateContactByPk {
  id: number
  first_name: string
  last_name: string
  phones: Phone[]
}

export interface AddContactWithPhones {
  insert_phone: InsertPhone
}

export interface InsertPhone {
  returning: Returning[]
}

export interface Returning {
  contact: Contact
}
export interface EditPhone {
  update_phone_by_pk: UpdatePhoneByPk
}

export interface UpdatePhoneByPk {
  contact: Contact
}
export interface DeletePhone {
  delete_phone_by_pk: DeletePhoneByPk
}

export interface DeletePhoneByPk {
  contact: Contact
}
export interface ContactAggregate {
  aggregate: Aggregate
}

export interface Aggregate {
  count: number
}

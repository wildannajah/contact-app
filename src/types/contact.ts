export interface ContactList {
  favorit: Contact[]
  regular: Contact[]
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

export interface ContactList {
  favorit: Favorit[]
  regular: Regular[]
}

export interface Favorit {
  created_at: string
  first_name: string
  id: number
  last_name: string
  phones: Phone[]
}

export interface Regular {
  created_at: string
  first_name: string
  id: number
  last_name: string
  phones: Phone[]
}

export interface Phone {
  number: string
}

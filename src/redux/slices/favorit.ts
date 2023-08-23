import { type favoritState } from '@/types/favorit'
import { createSlice } from '@reduxjs/toolkit'
import { dispatch } from '../store'
import { type Contact } from '@/types/contact'

const initialState: favoritState = {
  contacts: []
}

const slice = createSlice({
  name: 'favorit',
  initialState,
  reducers: {
    addFavorit(state, action) {
      const favorit = action.payload
      state.contacts = [...state.contacts, favorit]
    },
    deleteFavorit(state, action) {
      const favoritToRemove = action.payload
      state.contacts = state.contacts.filter((item) => item.id !== favoritToRemove.id)
    }
  }
})

export default slice.reducer

export const { addFavorit } = slice.actions

export function deleteFavorit(contact: Contact) {
  return dispatch(slice.actions.deleteFavorit(contact))
}

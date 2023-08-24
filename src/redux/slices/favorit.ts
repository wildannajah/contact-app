import { type favoritState } from '@/types/favorit'
import { createSlice } from '@reduxjs/toolkit'
import { dispatch } from '../store'

const initialState: favoritState = {
  contactIds: []
}

const slice = createSlice({
  name: 'favorit',
  initialState,
  reducers: {
    addFavorit(state, action) {
      const favorit = action.payload
      state.contactIds = [...state.contactIds, favorit]
    },
    deleteFavorit(state, action) {
      const favoritToRemove = action.payload
      state.contactIds = state.contactIds.filter((item) => item !== favoritToRemove)
    }
  }
})

export default slice.reducer

export const { addFavorit } = slice.actions

export function deleteFavorit(contact: number) {
  return dispatch(slice.actions.deleteFavorit(contact))
}

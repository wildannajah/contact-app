import { type InitialStateContact } from '@/types/contact'
import { createSlice } from '@reduxjs/toolkit'

const initialState: InitialStateContact = {
  id: null,
  first_name: '',
  last_name: '',
  phones: [{ number: '' }]
}

const slice = createSlice({
  name: 'favorit',
  initialState,
  reducers: {
    setCurrentContact(state, action) {
      const contact = action.payload
      state.id = contact.id
      state.first_name = contact.first_name
      state.last_name = contact.last_name
      state.phones = contact.phones
    },
    resetCurrentContact(state) {
      state.id = null
      state.first_name = ''
      state.last_name = ''
      state.phones = [{ number: '' }]
    }
  }
})

export default slice.reducer

export const { setCurrentContact, resetCurrentContact } = slice.actions

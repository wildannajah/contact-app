/* eslint-disable @typescript-eslint/no-unused-vars */
import { DELETE_CONTACT, GET_CONTACT_LIST } from '@/query'
import { addFavorit, deleteFavorit } from '@/redux/slices/favorit'
import { useDispatch } from '@/redux/store'
import { type Contact } from '@/types/contact'
import { useMutation } from '@apollo/client'
import Modal from 'react-modal'
import FormContact from './form-contact'
import { useState } from 'react'

interface ContactCardProps {
  contact: Contact
  favorit: boolean
}

export default function ContactCard({ contact, favorit }: ContactCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [deleteContact, { data, loading, error }] = useMutation(DELETE_CONTACT, {
    refetchQueries: [GET_CONTACT_LIST]
  })
  const dispatch = useDispatch()
  const handleAddFavorit = (contact: number) => {
    try {
      dispatch(addFavorit(contact))
    } catch (error) {
      console.error('Error adding favorit:', error)
    }
  }
  const handleDeleteFavorit = (contact: number) => {
    try {
      dispatch(deleteFavorit(contact))
    } catch (error) {
      console.error('Error deleting favorit:', error)
    }
  }

  if (loading) return <p>Loading...</p>

  if (error != null) return <p>Error: {error.message}</p>

  const { id, first_name, last_name } = contact
  return (
    <div>
      {id}
      {first_name},{last_name}
      <button
        onClick={() => {
          favorit ? handleDeleteFavorit(id) : handleAddFavorit(id)
        }}
      >
        {favorit ? 'remove' : 'add'}
      </button>
      <button
        onClick={() => {
          setShowModal((prevState) => !prevState)
        }}
      >
        edit
      </button>
      <button onClick={async () => await deleteContact({ variables: { id } })}>delete</button>
      <Modal
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false)
        }}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        <FormContact id={id} />
      </Modal>
    </div>
  )
}

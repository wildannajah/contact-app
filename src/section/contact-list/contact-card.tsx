/* eslint-disable @typescript-eslint/no-unused-vars */
import { DELETE_CONTACT, GET_CONTACT_LIST } from '@/query'
import { addFavorit, deleteFavorit } from '@/redux/slices/favorit'
import { useDispatch } from '@/redux/store'
import { type Contact } from '@/types/contact'
import { useMutation } from '@apollo/client'
import Modal from 'react-modal'
import { useState } from 'react'
import { Avatar, Stack, Typography } from '@mui/material'
import Iconify from '@/components/Iconify'
import FormContainer from './form-container'
import { setCurrentContact } from '@/redux/slices/current-contact'

interface ContactCardProps {
  contact: Contact
  favorit: boolean
  setFormContract: any
}

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name[0].toUpperCase()}`
  }
}

export default function ContactCard({ contact, favorit, setFormContract }: ContactCardProps) {
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
  const handleCurrentContact = () => {
    try {
      dispatch(setCurrentContact(contact))
      setFormContract(true)
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

  const { id, first_name, last_name, phones } = contact
  return (
    <Stack spacing={1} display={'flex'} direction="row">
      <Avatar {...stringAvatar(`${first_name} ${last_name}`)} />
      <Stack width={'100%'}>
        <Stack justifyContent={'space-between'} display={'flex'} direction={'row'} width={'100%'}>
          <Typography variant="body1" alignItems={'center'} display={'flex'}>
            {first_name} {last_name}
          </Typography>
        </Stack>
        <Stack justifyContent={'space-between'} display={'flex'} direction={'row'} width={'100%'}>
          <Typography variant="body2">{phones[0]?.number}</Typography>
          <Stack direction={'row'}>
            <Typography variant="body2">
              <Iconify
                icon={favorit ? 'ic:baseline-star' : 'ic:baseline-star-border'}
                onClick={() => {
                  favorit ? handleDeleteFavorit(id) : handleAddFavorit(id)
                }}
              />
            </Typography>
            <Typography variant="body2">
              <Iconify
                icon={'ic:baseline-edit'}
                onClick={() => {
                  handleCurrentContact()
                }}
              />
            </Typography>
            <Typography variant="body2">
              <Iconify
                icon={'ic:baseline-delete'}
                onClick={async () => await deleteContact({ variables: { id } })}
              />
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack display={'none'}>
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
      </Stack>
    </Stack>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { DELETE_CONTACT, GET_CONTACT_LIST } from '@/query'
import { addFavorit, deleteFavorit } from '@/redux/slices/favorit'
import { useDispatch } from '@/redux/store'
import { type Contact } from '@/types/contact'
import { useMutation } from '@apollo/client'
import Modal from 'react-modal'
import { useState } from 'react'
import { Avatar, Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
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
  const { id, first_name, last_name, phones } = contact
  const [showModal, setShowModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [deleteContact, { data, loading, error }] = useMutation(DELETE_CONTACT, {
    refetchQueries: [GET_CONTACT_LIST]
  })
  const dispatch = useDispatch()
  const handleAddFavorit = () => {
    try {
      dispatch(addFavorit(id))
    } catch (error) {
      console.error('Error adding favorit:', error)
    }
  }
  const handleDeleteFavorit = () => {
    try {
      dispatch(deleteFavorit(id))
    } catch (error) {
      console.error('Error deleting favorit:', error)
    }
  }
  const handleEditContact = () => {
    try {
      dispatch(setCurrentContact(contact))
      setFormContract(true)
    } catch (error) {
      console.error('Error adding favorit:', error)
    }
  }
  const handleDeleteContact = async () => {
    try {
      await deleteContact({ variables: { id } })
    } catch (error) {
      console.error('Error adding favorit:', error)
    }
  }

  if (loading) return <p>Loading...</p>

  if (error != null) return <p>Error: {error.message}</p>

  const options = [
    {
      label: favorit ? 'Remove Favorit' : 'Add Favorit',
      onClick: favorit ? handleDeleteFavorit : handleAddFavorit
    },
    {
      label: 'Edit Contact',
      onClick: handleEditContact
    },
    {
      label: 'Delete Contact',
      onClick: handleDeleteContact
    }
  ]

  const ITEM_HEIGHT = 48
  return (
    <Stack spacing={1} display={'flex'} direction="row">
      <Avatar {...stringAvatar(`${first_name} ${last_name}`)} />
      <Stack justifyContent={'space-between'} display={'flex'} direction={'row'} width={'100%'}>
        <Box>
          <Typography variant="body1" alignItems={'center'} display={'flex'}>
            {first_name} {last_name}
          </Typography>
          <Typography variant="body2">{phones[0]?.number}</Typography>
        </Box>
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Iconify icon={'ic:baseline-more-vert'}></Iconify>
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button'
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch'
              }
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.label} onClick={option.onClick}>
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Stack>
      <Stack width={'100%'} display={'none'}>
        <Stack justifyContent={'space-between'} display={'flex'} direction={'row'} width={'100%'}>
          <Typography variant="body1" alignItems={'center'} display={'flex'}>
            {first_name} {last_name}
          </Typography>
        </Stack>
        <Stack justifyContent={'space-between'} display={'flex'} direction={'row'} width={'100%'}>
          <Typography variant="body2">{phones[0]?.number}</Typography>
          <div>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <Iconify icon={'ic:baseline-delete'}></Iconify>
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch'
                }
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.label} onClick={option.onClick}>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Stack>
      </Stack>
    </Stack>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { DETAIL_CONTACT } from '@/query'
import { useQuery } from '@apollo/client'
import ContactForm from './contact-form'
import Iconify from '@/components/Iconify'
import { Box, Stack, IconButton, Typography } from '@mui/material'
import { useDispatch, useSelector } from '@/redux/store'
import { resetCurrentContact } from '@/redux/slices/current-contact'

interface FormContactProps {
  setFormContract?: any
}
export default function FormContainer({ setFormContract }: FormContactProps) {
  const data = useSelector((state) => state.currentContact)
  const dispatch = useDispatch()
  const handleClose = () => {
    try {
      dispatch(resetCurrentContact())
      setFormContract(false)
    } catch (error) {
      console.error('Error adding favorit:', error)
    }
  }
  return (
    <div>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Stack
          direction={'row'}
          spacing={1}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <IconButton
            onClick={() => {
              handleClose()
            }}
          >
            <Iconify icon={'ic:baseline-close'} />
          </IconButton>
          <Typography>{data.id !== null ? 'Edit Contact' : 'Create Contact'}</Typography>
        </Stack>
        <IconButton>
          <Iconify icon={'ic:baseline-check'} />
        </IconButton>
      </Box>
      <Box justifyContent={'center'} display={'flex'}>
        <Iconify icon={'fluent:person-circle-28-regular'} fontSize={'100px'} />
      </Box>
      <ContactForm contact={data} />
    </div>
  )
}

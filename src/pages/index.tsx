/* eslint-disable multiline-ternary */
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { GET_CONTACT_LIST } from '@/query'
import { useQuery } from '@apollo/client'
import { type ContactList } from '@/types/contact'
import { useDispatch, useSelector } from '@/redux/store'
import { useEffect, useState } from 'react'
import ContactCard from '@/section/contact-list/contact-card'
import {
  Alert,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  Typography
} from '@mui/material'
import FormContainer from '@/section/contact-list/form-container'
import usePagination from '@/hooks/usePagination'
import useResponsive from '@/hooks/useResponsive'
import Iconify from '@/components/Iconify'
import { resetCurrentContact } from '@/redux/slices/current-contact'
import FormProvider from '@/components/hook-form/FormProvider'
import { useForm } from 'react-hook-form'
import { RHFTextField } from '@/components/hook-form'

const inter = Inter({ subsets: ['latin'] })
interface FormValuesProps {
  search: string
  afterSubmit?: string
}
export default function Home() {
  const dispatch = useDispatch()
  const isDesktop = useResponsive('up', 'md')
  const [value, setValue] = useState<string>('')
  const [formContract, setFormContract] = useState(false)
  const favoritIds = useSelector((state) => state.favorit.contactIds)
  const { page, onChangePage } = usePagination()
  const contactConditions = {
    _or: [
      { first_name: { _ilike: `%${value}%` } },
      { last_name: { _ilike: `%${value}%` } },
      { phones: { number: { _ilike: `%${value}%` } } }
    ]
  }

  const favoriteContactConditions = {
    ...contactConditions,
    id: { _in: favoritIds }
  }

  const regularContactConditions = {
    ...contactConditions,
    id: { _nin: favoritIds }
  }
  const { loading, error, data, refetch } = useQuery<ContactList>(GET_CONTACT_LIST, {
    variables: {
      limit: 10,
      offset: 10 * (page - 1),
      order_by: { created_at: 'asc' },
      where_favorit: favoriteContactConditions,
      where_regular: regularContactConditions
    },
    notifyOnNetworkStatusChange: true
  })

  useEffect(() => {
    const refetching = async () => {
      try {
        await refetch()
      } catch (error) {
        console.error('Error refetching:', error)
      }
    }
    void refetching()
  }, [error, favoritIds, refetch])
  const methods = useForm<FormValuesProps>()

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = methods

  const onSubmit = async (data: FormValuesProps) => {
    try {
      setValue(data.search)
    } catch (error: any) {
      reset()

      setError('afterSubmit', { ...error, message: error.message })
    }
  }

  if (loading) return <p>Loading...</p>

  if (error != null) return <p>Error: {error.message}</p>

  const { favorit, regular, contact_aggregate } = data ?? { favorit: [], regular: [] }
  const count = contact_aggregate?.aggregate.count ?? 10
  if (formContract && isDesktop === false) {
    return (
      <Stack padding={1}>
        <FormContainer setFormContract={setFormContract} />
      </Stack>
    )
  }
  const ContactList = () => {
    return (
      <Stack spacing={1} padding={2} position={'relative'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant="h5" fontWeight={'light'}>
            Contacts
          </Typography>
          <IconButton
            onClick={() => {
              dispatch(resetCurrentContact())
              setFormContract(true)
            }}
          >
            <Iconify icon={'ei:plus'} fontSize={30} />
          </IconButton>
        </Stack>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {!(errors.afterSubmit == null) && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}
          <RHFTextField
            name="search"
            placeholder="Search"
            type="text"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" type="submit">
                    <Iconify icon="bx:search" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </FormProvider>
        <Stack spacing={1}>
          <Typography>Favorit</Typography>
          {favorit.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              favorit
              setFormContract={setFormContract}
            />
          ))}
          <Typography>Regular</Typography>
          {regular.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              favorit={false}
              setFormContract={setFormContract}
            />
          ))}
        </Stack>
        <Stack display={'flex'} alignItems={'center'} width={'100%'}>
          <Pagination
            defaultPage={page}
            count={Math.ceil(count / 10)}
            variant="outlined"
            shape="rounded"
            onChange={onChangePage}
          />
        </Stack>
      </Stack>
    )
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${inter.className}`}>
        <Grid container>
          <Grid item xs={12} md={4}>
            <ContactList />
          </Grid>
          {isDesktop === true && formContract ? (
            <Grid item md={8}>
              <Stack padding={1}>
                <FormContainer setFormContract={setFormContract} />
              </Stack>
            </Grid>
          ) : undefined}
        </Grid>
      </main>
    </>
  )
}

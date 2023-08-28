import Head from 'next/head'
import { Inter } from 'next/font/google'
import { GET_CONTACT_LIST } from '@/query'
import { useQuery } from '@apollo/client'
import { type ContactList } from '@/types/contact'
import { useSelector } from '@/redux/store'
import { type ChangeEvent, useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import ContactCard from '@/section/contact-list/contact-card'
import { Button, Pagination, Stack, TextField, Typography } from '@mui/material'
import FormContainer from '@/section/contact-list/form-container'
import usePagination from '@/hooks/usePagination'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [value, setValue] = useState<string>('')
  const [formContract, setFormContract] = useState(false)
  const debouncedValue = useDebounce<string>(value, 1000)
  const favoritIds = useSelector((state) => state.favorit.contactIds)
  // const [page, setPage] = useState(1)
  const { page, onChangePage } = usePagination()
  const contactConditions = {
    _or: [
      { first_name: { _ilike: `%${debouncedValue}%` } },
      { last_name: { _ilike: `%${debouncedValue}%` } },
      { phones: { number: { _ilike: `%${debouncedValue}%` } } }
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

  if (loading) return <p>Loading...</p>

  if (error != null) return <p>Error: {error.message}</p>

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const { favorit, regular, contact_aggregate } = data ?? { favorit: [], regular: [] }
  const count = contact_aggregate?.aggregate.count ?? 10
  if (formContract) {
    return (
      <Stack padding={1}>
        <FormContainer setFormContract={setFormContract} />
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
        <Stack spacing={1} padding={1} position={'relative'}>
          <Typography variant="h5" fontWeight={'light'}>
            Contacts
          </Typography>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            fullWidth
            size="small"
            value={value}
            onChange={handleChange}
          />
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
          <Button
            variant="outlined"
            onClick={() => {
              setFormContract(true)
            }}
          >
            Create Contact
          </Button>
        </Stack>
      </main>
    </>
  )
}

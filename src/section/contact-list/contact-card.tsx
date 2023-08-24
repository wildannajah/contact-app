import { DELETE_CONTACT, GET_CONTACT_LIST } from '@/query'
import { addFavorit, deleteFavorit } from '@/redux/slices/favorit'
import { useDispatch } from '@/redux/store'
import { type Contact } from '@/types/contact'
import { useMutation } from '@apollo/client'

interface ContactCardProps {
  contact: Contact
  favorit: boolean
}

export default function ContactCard({ contact, favorit }: ContactCardProps) {
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

  console.log(data)

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
      {/* <button onClick={()=>console.log()}>edit</button> */}
      <button onClick={async () => await deleteContact({ variables: { id } })}>delete</button>
    </div>
  )
}

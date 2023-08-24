/* eslint-disable @typescript-eslint/no-unused-vars */
import { CREATE_CONTACT, DETAIL_CONTACT, GET_CONTACT_LIST } from '@/query'
import { type Phone } from '@/types/contact'
import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

interface FormContactProps {
  id?: number
}

export default function FormContact({ id }: FormContactProps) {
  const [createContact, { data, loading, error }] = useMutation(CREATE_CONTACT, {
    refetchQueries: [GET_CONTACT_LIST]
  })
  const {
    data: dataDetail,
    loading: loadingDetail,
    error: errorDetail
  } = useQuery(DETAIL_CONTACT, { variables: { id }, skip: id == null })
  const [firstname, setFisrtname] = useState<string>('')
  const [lastname, setlastname] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  const [phoneNumbers, setPhoneNumbers] = useState<Phone[]>([{ number: '' }])

  useEffect(() => {
    if (dataDetail !== undefined) {
      setFisrtname(dataDetail.contact_by_pk.first_name)
      setlastname(dataDetail.contact_by_pk.last_name)
      setPhoneNumbers(dataDetail.contact_by_pk.phones)
    }
  }, [dataDetail])

  const handleFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFisrtname(event.target.value)
  }
  const handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setlastname(event.target.value)
  }

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPhoneNumbers = [...phoneNumbers]
    newPhoneNumbers[index].number = event.target.value
    setPhoneNumbers(newPhoneNumbers)
  }

  const addPhoneNumberField = () => {
    setPhoneNumbers([...phoneNumbers, { number: '' }])
  }

  const removePhoneNumberField = (index: number) => {
    const newPhoneNumbers = [...phoneNumbers]
    newPhoneNumbers.splice(index, 1)
    setPhoneNumbers(newPhoneNumbers)
  }
  const handleSubmit = async () => {
    setShow(true)
    await createContact({
      variables: { first_name: firstname, last_name: lastname, phones: phoneNumbers }
    })
  }

  if (loading) return <p>Loading...</p>

  if (error != null) return <p>Error: {error.message}</p>

  return (
    <div>
      <div>
        <label>First Name:</label>
        {show && firstname === '' && 'this field is required'}
        <input type="text" value={firstname} onChange={handleFirstnameChange} />
        {show && lastname === '' && 'this field is required'}
        <input type="text" value={lastname} onChange={handleLastnameChange} />

        <label>Phone Numbers:</label>
        {phoneNumbers.map((phoneNumber, index) => (
          <div key={index}>
            {show && phoneNumber.number === '' && 'this field is required'}
            <input
              type="text"
              value={phoneNumber.number}
              onChange={(event) => {
                handlePhoneNumberChange(event, index)
              }}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => {
                  removePhoneNumberField(index)
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addPhoneNumberField}>
          Add Phone Number
        </button>
      </div>
      <button
        onClick={async () => {
          await handleSubmit()
        }}
      >
        submit
      </button>
    </div>
  )
}

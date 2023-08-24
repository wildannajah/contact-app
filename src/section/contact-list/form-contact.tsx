import { CREATE_CONTACT, GET_CONTACT_LIST } from '@/query'
import { useMutation } from '@apollo/client'
import { useState } from 'react'

interface PhoneNumber {
  number: string
}

export default function FormContact() {
  const [createContact, { data, loading, error }] = useMutation(CREATE_CONTACT, {
    refetchQueries: [GET_CONTACT_LIST]
  })
  const [firstname, setFisrtname] = useState<string>('')
  const [lastname, setlastname] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([{ number: '' }])

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

  console.log(data)

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

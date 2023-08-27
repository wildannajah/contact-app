/* eslint-disable array-callback-return */
import Iconify from '@/components/Iconify'
import { FormProvider, RHFTextField } from '@/components/hook-form'
import {
  ADD_NUMBER_TO_CONTACT,
  CREATE_CONTACT,
  DELETE_PHONE_NUMBER,
  EDIT_CONTACT,
  EDIT_PHONE_NUMBER,
  GET_CONTACT_LIST
} from '@/query'
import { setCurrentContact } from '@/redux/slices/current-contact'
import { useDispatch } from '@/redux/store'
import {
  type EditPhone,
  type AddContactWithPhones,
  type EditData,
  type InitialStateContact,
  type Phone,
  type DeletePhone
} from '@/types/contact'
import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Stack, InputAdornment, IconButton, Alert } from '@mui/material'
import { type ChangeEvent } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import * as Yup from 'yup'

interface ContactFormProps {
  contact: InitialStateContact
}

interface FormValuesProps {
  first_name: string
  last_name: string
  phones: Phone[]
  afterSubmit?: string
}

interface Changes {
  before: Phone
  after: Phone
}

export default function ContactForm({ contact }: ContactFormProps) {
  const [createContact, { loading, error }] = useMutation(CREATE_CONTACT, {
    refetchQueries: [GET_CONTACT_LIST]
  })
  const [EditContact, { loading: LoadingEdit, error: errorEdit }] = useMutation<EditData>(
    EDIT_CONTACT,
    {
      refetchQueries: [GET_CONTACT_LIST]
    }
  )
  const [AddNumberToContact, { loading: LoadingAddNumber, error: errorAddNumber }] =
    useMutation<AddContactWithPhones>(ADD_NUMBER_TO_CONTACT, {
      refetchQueries: [GET_CONTACT_LIST]
    })
  const [EditPhoneNumber, { loading: LoadingEditNumber, error: errorEditNumber }] =
    useMutation<EditPhone>(EDIT_PHONE_NUMBER, {
      refetchQueries: [GET_CONTACT_LIST]
    })
  const [DeletePhoneNumber, { loading: LoadingDeleteNumber, error: errorDeleteNumber }] =
    useMutation<DeletePhone>(DELETE_PHONE_NUMBER, {
      refetchQueries: [GET_CONTACT_LIST]
    })

  const { first_name, last_name, phones } = contact ?? {
    first_name: '',
    last_name: '',
    phones: [{ number: '' }]
  }
  const defaultValues = {
    first_name,
    last_name,
    phones: phones.map((entry: any) => ({
      number: entry.number
    }))
  }

  const ContactSchema = Yup.object().shape({
    first_name: Yup.string()
      .required('First Name is required')
      .matches(/^[a-zA-Z0-9]+$/, '* This field cannot contain white space and special character'),
    last_name: Yup.string()
      .required('Last Name is required')
      .matches(/^[a-zA-Z0-9]+$/, '* This field cannot contain white space and special character'),
    phones: Yup.array()
      .of(
        Yup.object().shape({
          number: Yup.string().required('Phone number is required')
        })
      )
      .required()
  })

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ContactSchema),
    defaultValues
  })

  const {
    control,
    reset,
    setValue,
    getValues,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phones'
  })

  const dispatch = useDispatch()
  const onSubmit = async (data: FormValuesProps) => {
    try {
      const newChanges: {
        added: Phone[]
        changed: Changes[]
        deleted: Phone[]
      } = { added: [], changed: [], deleted: [] }
      // eslint-disable-next-line array-callback-return
      data.phones.map((sumbitted, index) => {
        const before = contact.phones[index]
        if (before === undefined) {
          newChanges.added.push(sumbitted)
        } else if (before.number !== sumbitted.number) {
          // Object was changed
          newChanges.changed.push({ before, after: sumbitted })
        }
      })
      contact.phones.forEach((beforeObj, index) => {
        const submittedObj = data.phones[index]

        if (submittedObj === undefined) {
          newChanges.deleted.push(beforeObj)
        }
      })
      if (newChanges.deleted.length > 0) {
        newChanges.deleted.map(async ({ number }) => {
          const result = await DeletePhoneNumber({
            variables: { contact_id: contact.id, number }
          })
          if (result.data != null) {
            const { first_name, last_name, phones, id } = result.data.delete_phone_by_pk.contact
            dispatch(setCurrentContact({ id, first_name, last_name, phones }))
          }
        })
      }
      if (newChanges.added.length > 0) {
        newChanges.added.map(async ({ number }) => {
          const result = await AddNumberToContact({
            variables: { contact_id: contact.id, phone_number: number }
          })
          if (result.data != null) {
            const { first_name, last_name, phones, id } =
              result.data.insert_phone.returning[0].contact
            dispatch(setCurrentContact({ id, first_name, last_name, phones }))
          }
        })
      }
      if (newChanges.changed.length > 0) {
        newChanges.changed.map(async ({ after, before }) => {
          const result = await EditPhoneNumber({
            variables: {
              pk_columns: { number: before.number, contact_id: contact.id },
              new_phone_number: after.number
            }
          })
          if (result.data != null) {
            const { first_name, last_name, phones, id } = result.data.update_phone_by_pk.contact
            dispatch(setCurrentContact({ id, first_name, last_name, phones }))
          }
        })
      }

      if (contact.id != null) {
        if (data.first_name !== contact.first_name || data.first_name !== contact.last_name) {
          const result = await EditContact({
            variables: {
              id: contact.id,
              _set: { first_name: data.first_name, last_name: data.last_name }
            }
          })
          if (result.data != null) {
            const { first_name, last_name, phones, id } = result.data.update_contact_by_pk
            dispatch(setCurrentContact({ id, first_name, last_name, phones }))
          }
        }
      } else {
        await createContact({
          variables: { ...data }
        })
      }
    } catch (error: any) {
      console.error(error)

      reset()

      setError('afterSubmit', { ...error, message: error.message })
    }
  }
  const handleRemove = (index: number) => {
    remove(index)
  }
  const handleChangeNumber = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const numbers = getValues('phones')
    numbers[index].number = event.target.value
    setValue('phones', numbers)
  }

  if (loading || LoadingEdit || LoadingAddNumber || LoadingEditNumber || LoadingDeleteNumber) {
    return <p>Loading...</p>
  }

  if (
    error != null ||
    errorEdit != null ||
    errorAddNumber != null ||
    errorEditNumber != null ||
    errorDeleteNumber != null
  ) {
    return (
      <p>
        Error: {error?.message}
        {errorEdit?.message}
      </p>
    )
  }
  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1}>
          {errors.afterSubmit != null && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}
          <Stack spacing={1}>
            <RHFTextField
              name="first_name"
              placeholder="First Name"
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <Iconify icon={'eva:person-outline'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <RHFTextField
              name="last_name"
              placeholder="Last Name"
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <Iconify icon={'eva:person-outline'} visibility={'hidden'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {fields.map((item, index) => (
              <RHFTextField
                key={index}
                name={`phones[${index}].number`}
                value={`${item.number}`}
                placeholder="Phone Number"
                variant="standard"
                onChange={(event) => {
                  handleChangeNumber(event, index)
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <Iconify icon={'material-symbols:call-outline'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          handleRemove(index)
                        }}
                      >
                        <Iconify icon={'bi:dash-circle'} sx={{ color: 'error.dark' }} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            ))}
          </Stack>
          <button
            type="button"
            onClick={() => {
              append({ number: '' })
            }}
          >
            Add Phone Number
          </button>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </Stack>
      </FormProvider>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import Iconify from '@/components/Iconify'
import { FormProvider, RHFTextField } from '@/components/hook-form'
import { CREATE_CONTACT, GET_CONTACT_LIST } from '@/query'
import { type InitialStateContact, type Contact, type Phone } from '@/types/contact'
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

export default function ContactForm({ contact }: ContactFormProps) {
  const [createContact, { data, loading, error }] = useMutation(CREATE_CONTACT, {
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
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
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

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // await createContact({
      //   variables: { ...data }
      // })
      console.log(contact.id)
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
              placeholder="Email address"
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
            {/* <Kontol /> */}
            {fields.map((item, index) => (
              <RHFTextField
                key={index}
                name={`phones[${index}].number`} // Use proper path for phones
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
                // ... (other props)
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
            Login
          </LoadingButton>
        </Stack>
      </FormProvider>
    </div>
  )
}

import { type ReactNode } from 'react'
import { FormProvider as Form, type UseFormReturn } from 'react-hook-form'

interface Props {
  children: ReactNode
  methods: UseFormReturn<any>
  onSubmit?: VoidFunction
}

export default function FormProvider({ children, onSubmit, methods }: Props) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  )
}

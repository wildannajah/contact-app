import { type ChangeEvent, useState } from 'react'

export default function usePagination() {
  const [page, setPage] = useState(1)

  const onChangePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }
  return {
    page,
    setPage,
    //
    onChangePage
  }
}

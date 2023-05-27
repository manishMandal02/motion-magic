import type { ReactNode } from 'react'

type Props = {
    children: ReactNode
}

export default function layout({children}: Props) {
  return (
    <div className='bg-brand-primaryDark w-screen h-screen'>{children}</div>
  )
}

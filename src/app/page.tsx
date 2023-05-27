import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen   items-center justify-center ">
      

      <Link href={'/editor'} className='border-2 items-center justify-center px-5 py-2 rounded-lg' >Go to Editor 🔗</Link>
    </main>
  )
}

'use client'
import WrapperSessionProvider from './Providers/SessionProvider'
import { Chat } from './components/Chat/Chat'
import getUser from './services/axios'

export default function Home() {
  const handlePress = async () => {
    const response = getUser()
  }

  return (
    <WrapperSessionProvider>
      <Chat />
    </WrapperSessionProvider>
  )
}

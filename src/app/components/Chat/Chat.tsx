import { useState } from 'react'
import Button from '../Button'
import { Dots } from '../Dots'

export const Chat = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')

  const fetchMessages = async () => {
    if (messages.length > 0) setMessages([])
    const response = await fetch('/api/testApi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputMessage }),
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let partialMessage = ''

    const readStream = async () => {
      while (true) {
        const { value, done } = await reader!.read()
        if (done) break

        partialMessage += decoder.decode(value, { stream: true })

        // Check if partialMessage contains one or more complete messages
        let messagesArray = partialMessage.split('\n')
        if (messagesArray.length > 1) {
          // Update state with complete messages and keep the remainder
          setMessages((prevMessages) => {
            const formattedMessage = messagesArray
              .slice(0, -1)
              .map((message) => {
                const formattedMessage = message.split('0:')[1]
                return formattedMessage
                  ? formattedMessage.replace(/"/g, '')
                  : ''
              })
            return [...prevMessages, ...formattedMessage]
          })

          partialMessage = messagesArray[messagesArray.length - 1]
        }
      }
    }

    await readStream()
    setInputMessage('')
  }
  return (
    <div className="flex flex-col justify-center items-center ">
      <h1 className="text-2xl my-4 ">Powered by llama3 🚀🚀🚀</h1>
      <div className="flex gap-5 ">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="text-black p-2 rounded-lg focus:scale-105 transition-all focus:shadow-xl outline-none"
        />
        <Button onClick={fetchMessages}>Send</Button>
      </div>
      <div className="flex p-5  w-96 flex-wrap h-auto max-h-[40vh] mt-10 rounded-lg text-wrap bg-[#034078]  text-white shadow-2xl  relative overflow-y-scroll ">
        {messages.map((message, index) => (
          <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
            {message}
          </span>
        ))}
        {messages.length == 0 && inputMessage && (
          <div className="mx-auto">
            <Dots />
          </div>
        )}
        {messages.length == 0 &&
          !inputMessage &&
          'How can I help you? type something'}
      </div>
    </div>
  )
}

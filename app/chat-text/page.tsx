'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
    api: '/api/chat-oll',
  });

  return (
    <div className='flex flex-col w-full max-w-md py-24 mx-auto stretch'>
      <div className='space-y-4'>
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === 'user' && 'You: ' + m.content}
            {m.role === 'assistant' &&
              'AI: ' + JSON.parse(m.content).messages[0].content[0].text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className='fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl'
          value={input}
          placeholder='Say something...'
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

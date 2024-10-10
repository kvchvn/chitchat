import { api, HydrateClient } from '~/trpc/server';
import { Form } from './_components/form';

export default async function Home() {
  const messages = await api.message.getAll();

  return (
    <HydrateClient>
      <button>Toggle Theme</button>
      <p>Messages:</p>
      {messages.length ? (
        <ul>
          {messages.map((message) => (
            <li key={message.id}>{`${message.id}: ${message.text}`}</li>
          ))}
        </ul>
      ) : (
        <span>No messages</span>
      )}
      <Form />
    </HydrateClient>
  );
}

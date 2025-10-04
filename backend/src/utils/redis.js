import { createClient } from 'redis';
const client = createClient({
  url: 'redis://localhost:6379',
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected Redis'));
await client.connect();

export default client;

import { getSeenInformation } from '@/app/queries';

export async function GET() {
  const seenInformation = await getSeenInformation();
  return new Response(JSON.stringify(seenInformation), {
    status: 200,
  })
}
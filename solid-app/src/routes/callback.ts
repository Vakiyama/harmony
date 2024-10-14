import { APIEvent } from "node_modules/@solidjs/start/dist/server";
import { sessionManager, getKindeClient, extractSessionId } from "~/api/kinde";

export const GET = async ({ request } : APIEvent) => {
  const cookieHeader = request.headers.get("cookie");
  const sessionId = extractSessionId(cookieHeader);

  if (!sessionId) {
    return new Response('Session ID not found', { status: 400 });
  }

  const manager = sessionManager(sessionId);
  
  const expectedState = await manager.getSessionItem('auth_state');

  const url = new URL(request.url);
  const receivedState = url.searchParams.get('state');

  console.log('Expected State:', expectedState);
  console.log('Received State:', receivedState);

  if (expectedState !== receivedState) {
    return new Response('State mismatch', { status: 400 });
  }

  await getKindeClient().handleRedirectToApp(manager, url);

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/counter' 
    }
  });
};
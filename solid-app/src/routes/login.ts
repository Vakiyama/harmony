import { APIEvent } from 'node_modules/@solidjs/start/dist/server';
import { v4 as uuidv4 } from 'uuid';
import { sessionManager, getKindeClient, extractSessionId } from '~/api/kinde';

export const GET = async ({ request }: APIEvent) => {
  const cookieHeader = request.headers.get("cookie");
  const sessionId = extractSessionId(cookieHeader);

  const newSessionId = sessionId || uuidv4();

  const manager = sessionManager(newSessionId); 
  const state = uuidv4();
  console.log('Setting auth_state in session:', state)
  await manager.setSessionItem('auth_state', state);

  const loginUrl = await getKindeClient().login(manager, { state });

  const response = new Response(null, {
    status: 302,
    headers: {
      Location: loginUrl.toString(),
      'Set-Cookie': `sessionId=${newSessionId}; HttpOnly; Path=/; Max-Age=3600;`, 
    }
  });

  return response;
};
import { APIEvent } from 'node_modules/@solidjs/start/dist/server';
import { sessionManager, getKindeClient } from '~/api/kinde'; // Adjust imports accordingly
import { loginOrRegister } from '~/api/server';

export const GET = async ({ request }: APIEvent) => {
    const manager = await sessionManager();
    const expectedState = await manager.getSessionItem('auth_state');
    const url = new URL(request.url);
    const receivedState = url.searchParams.get('state');

    // console.log('Expected State:', expectedState);
    // console.log('Received State:', receivedState);

    if (expectedState !== receivedState) {
        return new Response('State mismatch', { status: 400 });
    }

    await getKindeClient().handleRedirectToApp(manager, url);
    const kindeUser = await getKindeClient().getUser(manager)
    console.log(kindeUser)
    await loginOrRegister(kindeUser)
    // await manager.setSessionItem('userId', kindeUser.id)

    return new Response(null, {
        status: 302,
        headers: {
            Location: '/',
        }
    });
};
import { sessionManager, getKindeClient } from '~/api/kinde'

export const GET = async () => {

  const manager = await sessionManager();
  const logoutUrl = await getKindeClient().logout(manager);

  return new Response(null, {
    status: 302,
    headers: {
        Location: logoutUrl.toString()
    }
});
};
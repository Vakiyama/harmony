import { v4 as uuidv4 } from "uuid";
import { sessionManager, getKindeClient } from "~/api/kinde";

export const GET = async () => {
  const manager = await sessionManager();
  const state = uuidv4();
  await manager.setSessionItem("auth_state", state);

  const loginUrl = await getKindeClient().login(manager, { state });
  return new Response(null, {
    status: 302,
    headers: {
      Location: loginUrl.toString(),
    },
  });
};

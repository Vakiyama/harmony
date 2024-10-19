import { APIEvent } from "node_modules/@solidjs/start/dist/server";
import { RegisterInfo } from "~/api/auth-server-actions";
import { sessionManager, getKindeClient } from "~/api/kinde"; // Adjust imports accordingly
import { loginOrRegister } from "~/api/server";

export const GET = async ({ request }: APIEvent) => {
  const cookies = new Map<string, string>(
    request.headers
      .get("cookie")
      ?.split("; ")
      .map((cookie) => cookie.split("=")) as [string, string][]
  );
  const infoString = cookies.get("register_obj") as string;
  let registerInfo = JSON.parse(infoString || "") as RegisterInfo;
  // console.log(registerInfo);

  const manager = await sessionManager();
  const expectedState = await manager.getSessionItem("auth_state");
  const url = new URL(request.url);
  const receivedState = url.searchParams.get("state");
  // console.log(url.searchParams);

  // console.log("Expected State:", expectedState);
  // console.log("Received State:", receivedState);

  if (expectedState !== receivedState) {
    return new Response("State mismatch", { status: 400 });
  }

  await getKindeClient().handleRedirectToApp(manager, url);
  const kindeUser = await getKindeClient().getUser(manager);
  if (!kindeUser.family_name) {
    kindeUser.family_name = registerInfo.lastName || "";
  }
  if (!kindeUser.given_name) {
    kindeUser.given_name = registerInfo.firstName || "";
  }

  let err: Error | undefined;
  err = await loginOrRegister({
    ...kindeUser,
    ...(registerInfo.dob ? { dob: registerInfo.dob } : {}),
  });
  if (err) {
    return new Response("Bad Request", { status: 400 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie":
        "register_obj=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    },
  });
};

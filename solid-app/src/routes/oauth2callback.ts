import { APIEvent } from "solid-start";
import { authCallback, getSession } from "../api/server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";

export async function GET({ request }: APIEvent) {
  "user server";
  const url = new URL(request.url);
  const code = url.searchParams.get("code") as string;
  const googleTokens = await authCallback(code);
  const session = await useSession({
    password:
      "areallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplace",
  });
  await session.update((d) => (d.googleTokens = googleTokens));
  return redirect("/calendar");
}

import { getSession } from "../lib/session";

export default async function kicthenPage() {
  const session = await getSession();
  if (!session) {
    return <h1>not loged in</h1>;
  }
  return <h1>{session.payload.name} s Kitchen</h1>;
}

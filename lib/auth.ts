import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "./authConstants";

export { ADMIN_COOKIE };

export function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE ?? "";
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === "ok";
}

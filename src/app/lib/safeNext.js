export function safeNext(next, fallback = "/") {
  if (
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\")
  )
    return next;
  else return fallback;
}

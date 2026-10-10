import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  return <LoginForm next={next} />;
}

import { Redirect } from "wouter";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const isLoggedIn = Boolean(localStorage.getItem("user")); 
  // or token

  if (!isLoggedIn) {
    return <Redirect to="/auth" />;
  }

  return children;
}

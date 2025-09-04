'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Cargando sesión...</p>;
  }

  if (session) {
    return (
      <div>
        <p>Bienvenido, {session.user?.name}</p>
        <button onClick={() => signOut()}>Cerrar Sesión</button>
      </div>
    );
  }

  return (
    <div>
      <p>No has iniciado sesión.</p>
      <button onClick={() => signIn("Credentials")}>Iniciar Sesión</button>
    </div>
  );
}
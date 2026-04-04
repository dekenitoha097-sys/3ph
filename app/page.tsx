'use client';
import { useSession } from "@/hooks/useSession";

export default function Home() {
  const {user, loading} = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
        <div>
          <h1>Bienvenue, {user.nom} {user.prenom}!</h1>
          <p>Votre email est : {user.email}</p>
          <p>Votre rôle est : {user.role}</p>
          <p>Votre sexe est : {user.sexe}</p>
        </div>
    ); 
  }else {
    return (
        <div>
          <h1>Bienvenue sur 3PH</h1>
          <p>Veuillez vous connecter pour accéder à votre profil.</p>
        </div>
    );
  }
}

import { redirect } from "next/navigation";

  function Hom() {
  redirect("/login"); // ou /dashboard
}

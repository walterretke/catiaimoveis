import { redirect } from "next/navigation";
import { adminConfigurado, isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl shadow-ink/5">
        <h1 className="font-display text-2xl font-semibold">Painel de imóveis</h1>
        {adminConfigurado() ? (
          <LoginForm />
        ) : (
          <p className="mt-4 rounded-xl bg-gold-soft p-4 text-sm">
            Para ativar o painel, crie a variável <code className="font-mono">ADMIN_PASSWORD</code> com a senha
            desejada nas configurações do projeto na Vercel e faça um novo deploy.
          </p>
        )}
      </div>
    </main>
  );
}

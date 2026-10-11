"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Senha</span>
        <input
          type="password"
          name="senha"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1 h-12 w-full rounded-xl border border-line px-4 outline-none focus:border-gold"
        />
      </label>
      {state.erro && <p className="text-sm text-red-600">{state.erro}</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-white disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />} Entrar
      </button>
    </form>
  );
}

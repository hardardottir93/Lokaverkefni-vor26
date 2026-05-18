import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmail,
  signInWithGoogle,
} from "../features/auth/api/authApi";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      await signInWithEmail({ email, password });
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Innskráning mistókst",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setErrorMessage("");

    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Google innskráning mistókst",
      );
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-900">Innskráning</h1>
        <p className="mt-2 text-sm text-stone-600">
          Skráðu þig inn til að halda áfram í Prjónabúðinni.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="mb-4 w-full rounded-lg border border-stone-300 px-4 py-2 font-medium text-stone-800 hover:bg-stone-50"
      >
        Skrá inn með Google
      </button>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs text-stone-500">eða</span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-stone-700">Netfang</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-amber-700"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-stone-700">Lykilorð</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-amber-700"
          />
        </label>

        {errorMessage && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {isLoading ? "Skrái inn..." : "Skrá inn"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-stone-600">
        Ekki með aðgang?{" "}
        <Link to="/register" className="font-medium text-amber-700 underline">
          Nýskrá
        </Link>
      </p>
    </section>
  );
}

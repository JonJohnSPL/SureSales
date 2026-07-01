import { useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "../lib/supabaseClient.js";

export default function AuthGate({ loading }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setSubmitting(false);
    setStatus(error ? error.message : "Check your email for the sign-in link.");
  };

  return (
    <main className="min-h-full bg-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="text-xs uppercase tracking-widest text-sky-700">
          SPL Pittsburgh
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mt-1">SureSales</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            disabled={loading || submitting}
          />
          <button
            type="submit"
            disabled={loading || submitting}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-navy px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            <Mail size={16} />
            {loading || submitting ? "Sending..." : "Send sign-in link"}
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
      </section>
    </main>
  );
}

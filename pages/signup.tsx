import { useState } from "react";
import { supabase } from "@/utils/supabase"; // Supabaseクライアントをインポート
import { useRouter } from "next/router";
import Link from "next/link"; // リンク用

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState(""); // 確認用パスワードの状態
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // エラーメッセージの状態

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // エラーをリセット

    if (password !== passwordConf) {
      setError("Passwords do not match."); // パスワードが一致しない場合のエラー
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      alert(
        "Sign up successful! Please check your email to confirm your account."
      );
      router.push("/signin"); // サインアップ成功後にサインインページにリダイレクト
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      setError(error.message); // エラーメッセージを表示
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignUp}>
        {error && ( // エラーがある場合に表示
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="passwordConf"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="passwordConf"
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link href="/signin" className="text-blue-500 hover:underline">
          Signin
        </Link>
      </p>
    </div>
  );
};

export default SignUp;

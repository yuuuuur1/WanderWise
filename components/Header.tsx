import { useRouter } from "next/router";
import { signOutUser } from "@/utils/supabasweFunctions"; // ログアウト関数をインポート

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      alert("You have been logged out.");
      router.push("/signin"); // ログアウト後にサインインページにリダイレクト
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">My App</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;

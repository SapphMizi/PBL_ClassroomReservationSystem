import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [userType, setUserType] = useState<"student" | "admin">("student");
  const [clubName, setClubName] = useState("");
  const [password, setPassword] = useState("");
  const [clubs, setClubs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  // 部活一覧取得
  const fetchClubs = async () => {
    const res = await fetch("http://localhost:8080/clubs");
    const data = await res.json();
    setClubs(data.map((c: any) => c.name));
  };

  // 初回のみ部活一覧取得
  useState(() => {
    if (userType === "student") fetchClubs();
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const body: any = { user_type: userType, password };
    if (userType === "student") body.club_name = clubName;
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      if (userType === "student") {
        router.push(`/student?club=${encodeURIComponent(clubName)}`);
      } else {
        router.push("/admin");
      }
    } else {
      setError("ログイン失敗");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            <input
              type="radio"
              checked={userType === "student"}
              onChange={() => setUserType("student")}
            />
            学生
          </label>
          <label style={{ marginLeft: 16 }}>
            <input
              type="radio"
              checked={userType === "admin"}
              onChange={() => setUserType("admin")}
            />
            教務
          </label>
        </div>
        {userType === "student" && (
          <div>
            <label>部活名：</label>
            <select value={clubName} onChange={e => setClubName(e.target.value)}>
              <option value="">選択してください</option>
              {clubs.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label>パスワード：</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}

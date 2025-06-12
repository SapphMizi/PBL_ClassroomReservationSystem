import { useEffect, useState } from "react";

type Classroom = {
  name: string;
  capacity: number;
  status: string;
  available_per_day: { [date: string]: string };
};

export default function Admin() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [date, setDate] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [available, setAvailable] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/classrooms")
      .then(res => res.json())
      .then(setClassrooms);
  }, []);

  const handleUpdate = async () => {
    setMessage("");
    const res = await fetch("http://localhost:8080/classrooms/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classroom_name: selectedRoom,
        date,
        available,
      }),
    });
    if (res.ok) {
      setMessage("更新しました");
    } else {
      setMessage("エラー");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>教務用画面</h2>
      <h3>教室一覧</h3>
      <table border={1} cellPadding={4}>
        <thead>
          <tr>
            <th>教室名</th>
            <th>定員</th>
            <th>属性</th>
            <th>利用可否（直近）</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map(c => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.capacity}</td>
              <td>{c.status}</td>
              <td>
                {Object.entries(c.available_per_day).map(([d, v]) => (
                  <div key={d}>{d}: {v}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>利用可否の変更</h3>
      <div>
        <label>教室名: </label>
        <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}>
          <option value="">選択</option>
          {classrooms.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>日付: </label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div>
        <label>利用可否: </label>
        <input value={available} onChange={e => setAvailable(e.target.value)} placeholder="利用可/不可" />
      </div>
      <button onClick={handleUpdate}>変更</button>
      {message && <div>{message}</div>}
    </div>
  );
}

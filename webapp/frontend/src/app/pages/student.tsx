import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Classroom = {
  name: string;
  capacity: number;
  status: string;
  available_per_day: { [date: string]: string };
};

export default function Student() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const router = useRouter();
  const club = router.query.club as string;

  useEffect(() => {
    fetch("http://localhost:8080/classrooms")
      .then(res => res.json())
      .then(setClassrooms);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>学生用画面</h2>
      <div>部活名: {club}</div>
      <h3>教室一覧</h3>
      <table border={1} cellPadding={4}>
        <thead>
          <tr>
            <th>教室名</th>
            <th>定員</th>
            <th>属性</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map(c => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>{c.capacity}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

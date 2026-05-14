import { useEffect, useState } from "react";

export default function Sermons() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sermons")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>Sermons</h1>
      {data.map((s, i) => (
        <div key={i}>
          <h3>{s.title}</h3>
          <p>{s.date}</p>
        </div>
      ))}
    </div>
  );
}
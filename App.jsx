import { useEffect, useState } from "react";

const scheduleData = {
  "Apr 14": [
    { time: "9:00", task: "Office" },
    { time: "6:30", task: "Tuition" },
    { time: "7:30", task: "Gym" }
  ],
  "Apr 15": [
    { time: "9:00", task: "Office" },
    { time: "6:30", task: "Tuition" },
    { time: "7:30", task: "Gym" }
  ],
  "Apr 16": [
    { time: "6:30", task: "Gym" },
    { time: "13:00", task: "Office" },
    { time: "22:30", task: "Tuition" }
  ],
  "Apr 17": [
    { time: "6:30", task: "Gym" },
    { time: "13:00", task: "Office" },
    { time: "22:30", task: "Tuition" }
  ],
  "Apr 18": [
    { time: "6:30", task: "Gym" },
    { time: "7:00", task: "Office" },
    { time: "18:00", task: "Free / Study" }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [completed, setCompleted] = useState(
    JSON.parse(localStorage.getItem("completed")) || {}
  );
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("notes")) || {}
  );
  const [alert, setAlert] = useState("");

  useEffect(() => {
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // ⏰ Reminder system
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.getHours() + ":" + now.getMinutes().toString().padStart(2, "0");
      
      Object.entries(scheduleData).forEach(([day, tasks]) => {
        tasks.forEach((t) => {
          if (t.time === currentTime) {
            setAlert(`⏰ Time for: ${t.task}`);
            setTimeout(() => setAlert(""), 5000);
          }
        });
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleTask = (day, index) => {
    const key = `${day}-${index}`;
    setCompleted((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getProgress = (day) => {
    const tasks = scheduleData[day];
    const done = tasks.filter((_, i) => completed[`${day}-${i}`]).length;
    return Math.round((done / tasks.length) * 100);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🔥 Reddy Weekly Planner</h1>

      {alert && <div style={{ background: "yellow", padding: 10 }}>{alert}</div>}

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setActiveTab("schedule")}>📋 Schedule</button>
        <button onClick={() => setActiveTab("notes")}>📝 Notes</button>
        <button onClick={() => setActiveTab("overview")}>📊 Overview</button>
      </div>

      {activeTab === "schedule" &&
        Object.keys(scheduleData).map((day) => (
          <div key={day} style={{ marginBottom: 20 }}>
            <h3>{day} — {getProgress(day)}%</h3>
            <div style={{ height: 10, background: "#ddd" }}>
              <div
                style={{
                  width: `${getProgress(day)}%`,
                  height: "100%",
                  background: "green"
                }}
              />
            </div>

            {scheduleData[day].map((item, i) => {
              const key = `${day}-${i}`;
              return (
                <div
                  key={i}
                  onClick={() => toggleTask(day, i)}
                  style={{
                    cursor: "pointer",
                    textDecoration: completed[key] ? "line-through" : "none",
                    color: completed[key] ? "green" : "black"
                  }}
                >
                  {item.time} - {item.task}
                </div>
              );
            })}
          </div>
        ))}

      {activeTab === "notes" &&
        Object.keys(scheduleData).map((day) => (
          <div key={day}>
            <h3>{day}</h3>
            <textarea
              placeholder="Write notes..."
              value={notes[day] || ""}
              onChange={(e) =>
                setNotes({ ...notes, [day]: e.target.value })
              }
              style={{ width: "100%", height: 80 }}
            />
          </div>
        ))}

      {activeTab === "overview" && (
        <div>
          {Object.keys(scheduleData).map((day) => (
            <div key={day}>
              {day}: {getProgress(day)}%
            </div>
          ))}
          <button onClick={() => {
            setCompleted({});
            setNotes({});
          }}>
            🔄 Reset Week
          </button>
        </div>
      )}
    </div>
  );
}
export default function SchedulerPanel({ scheduler, onRunNow }) {
  return (
    <div className="card row">
      <div>
        <h3>Scheduler</h3>
        <p>Cron: {scheduler?.cron || "-"}</p>
        <p>Status: {scheduler?.isRunning ? "Running" : "Not running"}</p>
      </div>
      <button onClick={onRunNow}>Run Tracking Now</button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { FiClock, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { userService } from "../services/userService";

const UserActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await userService.getAuditLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="activity-loading">
        <FiRefreshCw className="spin" size={24} />
        <p>Fetching real-time logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="empty-state">
        <FiClock size={32} />
        <p>No activity logs available from the backend.</p>
        <button className="btn-refresh" onClick={fetchLogs}>Retry</button>
      </div>
    );
  }

  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Action</th>
            <th>IP Address</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="log-time">
                <FiClock className="log-icon" />
                {log.time || new Date(log.timestamp).toLocaleString()}
              </td>

              <td className="log-user">{log.user || log.username || "System"}</td>

              <td>
                {log.type === "ERROR" || log.status === "FAILED" ? (
                  <span className="log-error">
                    <FiAlertCircle /> {log.action || log.message}
                  </span>
                ) : (
                  <span className="log-info">{log.action || log.message}</span>
                )}
              </td>

              <td className="log-ip">{log.ip || log.ipAddress || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivityLogs;

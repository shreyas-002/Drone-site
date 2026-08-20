import React from "react";
import { CheckCircle, Clock, MapPin } from "lucide-react";
import "../styles/ScanHistory.css";

const ScanHistory = ({ fields = [] }) => {
  // Generate mock scan history
  const mockScans = fields
    .map((field, index) => ({
      id: index + 1,
      fieldName: field.name,
      cropType: field.cropType,
      area: field.area,
      scanDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      duration: Math.floor(Math.random() * 30) + 10,
      status: Math.random() > 0.2 ? "completed" : "ongoing",
    }))
    .sort((a, b) => b.scanDate - a.scanDate);

  const formatDate = (date) => {
    return date.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="scan-history">
      <div className="scan-history-header">
        <h2>स्कैन का इतिहास</h2>
        <span className="scan-count">कुल: {mockScans.length}</span>
      </div>

      {mockScans.length > 0 ? (
        <div className="scan-list">
          {mockScans.map((scan) => (
            <div key={scan.id} className={`scan-item scan-${scan.status}`}>
              <div className="scan-status-icon">
                {scan.status === "completed" ? (
                  <CheckCircle size={20} />
                ) : (
                  <Clock size={20} />
                )}
              </div>

              <div className="scan-details">
                <h3>{scan.fieldName}</h3>
                <div className="scan-meta">
                  <span className="meta-item">
                    <MapPin size={14} />
                    {scan.cropType} • {scan.area} km²
                  </span>
                </div>
              </div>

              <div className="scan-info">
                <div className="scan-date">{formatDate(scan.scanDate)}</div>
                <div className="scan-duration">{scan.duration} मिनट</div>
              </div>

              <div className={`scan-status-badge ${scan.status}`}>
                {scan.status === "completed" ? "पूर्ण" : "जारी है"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-scan-history">
          <p>अभी तक कोई स्कैन नहीं किया गया है</p>
        </div>
      )}
    </div>
  );
};

export default ScanHistory;

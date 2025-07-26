import React, { useEffect, useState } from 'react';
import '../pages/dashboard.css';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);

  useEffect(() => {
    const unsubscribeAppointments = onSnapshot(
      collection(db, 'appointments'),
      (snapshot) => {
        setAppointments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    const unsubscribeHelpRequests = onSnapshot(
      collection(db, 'helpRequests'),
      (snapshot) => {
        setHelpRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => {
      unsubscribeAppointments();
      unsubscribeHelpRequests();
    };
  }, []);

  const countByStatus = (arr, status) => arr.filter(item => item.status === status).length;

  // ✅ Helper to safely format date
  const formatDate = (date) => {
    if (!date) return 'No date';
    try {
      const d = typeof date.toDate === 'function' ? date.toDate() : new Date(date);
      return d.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Appointments</p>
          <h2 className="stat-value">{appointments.length}</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Help Requests</p>
          <h2 className="stat-value">{helpRequests.length}</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Approved</p>
          <h2 className="stat-value">
            {countByStatus(appointments, 'approved') + countByStatus(helpRequests, 'approved')}
          </h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending</p>
          <h2 className="stat-value">
            {countByStatus(appointments, 'pending') + countByStatus(helpRequests, 'pending')}
          </h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Rejected</p>
          <h2 className="stat-value">
            {countByStatus(appointments, 'rejected') + countByStatus(helpRequests, 'rejected')}
          </h2>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Recent Appointments</h2>
        <div className="activity-list">
          {appointments.length === 0 ? (
            <div className="empty-state">No Appointments Found</div>
          ) : (
            appointments.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-details">
                  <div className="activity-title">{item.userName}</div>
                  <div className="activity-description">{item.reason || 'No reason provided'}</div>
                  <div className="activity-time">{formatDate(item.preferredDate)}</div>
                </div>
                <div className={`activity-status ${item.status}`}>{item.status}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Recent Help Requests</h2>
        <div className="activity-list">
          {helpRequests.length === 0 ? (
            <div className="empty-state">No Help Requests Found</div>
          ) : (
            helpRequests.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-details">
                  <div className="activity-title">{item.userName}</div>
                  <div className="activity-description">{item.description || 'No description'}</div>
                  <div className="activity-time">{formatDate(item.timestamp)}</div>
                </div>
                <div className={`activity-status ${item.status}`}>{item.status}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

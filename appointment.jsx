import React, { useEffect, useState } from 'react';
import { collection, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './appointmet.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { status });
  };

  return (
    <div className="appointments-container">
      <h2>📅 Appointments</h2>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.userName}</td>
              <td>{a.userPhone}</td>
              <td>{a.reason}</td>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td>
                <span className={`status ${a.status}`}>{a.status}</span>
              </td>
              <td>
                <button className="approve" onClick={() => updateStatus(a.id, 'approved')}>Approve</button>
                <button className="reject" onClick={() => updateStatus(a.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;

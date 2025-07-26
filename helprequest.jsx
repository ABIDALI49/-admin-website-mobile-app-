import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const HelpRequests = () => {
  const [helpRequests, setHelpRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'requests'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHelpRequests(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const docRef = doc(db, 'requests', id); // ✅ corrected collection name
      await updateDoc(docRef, { status });

      // ✅ Update UI locally without refetching
      setHelpRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status } : req))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Help Requests</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Issue</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {helpRequests.map((r) => (
            <tr key={r.id}>
              <td>{r.userName || '-'}</td>
              <td>{r.helpType || '-'}</td>
              <td>{r.userPhone || '-'}</td>
              <td>{r.status || 'pending'}</td>
              <td>
                <button onClick={() => updateStatus(r.id, 'approved')}>Approve</button>{' '}
                <button onClick={() => updateStatus(r.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HelpRequests;

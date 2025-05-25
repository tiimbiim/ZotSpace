import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './JoinGroupConfirmation.css';

const JoinGroupConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get group data from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const groupDataStr = searchParams.get('groupData');
  const group = groupDataStr ? JSON.parse(decodeURIComponent(groupDataStr)) : null;

  const handleConfirm = () => {
    // Send message back to opener window
    if (window.opener) {
      window.opener.postMessage({
        type: 'JOIN_GROUP_CONFIRMED',
        groupId: group.id
      }, '*');
    }
    window.close();
  };

  const handleCancel = () => {
    window.close();
  };

  if (!group) {
    return (
      <div className="join-confirmation-page">
        <div className="confirmation-card">
          <div className="error-message">No group information provided</div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-confirmation-page">
      <div className="confirmation-card">
        <h2>Join Study Group</h2>
        <div className="group-details">
          <h3>{group.name}</h3>
          <p><strong>Course:</strong> {group.course}</p>
          <p><strong>Meeting Time:</strong> {group.meetingTime}</p>
          <p><strong>Location:</strong> {group.location}</p>
          <p><strong>Members:</strong> {group.members}/{group.maxMembers}</p>
        </div>
        <p className="confirmation-message">Are you sure you want to join this study group?</p>
        <div className="confirmation-actions">
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button className="confirm-btn" onClick={handleConfirm}>Join Group</button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupConfirmation; 
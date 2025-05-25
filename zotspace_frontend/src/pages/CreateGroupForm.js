import React, { useState } from 'react';
import './CreateGroupForm.css';

const CreateGroupForm = () => {
  const [formData, setFormData] = useState({
    course: '',
    meetingTime: '',
    location: '',
    maxMembers: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new group object
    const newGroup = {
      id: Date.now(), // temporary ID generation
      name: `${formData.course} Study Group`,
      course: formData.course,
      members: 1,
      maxMembers: parseInt(formData.maxMembers),
      meetingTime: formData.meetingTime,
      location: formData.location,
      description: formData.description || `Study group for ${formData.course}`
    };

    // Send message back to opener window
    if (window.opener) {
      window.opener.postMessage({
        type: 'NEW_GROUP_CREATED',
        group: newGroup
      }, '*');
    }
    window.close();
  };

  const handleCancel = () => {
    window.close();
  };

  return (
    <div className="create-group-page">
      <div className="create-group-card">
        <h2>Create New Study Group</h2>
        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="form-group">
            <label htmlFor="course">Course*</label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g., CS 143"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="meetingTime">Meeting Time*</label>
            <input
              type="text"
              id="meetingTime"
              name="meetingTime"
              value={formData.meetingTime}
              onChange={handleChange}
              placeholder="e.g., Monday, 2:00 PM"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location*</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Science Library"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxMembers">Maximum Members*</label>
            <input
              type="number"
              id="maxMembers"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleChange}
              min="2"
              max="20"
              placeholder="Enter maximum number of members"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter group description..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm; 
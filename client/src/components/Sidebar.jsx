import React from 'react';

function Sidebar({ title = "Related Topics", topics = [] }) {
    // Use default topics if none provided
    const defaultTopics = [
      { name: "Technology", url: "#" },
      { name: "Science", url: "#" },
      { name: "Health", url: "#" },
      { name: "Business", url: "#" },
    ];
  
    const topicsToRender = topics.length > 0 ? topics : defaultTopics;
  
    return (
      <div className="quora-sidebar">
        <div className="sidebar-section">
          <h3>{title}</h3>
          <ul className="topic-list">
            {topicsToRender.map((topic, index) => (
              <li key={index}>
                <a href={topic.url}>{topic.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  export default Sidebar;
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const TopAnnouncementBar = () => {
  const announcement = useSelector((state) => state.siteContent?.announcementBar);

  if (!announcement || !announcement.enabled || !announcement.message) {
    return null;
  }

  return (
    <div className="top-announcement-bar" role="region" aria-label="Announcement">
      <div className="top-announcement-content">
        <span className="top-announcement-badge">UPDATED</span>
        <span className="top-announcement-text">{announcement.message}</span>
        {announcement.ctaText && (
          <Link
            to={announcement.ctaLink || '/find-talent'}
            className="top-announcement-link"
          >
            {announcement.ctaText} &rarr;
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopAnnouncementBar;

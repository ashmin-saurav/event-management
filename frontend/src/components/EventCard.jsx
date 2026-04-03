import React from 'react';

// Formats date to match the "24 MAY" vibe
function formatShortDate(value) {
  const date = new Date(value);
  return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;
}

// Standard time format "8:00 PM"
function formatTime(value) {
  return new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(value));
}

export default function EventCard({ event, canRegister, isAdmin, onRegister, onDelete, busy }) {
  const seatsLeft = event.capacity - event.registeredCount;
  const isSoldOut = seatsLeft <= 0;

  // Fallback image if none provided
  const bgImage = event.bannerUrl || 'https://images.unsplash.com/photo-1501286353178-1ec871214bc9?w=600&h=400&fit=crop&auto=format';

  return (
    <article className="event-card">
      <div className="card-img" style={{ backgroundImage: `url(${bgImage})` }}>
        <span className="card-badge-top">{event.category}</span>
        <span className="card-date">
          <i className="far fa-calendar-alt"></i> {formatShortDate(event.startTime)}
        </span>
      </div>
      
      <h3>{event.title}</h3>
      
      <div className="event-meta">
        <i className="fas fa-map-marker-alt"></i> {event.location}
      </div>
      <div className="event-meta">
        <i className="fas fa-clock"></i> {formatTime(event.startTime)} — {formatTime(event.endTime)}
      </div>

      <div className="price-row">
        <span className="price-text">
          {isSoldOut ? 'Sold Out' : `${seatsLeft} spots left`}
        </span>
        <span style={{color: '#8d7db0', fontSize: '0.85rem'}}>
          {event.registeredCount}/{event.capacity} total
        </span>
      </div>

      <div className="card-actions">
        {canRegister && (
          <button 
            className={isSoldOut ? "btn-outline" : "btn-filled"} 
            onClick={() => onRegister(event.id)} 
            disabled={busy || isSoldOut}
          >
            {busy ? 'Securing...' : isSoldOut ? 'Full' : 'Get Spot'}
          </button>
        )}
        {isAdmin && (
          <button className="btn-danger" onClick={() => onDelete(event.id)}>
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>
    </article>
  );
}
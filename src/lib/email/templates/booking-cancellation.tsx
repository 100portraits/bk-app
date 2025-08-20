import * as React from 'react';

interface BookingCancellationEmailProps {
  date: string;
  time: string;
  repairType: string;
  cancelledBy: 'user' | 'admin';
  reason?: string;
}

export const BookingCancellationEmail: React.FC<BookingCancellationEmailProps> = ({
  date,
  time,
  repairType,
  cancelledBy,
  reason,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#ef4444', padding: '20px', borderRadius: '8px 8px 0 0' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>Booking Cancelled</h1>
      </div>
      
      <div style={{ padding: '30px', backgroundColor: '#f9fafb', borderRadius: '0 0 8px 8px' }}>
        <p style={{ fontSize: '16px', color: '#374151', marginBottom: '20px' }}>
          {cancelledBy === 'admin' 
            ? 'Your appointment at the Bike Kitchen has been cancelled by an administrator.'
            : 'Your appointment at the Bike Kitchen has been successfully cancelled.'}
        </p>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#111827', fontSize: '18px', marginTop: 0 }}>Cancelled Appointment:</h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Date:</td>
                <td style={{ padding: '8px 0', color: '#111827', fontWeight: 'bold' }}>{date}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Time:</td>
                <td style={{ padding: '8px 0', color: '#111827', fontWeight: 'bold' }}>{time}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Repair Type:</td>
                <td style={{ padding: '8px 0', color: '#111827', fontWeight: 'bold' }}>{repairType}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {reason && (
          <div style={{ backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#991b1b', fontSize: '16px', marginTop: 0 }}>Reason for cancellation:</h3>
            <p style={{ color: '#991b1b', margin: '10px 0' }}>{reason}</p>
          </div>
        )}
        
        <div style={{ backgroundColor: '#dbeafe', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#1e40af', margin: 0 }}>
            <strong>Need to reschedule?</strong> You can book a new appointment anytime through our website.
          </p>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href="https://bikekitchen.nl/booking/new"
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: 'bold'
            }}
          >
            Book New Appointment
          </a>
        </div>

      </div>
    </div>
  );
};
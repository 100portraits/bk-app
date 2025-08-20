import * as React from 'react';

interface BookingConfirmationEmailProps {
  date: string;
  time: string;
  repairType: string;
  duration: string;
  isGuest?: boolean;
}

export const BookingConfirmationEmail: React.FC<BookingConfirmationEmailProps> = ({
  date,
  time,
  repairType,
  duration,
  isGuest = false,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#7c3aed', padding: '20px', borderRadius: '8px 8px 0 0' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>Booking Confirmed!</h1>
      </div>
      
      <div style={{ padding: '30px', backgroundColor: '#f9fafb', borderRadius: '0 0 8px 8px' }}>
        <p style={{ fontSize: '16px', color: '#374151', marginBottom: '20px' }}>
          Your appointment at the Bike Kitchen has been confirmed.
        </p>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#111827', fontSize: '18px', marginTop: 0 }}>Appointment Details:</h2>
          
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
              <tr>
                <td style={{ padding: '8px 0', color: '#6b7280' }}>Duration:</td>
                <td style={{ padding: '8px 0', color: '#111827', fontWeight: 'bold' }}>{duration} minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{ backgroundColor: '#fef3c7', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#92400e', fontSize: '16px', marginTop: 0 }}>Important Reminders:</h3>
          <ul style={{ color: '#92400e', margin: '10px 0', paddingLeft: '20px' }}>
            <li>Bring your own spare parts (we only provide tools)</li>
            <li>Location: The Bike Kitchen (garage of the Roeterseilandcampus, ABC building)</li>
            <li>This is a DIY space - you'll be doing the repair yourself with guidance</li>
          </ul>
        </div>
        
        {isGuest && (
          <div style={{ backgroundColor: '#dbeafe', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <p style={{ color: '#1e40af', margin: 0 }}>
              <strong>Guest Booking:</strong> Consider creating an account for easier booking management and member benefits!
            </p>
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href="https://bikekitchen.nl/booking/manage"
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
            Manage Your Booking
          </a>
        </div>
        
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0' }}>
            Need to cancel? Use the above link.
          </p>

        </div>
      </div>
    </div>
  );
};
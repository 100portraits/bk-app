import * as React from 'react';

interface AdminResponseEmailProps {
  userName?: string;
  originalMessage: string;
  adminResponse: string;
  messagePage: string;
}

export const AdminResponseEmail: React.FC<AdminResponseEmailProps> = ({
  userName,
  originalMessage,
  adminResponse,
  messagePage,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#7c3aed', padding: '20px', borderRadius: '8px 8px 0 0' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>Response from Bike Kitchen</h1>
      </div>
      
      <div style={{ padding: '30px', backgroundColor: '#f9fafb', borderRadius: '0 0 8px 8px' }}>
        <p style={{ fontSize: '16px', color: '#374151', marginBottom: '20px' }}>
          Hi {userName || 'there'},
        </p>
        
        <p style={{ fontSize: '16px', color: '#374151', marginBottom: '20px' }}>
          I responded to your help request. See below for details.
        </p>
        
        <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#6b7280', fontSize: '14px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Your Original Message:
          </h3>
          <p style={{ color: '#374151', fontSize: '14px', margin: '10px 0', fontStyle: 'italic' }}>
            "{originalMessage}"
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: '5px 0' }}>
            Sent from: {messagePage}
          </p>
        </div>
        
        <div style={{ backgroundColor: '#ede9fe', padding: '20px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #7c3aed' }}>
          <h3 style={{ color: '#5b21b6', fontSize: '16px', marginTop: 0 }}>
            My Response:
          </h3>
          <p style={{ color: '#374151', fontSize: '15px', margin: '10px 0', whiteSpace: 'pre-wrap' }}>
            {adminResponse}
          </p>
        </div>
        
        <div style={{ backgroundColor: '#dbeafe', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#1e40af', margin: 0, fontSize: '14px' }}>
            <strong>Still have a question?</strong> WhatsApp me (sahir) or come by the BK and ask!
          </p>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a
            href="https://bikekitchen.nl"
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
            Visit Bike Kitchen
          </a>
        </div>
        
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0' }}>
            Best,<br />
            Sahir
          </p>

        </div>
      </div>
    </div>
  );
};
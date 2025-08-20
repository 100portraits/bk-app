import * as React from 'react';

interface RoleChangeEmailProps {
  userName?: string;
  newRole: 'admin' | 'mechanic' | 'host' | null;
  previousRole?: string | null;
}



const getRoleColor = (role: string | null) => {
  switch (role) {
    case 'admin':
      return '#dc2626'; // red
    case 'mechanic':
      return '#2563eb'; // blue
    case 'host':
      return '#16a34a'; // green
    default:
      return '#6b7280'; // gray
  }
};

export const RoleChangeEmail: React.FC<RoleChangeEmailProps> = ({
  userName,
  newRole,
  previousRole,
}) => {
  const isPromotion = newRole !== null;
  const roleColor = getRoleColor(newRole);
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: isPromotion ? '#7c3aed' : '#6b7280', padding: '20px', borderRadius: '8px 8px 0 0' }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
          {isPromotion ? 'New Role Assigned!' : 'Role Update'}
        </h1>
      </div>
      
      <div style={{ padding: '30px', backgroundColor: '#f9fafb', borderRadius: '0 0 8px 8px' }}>
        <p style={{ fontSize: '16px', color: '#374151', marginBottom: '20px' }}>
          Hi {userName || 'there'},
        </p>
        
        <p style={{ fontSize: '16px', color: '#374151', marginBottom: '20px' }}>
          {isPromotion 
            ? `Congratulations! You've been assigned a new role at the Bike Kitchen.`
            : `Your role at the Bike Kitchen has been updated.`}
        </p>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          {previousRole && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0' }}>Previous Role:</p>
              <p style={{ color: '#374151', fontSize: '16px', margin: '5px 0', textDecoration: 'line-through' }}>
                {previousRole.charAt(0).toUpperCase() + previousRole.slice(1)}
              </p>
            </div>
          )}
          
          <div>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0' }}>New Role:</p>
            <p style={{ color: roleColor, fontSize: '20px', margin: '5px 0', fontWeight: 'bold' }}>
              {newRole ? newRole.charAt(0).toUpperCase() + newRole.slice(1) : 'Regular User'}
            </p>
          </div>
        </div>
        
        
        
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0' }}>
            Questions about your new role? WhatsApp me (sahir)
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: '10px 0 5px' }}>
            This is an automated message from the Bike Kitchen team management system.
          </p>
        </div>
      </div>
    </div>
  );
};
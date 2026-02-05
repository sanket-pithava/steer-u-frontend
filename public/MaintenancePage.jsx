import React from 'react';

export default function MaintenancePage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '60px 40px',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '20px'
        }}>
          🚧
        </div>
        
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px',
          margin: '0 0 10px 0'
        }}>
          Website Under Maintenance
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '20px',
          lineHeight: '1.6'
        }}>
          We're currently performing scheduled maintenance to improve your experience.
          We'll be back online shortly.
        </p>
        
        <p style={{
          fontSize: '14px',
          color: '#999',
          marginBottom: '30px'
        }}>
          Thank you for your patience!
        </p>
        
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a href="/" style={{
            display: 'inline-block',
            padding: '12px 30px',
            backgroundColor: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#764ba2'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
          >
            Refresh Page
          </a>
          
          <a href="https://twitter.com" style={{
            display: 'inline-block',
            padding: '12px 30px',
            backgroundColor: '#f0f0f0',
            color: '#333',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f0f0'}
          >
            Follow Updates
          </a>
        </div>
        
        <p style={{
          fontSize: '12px',
          color: '#bbb',
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #eee'
        }}>
          Check back soon • Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

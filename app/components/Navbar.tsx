"use client";

import React, { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <nav style={styles.nav}>
      <button onClick={handleHomeClick} style={styles.homeButton}>
        Home
      </button>
    </nav>
  );
};

const styles: { [key: string]: CSSProperties } = {
    nav: {
      backgroundColor: '#333',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    homeButton: {
      backgroundColor: '#4CAF50',
      border: 'none',
      color: 'white',
      padding: '10px 20px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px',
      cursor: 'pointer',
      borderRadius: '4px',
    },
  };

export default Navbar;
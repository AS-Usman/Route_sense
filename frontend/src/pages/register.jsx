import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { RegistrationForm } from '../components/RegistrationForm';

export function RegisterPage() {
  return (
    <LayoutWrapper>
      {({ addToast, user, setUser, logoutUser }) => (
        <div className="pt-24 pb-16">
          <RegistrationForm addToast={addToast} user={user} setUser={setUser} logoutUser={logoutUser} />
        </div>
      )}
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RegisterPage />
  </React.StrictMode>
);

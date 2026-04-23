import React from 'react';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import { AuthIcon, DoctorIcon } from '../components/auth/AuthIcon.jsx';
import EmailField from '../components/auth/EmailField.jsx';
import PasswordField from '../components/auth/PasswordField.jsx';
import SubmitButton from '../components/auth/SubmitButton.jsx';
import AuthLinks from '../components/auth/AuthLinks.jsx';
import { useDoctorLogin } from '../hooks/useDoctorLogin';

const Icon = () => <AuthIcon accent="green"><DoctorIcon /></AuthIcon>;

const DoctorLogin = () => {
  const { email, setEmail, password, setPassword, loading, onSubmit } = useDoctorLogin();

  return (
    <AuthLayout icon={<Icon />} title="Doctor Login" subtitle="Access your doctor dashboard">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <EmailField
            placeholder="doctor@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            accent="green"
          />
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            accent="green"
            showToggle={false}
          />
        </div>

        <SubmitButton loading={loading} loadingText="Logging in..." accent="green">
          Login as Doctor
        </SubmitButton>

        <AuthLinks
          accent="green"
          links={[
            { prefix: 'Admin?', to: '/admin-login', label: 'Login here' },
            { prefix: 'New Doctor?', to: '/doctor-signup', label: 'Register here' },
            { to: '/', label: '← Back to home', muted: true },
          ]}
        />
      </form>
    </AuthLayout>
  );
};

export default DoctorLogin;

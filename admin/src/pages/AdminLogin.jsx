import React from 'react';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import { AuthIcon, ShieldIcon } from '../components/auth/AuthIcon.jsx';
import EmailField from '../components/auth/EmailField.jsx';
import PasswordField from '../components/auth/PasswordField.jsx';
import SubmitButton from '../components/auth/SubmitButton.jsx';
import AuthLinks from '../components/auth/AuthLinks.jsx';
import { useAdminLogin } from '../hooks/useAdminLogin';

const Icon = () => <AuthIcon accent="blue"><ShieldIcon /></AuthIcon>;

const AdminLogin = () => {
  const { email, setEmail, password, setPassword, loading, onSubmit } = useAdminLogin();

  return (
    <AuthLayout
      icon={<Icon />}
      title="Admin Login"
      subtitle="Access the admin panel with admin email or recovery email"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <EmailField
            label="Email Address (Admin or Recovery Email)"
            placeholder="admin@example.com or recovery@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            accent="blue"
          />
          <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} accent="blue" />
        </div>

        <SubmitButton loading={loading} loadingText="Logging in..." accent="blue">
          Login as Admin
        </SubmitButton>

        <AuthLinks
          accent="blue"
          links={[
            { to: '/admin/forgot-password', label: 'Forgot Password?' },
            { prefix: 'Doctor?', to: '/doctor-login', label: 'Login here' },
            { prefix: 'New Doctor?', to: '/doctor-signup', label: 'Register here' },
            { to: '/', label: '← Back to home', muted: true },
          ]}
        />
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;

// TODO: Auth layout — wraps login and register pages
// - Center-aligned, full-page auth forms
// - Redirect to /dashboard if already authenticated
// - Platform branding / logo

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* TODO: Auth wrapper with branding */}
      {children}
    </div>
  );
}

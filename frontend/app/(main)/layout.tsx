// TODO: Main app layout — wraps all (main) pages
// - Sidebar navigation (Dashboard, Feed, Chat, Announcements, Calendar, Resources, IDE, Projects)
// - TanStack Query provider
// - Zustand auth check + redirect to /login if unauthenticated
// - Socket.io connection initialization
// - Notification toast container

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* TODO: Sidebar */}
      <main>{children}</main>
    </div>
  );
}

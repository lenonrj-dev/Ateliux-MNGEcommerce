import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import { UserProfileProvider } from "../../components/common/UserProfileProvider";

export default function ShellLayout({ children }) {
  return (
    <UserProfileProvider>
      <div className="grid grid-cols-[240px_1fr] min-h-dvh">
        <aside className="border-r border-slate-200 bg-white">
          <Sidebar />
        </aside>

        <div className="flex flex-col">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </UserProfileProvider>
  );
}

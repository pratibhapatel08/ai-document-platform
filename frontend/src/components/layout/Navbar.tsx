import { APP_NAME } from "@/lib/constants";
import { getHomeRoute } from "@/routes/RouteGuards";
import { useAuth } from "@/context";
import { Link } from "react-router-dom";
import { UserProfileDropdown } from "./UserProfileDropdown";

export const Navbar = () => {
  const { currentUser } = useAuth();
  const homeRoute = currentUser ? getHomeRoute(currentUser.role) : "/dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={homeRoute} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            AI
          </div>
          <span className="hidden text-sm font-semibold text-slate-900 sm:inline">{APP_NAME}</span>
        </Link>

        {currentUser ? <UserProfileDropdown /> : null}
      </div>
    </header>
  );
};

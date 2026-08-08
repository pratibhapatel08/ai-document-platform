import { Button } from "@/components/ui";
import { useAuth } from "@/context";
import { ROUTES } from "@/lib/constants";
import { getHomeRoute } from "@/routes/RouteGuards";
import { cn, getInitials } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const UserProfileDropdown = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          {getInitials(currentUser.name)}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
          <p className="text-xs capitalize text-slate-500">{currentUser.role}</p>
        </div>
        <span className={cn("hidden text-slate-400 transition-transform sm:inline", isOpen && "rotate-180")}>
          ▾
        </span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>

          <Link
            to={getHomeRoute(currentUser.role)}
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to={ROUTES.MY_DOCUMENTS}
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setIsOpen(false)}
          >
            My Documents
          </Link>

          <div className="mt-1 border-t border-slate-100 px-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => void handleLogout()}
              isLoading={isLoggingOut}
            >
              Logout
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function AppTopbar() {
  const { user, isLoaded } = useUser();

  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-zinc-800 bg-zinc-950 px-6">
      {isLoaded && user && (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">
              {user.fullName ?? user.username ?? "User"}
            </p>

            <p className="text-xs text-zinc-400">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9",
              },
            }}
          />
        </div>
      )}
    </header>
  );
}

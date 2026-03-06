"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function UserHeader() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { name, email, image } = session.user;

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {image && (
          <Image
            src={image}
            alt={name ?? "User avatar"}
            width={36}
            height={36}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-sm font-semibold text-gray-800 leading-tight">{name}</p>
          <p className="text-xs text-gray-400 leading-tight">{email}</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}

"use client";

import { useAtom } from "jotai";
import { userAtom } from "./atom";

export default function Home() {
  const [user] = useAtom(userAtom);

  // user.AccessToken
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-black">
      <div className="w-screen bg-white border-gray-200 border shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-900   mb-2 text-center">
          {"You're successfully Authenticated"}
        </h2>
        <label className="text-sm font-medium text-gray-900   mb-2 block">
          Access Token:
        </label>
        <div className="relative mb-4">
          <input
            type="text"
            className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={user.AccessToken}
            disabled
            readOnly
          />
        </div>
        <label className="text-sm font-medium text-gray-900   mb-2 block">
          Refresh Token:
        </label>
        <div className="relative mb-6">
          <input
            id="role-arn"
            type="text"
            className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            value={user.RefreshToken}
            disabled
            readOnly
          />
        </div>
      </div>
    </main>
  );
}

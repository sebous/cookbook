import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Navbar = () => {
  const { data: session } = useSession();
  const userImg = session?.user?.image;

  return (
    <div className="navbar md:sticky bg-base-300 top-0 z-50">
      <div className="flex-1">
        <Link href="/dashboard">
          <a className="btn btn-ghost normal-case text-xl">
            cookbook unbloatified
          </a>
        </Link>
      </div>
      {userImg && (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <Image
              src={userImg}
              alt="profile pic"
              layout="fill"
              objectFit="cover"
              className="w-10 rounded-full"
            />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">todo</span>
              </a>
            </li>
            <li>
              <a className="justify-between">
                Settings
                <span className="badge">todo</span>
              </a>
            </li>
            <li>
              <a className="justify-between">
                Logout
                <span className="badge">todo</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

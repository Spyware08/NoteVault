"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

export default function AuthLoader({ children }) {

  const dispatch = useDispatch();

  useEffect(() => {

    const loadUser = async () => {

      try {

        const res = await fetch("/api/auth/me");

        const data = await res.json();

        if (data.user) {
          dispatch(setUser(data.user));
        }

      } catch (error) {
        console.log(error);
      }

    };

    loadUser();

  }, [dispatch]);

  return children;
}
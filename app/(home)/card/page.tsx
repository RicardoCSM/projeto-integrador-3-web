"use client";

import StudentsCards from "@/components/common/students/students-cards";
import { useAuth } from "@/store/useAuth";

export default function StudentCard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <StudentsCards students={[user]} />;
}

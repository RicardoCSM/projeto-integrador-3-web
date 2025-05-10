"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "@/app/actions/students";
import { LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
const StudentsCards = dynamic(() => import("./students-cards"), { ssr: false });

const ListStudents = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const students = await fetchStudents();
      return students;
    },
  });

  if (error) {
    return <>Error: {error}</>;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="flex items-center justify-center w-full flex-1">
          <LoaderCircle className="mr-2 size-4 animate-spin" />
        </div>
      ) : (
        <>{data && <StudentsCards students={data} />}</>
      )}
    </div>
  );
};

export default ListStudents;

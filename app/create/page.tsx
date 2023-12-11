import CreateCourseForm from "@/components/CreateCourseForm";
import { getAuthSession } from "@/lib/auth";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const CreatePage = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/gallery");
  }
  return (
    <div className="flex flex-col items-start max-w-xl px-8 mx-auto my-16 sm:px-0">
      <h1 className="self-center text-3xl font-bold sm:text-6xl text-center">
        AI Based Learning <br /> Path Creator
      </h1>
      <div className="flex p-4 mt-5 border-none bg-secondary">
        <InfoIcon className="w-12 h-12 mr-3 text-blue-400 " />
        <div>
          Enter in title what you want to learn about. Then enter a list of
          units which are the specifics of your learning targets. Then our API
          will generate a <span className="italic">Learning Path</span> depends
          on your entries!
        </div>
      </div>
      <CreateCourseForm />
    </div>
  );
};

export default CreatePage;

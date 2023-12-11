"use client";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import React, { useState } from "react";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  clicked:boolean;
  setClicked:any
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIndex,clicked,setClicked }, ref) => {
    const [success, setSuccess] = useState<boolean | null>(null);
    const { mutate: getChapterInfo, isPending } = useMutation({
      mutationFn: async () => {
        const { data } = await axios.post("/api/chapter/getInfo", {
          chapterId: chapter.id,
        });
        return data;
      },
    });
    React.useImperativeHandle(ref, () => ({
      async triggerLoad() {
        getChapterInfo(undefined, {
          onSuccess: () => {
            setSuccess(true);
            setClicked(false)
          },
        });
      },
    }));
    return (
      <div
        key={chapter.id}
        className={cn("px-4 py-2 mt-2 rounded flex relative", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
      >
        <h5>{chapter.name}</h5>
        {success === null &&clicked&& (
          <div className="absolute top-[7px] -right-[20px]">
            <ClipLoader color="#fff" size={12} />
          </div>
        )}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";
export default ChapterCard;

"use client";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { useAnimate } from "framer-motion";
import { Loader2 } from "lucide-react";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
  completedChapters: Set<String>;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
    const [success, setSuccess] = useState<boolean | null>(null);
    const { mutate: getChapterInfo, isPending } = useMutation({
      mutationFn: async () => {
        const { data } = await axios.post("/api/chapter/getInfo", {
          chapterId: chapter.id,
        });
        return data;
      },
    });

    const addChapterId = useCallback(() => {
      const newSet = new Set(completedChapters);
      newSet.add(chapter.id);
      setCompletedChapters(newSet);
    }, [chapter, completedChapters, setCompletedChapters]);

    useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterId;
      }
    }, [chapter, addChapterId]);

    React.useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterId();
          return;
        }
        getChapterInfo(undefined, {
          onSuccess: ({ success }) => {
            setSuccess(success);
            addChapterId();
          },
          onError: (error) => {
            console.error(error);
            setSuccess(false);
            addChapterId();
          },
        });
      },
    }));
    return (
      <div
        key={chapter.id}
        className={cn("px-4 py-2 mt-2 rounded flex justify-between", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
      >
        <h5>{chapter.name}</h5>
        {isPending && <Loader2 className="animate-spin" />}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";
export default ChapterCard;

/* 
className={cn("px-4 py-2 mt-2 rounded flex relative", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
*/

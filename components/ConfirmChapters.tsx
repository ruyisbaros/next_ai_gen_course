"use client";
import { Chapter, Course, Unit } from "@prisma/client";
import React, { useMemo, useRef, useState } from "react";
import ChapterCard, { ChapterCardHandler } from "./ChapterCard";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const ConfirmChapters = ({ course }: Props) => {
  const chapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      //eslint-disable-next-line react-hooks/rules-of-hooks
      chapterRefs[chapter.id] = React.useRef(null);
    });
  });
  const [completedChapters, setCompletedChapters] = useState<Set<String>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  // console.log(chapterRefs);
  const totalChaptersCount = useMemo(() => {
    return course.units.reduce((ac, val) => {
      return ac + val.chapters.length;
    }, 0);
  }, [course.units]);
  return (
    <div className="w-full mt-4 ">
      {course.units.map((unit, unitIndex) => (
        <div key={unit.id} className="mt-5">
          <h2 className="text-sm uppercase text-secondary-foreground/60 ">
            Unit {unitIndex + 1}
          </h2>
          <h3 className="text-2xl font-bold">{unit.name}</h3>
          <div className="mt-3">
            {unit.chapters.map((chapter, chapterIndex) => (
              <ChapterCard
                ref={chapterRefs[chapter.id]}
                key={chapter.id}
                chapter={chapter}
                chapterIndex={chapterIndex}
                setCompletedChapters={setCompletedChapters}
                completedChapters={completedChapters}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center mt-4">
        <Separator className="flex-[1]" />
        <div className="flex items-center gap-[1rem] mx-4 ">
          <Link
            href="/create"
            className={buttonVariants({ variant: "secondary" })}
          >
            <ChevronLeft className="w-4 -4 mr-2" strokeWidth={4} />
            Go Back
          </Link>
          <Button
            type="button"
            disabled={loading}
            className="font-semibold"
            onClick={() => {
              Object.values(chapterRefs).forEach((val) => {
                val.current?.triggerLoad();
              });
              setLoading(true);
            }}
          >
            Generate
            <ChevronRight className="w-4 -4 ml-2" strokeWidth={4} />
          </Button>
        </div>
        <Separator className="flex-[1]" />
      </div>
    </div>
  );
};

export default ConfirmChapters;

"use client";
import { Chapter, Course, Unit } from "@prisma/client";
import React, { useRef, useState } from "react";
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
  const [clicked, setClicked] = useState(false);
  const chapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};
  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      //eslint-disable-next-line react-hooks/rules-of-hooks
      chapterRefs[chapter.id] = React.useRef(null);
    });
  });
  // console.log(chapterRefs);
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
                clicked={clicked}
                setClicked={setClicked}
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
            className="font-semibold"
            onClick={() => {
              Object.values(chapterRefs).forEach((val) => {
                val.current?.triggerLoad();
              });

              setClicked(true);
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

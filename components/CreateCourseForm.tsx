"use client";
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { createChapterSchema } from "@/validator/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

type Input = z.infer<typeof createChapterSchema>;

const CreateCourseForm = (props: Props) => {
  const router = useRouter();
  //const [pending, setPending] = useState<boolean | null>(null);
  const { mutate: createChapters, isPending } = useMutation({
    mutationFn: async ({ title, units }: Input) => {
      const { data } = await axios.post("/api/course/createChapters", {
        title,
        units,
      });
      console.log(data);
      //setPending(isPending);
      return data;
    },
  });
  //console.log(pending);
  const form = useForm<Input>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  const onSubmit = (data: Input) => {
    console.log("clicked");

    createChapters(data, {
      onSuccess: ({ course_id }) => {
        router.push(`/create/${course_id}`);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };
  form.watch();
  console.log(form.watch());
  return (
    <div className="w-full relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="w-full flex flex-col items-start sm:items-center sm:flex-row">
                  <FormLabel className="flex-[1] text-xl text-red-500">
                    Title
                  </FormLabel>
                  <FormControl className="flex-[6]">
                    <Input
                      placeholder="Enter the main topic of path..."
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <AnimatePresence>
            {form.watch("units").map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2 },
                }}
              >
                <FormField
                  control={form.control}
                  name={`units.${index}`}
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full flex flex-col items-start sm:items-center sm:flex-row">
                        <FormLabel className="flex-[1] text-xl">{`Unit ${
                          index + 1
                        }`}</FormLabel>
                        <FormControl className="flex-[6]">
                          <Input
                            placeholder="Enter the subtopic of the path..."
                            required
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-center justify-center mt-6">
            <Separator className="flex-[1]" />
            <div className="mx-4 ">
              <Button
                type="button"
                variant="secondary"
                className="font-semibold"
                onClick={() => {
                  form.setValue("units", [...form.watch("units"), ""]);
                }}
              >
                Add Unit
                <Plus className="w-4 h-4 ml-2 text-green-500" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="font-semibold ml-4"
                onClick={() => {
                  form.setValue("units", [...form.watch("units").slice(0, -1)]);
                }}
              >
                Remove Unit
                <Trash className="w-4 h-4 ml-2 text-red-500 font-bold" />
              </Button>
            </div>
            <Separator className="flex-[1]" />
          </div>
          <Button type="submit" className="w-full mt-6" size="lg">
            Create Course
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;

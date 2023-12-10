"use client";
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { createChapterSchema } from "@/validator/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
type Props = {};

type Input = z.infer<typeof createChapterSchema>;

const CreateCourseForm = (props: Props) => {
  const form = useForm<Input>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  const onSubmit = (data: Input) => {
    console.log(data);
  };
  form.watch();
  return (
    <div className="w-full ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="w-full flex flex-col items-start sm:items-center sm:flex-row">
                  <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                  <FormControl className="flex-[6]">
                    <Input
                      placeholder="Enter the main topic of the course..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          {form.watch("units").map((_, index) => (
            <FormField
              key={index}
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
                        placeholder="Enter the subtopic of the course..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          ))}
          <div className="flex items-center justify-center mt-4">
            <Separator className="flex-[1]" />
            <div className="mx-4 ">
              <Button variant="secondary" className="font-semibold">
                Add Unit
                <Plus className="w-4 h-4 ml-2 text-green-500" />
              </Button>
              <Button variant="secondary" className="font-semibold ml-2">
                Remove Unit
                <Trash className="w-4 h-4 ml-2 text-red-500 font-bold" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;

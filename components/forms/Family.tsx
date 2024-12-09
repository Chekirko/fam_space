"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// import { IFamilyDoc } from "@/database/family.model";
import { createFamily } from "@/lib/actions/family.action";
import { FamilySchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
const FamilyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const router = useRouter();
  const session = useSession();
  console.log(session?.data?.user?.id);

  const form = useForm<z.infer<typeof FamilySchema>>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const uploadToCloudinary = async (photo: File) => {
    const formData = new FormData();
    formData.append("file", photo);

    const res = await fetch("/api/cloudinary", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  const handleCreateFamily = async (data: z.infer<typeof FamilySchema>) => {
    setIsSubmitting(true);
    try {
      let photoUrl = "";
      if (photo) {
        photoUrl = await uploadToCloudinary(photo);
      }
      if (!session?.data?.user?.id) throw new Error("User not found");

      const family = await createFamily({
        name: data.name,
        description: data.description,
        image: photoUrl,
        creatorId: session?.data?.user?.id,
      });

      router.push(`/family/${family._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateFamily)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="">
                Name <span className="text-purple-800">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="min-h-[56px] border bg-purple-400"
                  {...field}
                />
              </FormControl>
              <FormDescription className=" mt-2.5 text-light-500">
                What is the name of your family?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="">
                Description <span className="text-purple-800">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="min-h-[56px] border bg-purple-400"
                  {...field}
                />
              </FormControl>
              <FormDescription className=" mt-2.5 text-light-500">
                Write a short description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="">Завантажити фото</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="min-h-[56px] border bg-purple-400"
                />
              </FormControl>
              {photoPreview && (
                <div className="mt-2">
                  <Image
                    width={60}
                    height={60}
                    src={photoPreview}
                    alt="Photo Preview"
                    className="size-32  rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    onClick={removePhoto}
                    className="mt-2 text-white"
                  >
                    Видалити фото
                  </Button>
                </div>
              )}
              <FormDescription className="mt-2.5 text-light-500">
                Add family image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className=" w-fit !text-light-900"
          >
            {isSubmitting ? "Submitting..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FamilyForm;

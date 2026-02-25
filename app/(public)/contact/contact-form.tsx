"use client";

import { z } from "zod";
import { useTransition } from "react";
import { Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendContactEmail } from "@/app/actions/contact/sendContactEmail";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SUBJECTS = [
  { value: "General", label: "General Inquiry" },
  { value: "Event Submission", label: "Event Submission" },
  { value: "Bug Report", label: "Bug Report" },
  { value: "Partnership", label: "Partnership" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      try {
        const result = await sendContactEmail(values);

        if (result.success) {
          toast.success(
            "Message sent! We'll get back to you within 24–48 hours."
          );
          form.reset();
        } else {
          toast.error(result.error ?? "Something went wrong.");
        }
      } catch {
        toast.error("Failed to send message. Please try again later.");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 h-full"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex gap-1'>
                  Name
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex gap-1'>
                  Email
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Subject */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className='flex gap-1'>
                Subject
                <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex gap-1'>
                Message
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Tell us what's on your mind…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Formcontact() {
  const t = useTranslations("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  // Schema
  const formSchema = z.object({
    namaLengkap: z.string().min(8, {
      message: t("alert_message_name"),
    }),
    alamatEmail: z.string().email({
      message: t("alert_message_email"),
    }),
    nomorTelepon: z.string().min(10, {
      message: t("alert_message_telp"),
    }),
    kotaAnda: z.string().min(8, {
      message: t("alert_message_city"),
    }),
    pesan: z.string().min(10, {
      message: t("alert_message"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaLengkap: "",
      alamatEmail: "",
      nomorTelepon: "",
      kotaAnda: "",
      pesan: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Ganti dengan URL Google Apps Script Web App Anda
      const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbxu8NBrP0d06tK0YBPdKLr1OgJrspV6eXQ05d5wFqawJ2gqb6Ci_kTUon5EOJ6XOS0YOQ/exec";

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namaLengkap: values.namaLengkap,
          alamatEmail: values.alamatEmail,
          nomorTelepon: values.nomorTelepon,
          kotaAnda: values.kotaAnda,
          pesan: values.pesan,
          timestamp: new Date().toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          }),
        }),
      });

      // Reset form setelah berhasil submit
      form.reset();
      setShowSuccessDialog(true);

      // Auto close dialog setelah 3 detik
      setTimeout(() => {
        setShowSuccessDialog(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <FormField
              control={form.control}
              name="namaLengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    {t("form_1")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-gray-400 px-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alamat Email */}
            <FormField
              control={form.control}
              name="alamatEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    {t("form_2")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder=""
                      {...field}
                      className="border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-gray-400 px-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nomor Telepon */}
            <FormField
              control={form.control}
              name="nomorTelepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    {t("form_3")}* (Ex.+62812 7777 1111)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-gray-400 px-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kota Anda */}
            <FormField
              control={form.control}
              name="kotaAnda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">
                    {t("form_4")}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-gray-400 px-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pesan */}
          <FormField
            control={form.control}
            name="pesan"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-500 pb-5">
                  {t("form_5")}...
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=""
                    {...field}
                    rows={6}
                    className="border-2 resize-none focus:ring-0 focus:border-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-5 rounded-full text-base disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("form_send")}
                </>
              ) : (
                t("form_submit")
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Pesan Anda berhasil dikirim!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Terima kasih. Tim kami akan segera menghubungi Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-8"
            >
              Closed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

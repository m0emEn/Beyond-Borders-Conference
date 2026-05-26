import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  paymentProof: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }, pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for payment proof:", file.url);
      
      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedUrl: file.url };
    }),

  sessionPlan: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 }, blob: { maxFileSize: "8MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for session plan:", file.url);
      return { uploadedUrl: file.url };
    }),

  galleryMedia: f({ image: { maxFileSize: "8MB", maxFileCount: 1 }, video: { maxFileSize: "32MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for gallery media:", file.url);
      return { uploadedUrl: file.url, type: file.type.startsWith("video") ? "VIDEO" : "IMAGE" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

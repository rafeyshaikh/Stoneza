export async function uploadAdminImage(file, folder = "uploads") {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (response.status === 413) {
      throw new Error("Image file is too large. Please select an image under 10MB.");
    }
    throw new Error(`Upload failed with status ${response.status} (${response.statusText || "Server error"})`);
  }

  if (!response.ok || !data.success) {
    throw new Error(data?.message || "Image upload failed");
  }

  return data.data; // returns { url, publicId }
}

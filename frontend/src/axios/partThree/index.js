import axios from "axios";

export const uploadImg = async (file) => {
  const formData = new FormData();
  formData.append("smfile", file);
  return await axios.post("/api/v2/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "SBla1ckE7r3c8z0KtSFyrtIiZIRdiSwc",
    },
  });
};

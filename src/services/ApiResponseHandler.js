// import { toasted } from "@/utils/utils";

import { toasted } from "@/utils/utils";

export async function responseHandler(request) {
  try {
    console.log('[ResponseHandler] Processing request...');
    const res = await request;
    console.log('[ResponseHandler] Response received:', res.status, res.data);
    return {
      status: 200,
      data: res.data,
      success: true,
      error: "",
    };
  } catch (error) {
    // When the request reaches the server but returns an error
    if (error.response) {
      const data = error.response?.data;
      let errMsg = '';

      if (typeof data === "string") {
        // Clean leading "Error:" if present
        errMsg = data.replace(/^Error:\s*/i, "").trim();
      } else if (data?.message) {
        errMsg = String(data.message);
      } else if (data?.error) {
        errMsg = String(data.error);
      } else {
        errMsg = error.message || "Request failed";
      }

      toasted(false, "", errMsg);

      return {
        success: false,
        status: error.response.status,
        error: errMsg,
      };
    }

    // Request never reached the server
    if (error.request) {
      toasted(false, "", error.message);
      return {
        success: false,
        status: error.code,
        error: error.message,
      };
    }
  }

  return {
    success: false,
    status: 500,
    error: "Unexpected error",
  };
}

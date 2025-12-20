import { toasted } from "@/utils/toast";

export async function responseHandler(request) {
  try {
    console.log('[ResponseHandler] Processing request...');
    const res = await request;
    console.log('[ResponseHandler] Response received:', res.status, res.data);

    const data = res?.data;
    if (data && typeof data === 'object') {
      const statusCode = Number(data.statusCode);
      if ((Number.isFinite(statusCode) && statusCode >= 400) || data.success === false) {
        const errMsg = data?.message ? String(data.message) : (data?.error ? String(data.error) : 'Request failed');

        setTimeout(() => {
          toasted(false, '', errMsg);
        }, 0);

        return {
          success: false,
          status: Number.isFinite(statusCode) ? statusCode : res.status,
          error: errMsg,
          data,
        };
      }
    }

    return {
      status: res.status,
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

      // Use setTimeout to avoid calling hooks outside component context
      setTimeout(() => {
        toasted(false, "", errMsg);
      }, 0);

      return {
        success: false,
        status: error.response.status,
        error: errMsg,
      };
    }

    // Request never reached the server
    if (error.request) {
      setTimeout(() => {
        toasted(false, "", error.message);
      }, 0);
      
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

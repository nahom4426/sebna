import { addToast } from "@/toast";

let id = 0;
function* getId() {
  while (true) {
    yield `generated_id_${++id}`;
  }
}

export const genId = getId();
export function getQueryFormObject(query) {
  return Object.keys(query).reduce((querys, q, idx) => {
    querys += `${q}=${query[q]}`;
    if (idx != Object.keys(query).length - 1) querys += `&`;
    return querys;
  }, "?");
}

export const toast = {
  success: (message) => {
    addToast({
      type: "success",
      message,
    });
  },
  error: (message) => {
    addToast({
      type: "error",
      message,
    });
  },
};
export async function fakeReq(
  time = 200,
  success = true,
  data,
  error,
  status = 200
) {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        success,
        data,
        error,
        status,
      });
    }, time);
  });
}
export function toasted(type, succMsg, errMsg) {
  if (type) {
    toast.success(succMsg);
  } else {
    toast.error(errMsg);
  }
}

export function addFullname(data) {
  if (!(data instanceof Array)) return;
  return data.reduce((el, payload) => {
    payload.fullname = `${payload.firstName} ${payload.fatherName} ${payload.grandFatherName}`;
    el.push(payload);
    return el;
  }, []);
}

export function getImageUrlFormBlob(blob) {
  if (!blob) return;
  return URL.createObjectURL(blob);
}

export function getExtension(filename) {
  if (!filename) return;

  const extension = filename.match(/\.([^.]+)$/)?.[1];
  return extension;
}

export function getFileType(filename) {
  if (!filename) return;
  const ext = getExtension(filename);
  if (imageExtensions.includes(ext)) return "img";
  if (documentExtensions.includes(ext)) return "file";
  if (videoFileTypes.includes(ext)) return "video";
}

const response = {
  success: false,
  data: "",
  status: null,
  error: "",
};
export async function allRequest(funs) {
  try {
    const keys = Object.keys(funs);

    const res = await Promise.all(keys.map((name) => funs[name]));

    return {
      success: res.every((r) => r.success),
      data: keys.reduce((state, name, idx) => {
        state[name] = res[idx]?.data;
        return state;
      }, {}),
      status: 200,
      error: keys.reduce((state, name, idx) => {
        state[name] = res[idx]?.error;
        return state;
      }, {}),
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      status: err?.response?.status,
      error: err?.message,
    };
  }
}

export function formatCurrency(currencyValue) {
  if ([undefined, null].includes(currencyValue)) return;
  const currencyFormat = new Intl.NumberFormat("am-ET", {
    style: "currency",
    currency: "ETB",
  }).format(parseInt(currencyValue));
  return currencyFormat;
}
export function getColumnValue(key, row) {
  return key.split(".").reduce((all, el) => {
    return all?.[el];
  }, row);
}

export function secondDateFormat(d) {
  if (!d) return " ";
  try {
    const date = new Date(d);
    const dateFormat = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
    return dateFormat;
  } catch (err) {
    return "";
  }
}

export function secondDateFormatWithTime(d) {
  if (!d) return " ";
  try {
    const date = new Date(d);
    const dateFormat = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
    return dateFormat;
  } catch (err) {
    return "";
  }
}

export function getAgeFormDate(date) {
  const now = new Date().getFullYear();
  const age = new Date(date).getFullYear();
  return parseInt(now - age);
}

export async function getBgbase64Url(url) {
  return new Promise(async (res) => {
    const logoBlob = await (await fetch(url)).blob();
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      res(base64Image);
    };
    reader.readAsDataURL(logoBlob);
  });
}

export function removeUndefined(values) {
  return JSON.parse(JSON.stringify(values));
}

export function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function addYear(date, year) {
  const givenDate = new Date(date);

  // Add two years
  const modifiedDate = new Date(givenDate);
  modifiedDate.setFullYear(modifiedDate.getFullYear() + year);

  console.log(modifiedDate);
  return modifiedDate;
}

export async function aggregateFunctionResponse(req) {
  const keys = Object.keys(req);
  try {
    const res = await Promise.all(keys.map((key) => req[key]));
    return {
      success: true,
      data: keys.reduce((state, el, idx) => {
        state[el] = res?.[idx]?.data;
        return state;
      }, {}),
    };
  } catch (err) {
    return {
      success: false,
      data: "",
      error: err.message,
    };
  }
}

export function getFormData(data) {
  const fd = new FormData();
  Object.keys(data).forEach((key) => {
    fd.append(key, data[key]);
  });
  return fd;
}

export function addDay(date, date2) {
  const givenDate = new Date(date);

  // Add two years
  const modifiedDate = new Date(givenDate);
  modifiedDate.setUTCDate(modifiedDate.getDay() + date2);

  return modifiedDate;
}

export function addDayToDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDateToYYMMDD(date) {
  if (!date) return undefined;

  const year = date.getFullYear().toString(); // Extract the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month ranges from 0 to 11, so add 1 and pad with leading zero if necessary
  const day = date.getDate().toString().padStart(2, "0"); // Pad day with leading zero if necessary

  return `${year}-${month}-${day}`;
}

export function formatDateToDDMMYY(date) {
  if (!date) return undefined;

  const year = date.getFullYear().toString(); // Extract the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month ranges from 0 to 11, so add 1 and pad with leading zero if necessary
  const day = date.getDate().toString().padStart(2, "0"); // Pad day with leading zero if necessary

  return `${year}-${month}-${day}`;
}

export function formatNumber(number) {
  const formatter = new Intl.NumberFormat("en-US");

  const formattedNumber = formatter.format(number);
  return formattedNumber;
}

export const imageExtensions = [
  "jpeg",
  "jpg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "webp",
  "svg",
  "ico",
  "jfif",
  "jpe",
  "jif",
  "jfif-tbnl",
  "jfi",
  "jp2",
  "jpx",
  "j2k",
  "j2c",
  "fpx",
  "pcd",
];

export const documentExtensions = [
  "txt",
  "doc",
  "docx",
  "rtf",
  "pdf",
  "odt",
  "xls",
  "xlsx",
  "csv",
  "ppt",
  "pptx",
  "pps",
  "odp",
  "ods",
  "odp",
  "odg",
  "odf",
  "odc",
  "odm",
  "ott",
  "oth",
  "odft",
  "pub",
  "pages",
  "numbers",
  "key",
];

const videoFileTypes = [
  "mp4",
  "webm",
  "ogg",
  "mpeg",
  "3gpp",
  "3gpp2",
  "x-ms",
  "x-flv",
  "x-matroska",
  "x-ms-wmv",
  "quicktime",
  "x-ms-asf",
  "x-ms-dvr",
  "x-ms-dxv",
  "x-ms-wvx",
  "x-la-asf",
  "x-ms-vob",
  "x-ms-wmx",
  "vnd.dlna.mpeg-tts",
  "vnd.dlna.mpeg-tts-protected",
  "vnd.sealed.mpeg1",
  "vnd.sealed.mpeg4",
  "vnd.sealed.swf",
  "vnd.sealedmedia.softseal.mov",
  "x-f4v",
  "x-fli",
  "x-flic",
  "x-m4v",
  "x-mng",
  "x-ms-ivf",
  "x-sgi-movie",
  "x-smv",
  "x-swf",
  "x-vob",
];

export const instructions = [
  "Before Meals",
  "Empty stomach",
  "After meals",
  "In the morning",
  "In the evening",
  "At bedtime",
  "Immediately",
  "'As directed",
];

export const Gender = {
  MALE: "Male",
  FEMALE: "Female",
};
export const hospitals = [
  "Tikur Anbessa Hospital",
  "Cadisco Hospital",
  "Ayat Hospital",
  "Lancet Hospital",
  "Biras Hospital",
];
export async function convertBase64Image(
  base64String,
  outputFormat = "image/png",
  quality = 0.92
) {
  return new Promise((resolve, reject) => {
    try {
      const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(base64String);
      if (!isBase64) {
        return reject(new Error("Invalid Base64 string"));
      }

      if (!base64String.startsWith("data:image/")) {
        base64String = `data:image/png;base64,${base64String}`;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const convertedData = canvas.toDataURL(outputFormat, quality);
        resolve(convertedData);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = base64String;
    } catch (error) {
      reject(error);
    }
  });
}

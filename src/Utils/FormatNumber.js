// تبدیل اعداد انگلیسی به فارسی
export const toPersianNumber = (num) => {
  if (num === null || num === undefined) return "";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return num.toString().replace(/\d/g, (d) => persianDigits[d]);
};

// فرمت قیمت با جداکننده هزارگان + فارسی
export const formatPrice = (price) => {
  if (!price && price !== 0) return "";
  return toPersianNumber(Number(price).toLocaleString("en-US"));
};

// فرمت اعداد ساده (مثل بازدید، تعداد)
export const formatNumber = (num) => {
  if (!num && num !== 0) return "";
  return toPersianNumber(Number(num).toLocaleString("en-US"));
};

// فرمت تاریخ (اختیاری)
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fa-IR");
};

// فرمت زمان (مثل 2:30)
export const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return toPersianNumber(`${min}:${sec < 10 ? "0" + sec : sec}`);
};
// تبدیل اعداد فارسی به انگلیسی
export const toEnglishNumber = (str) => {
  if (!str) return "";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";
  return str.replace(/[۰-۹]/g, (d) => englishDigits[persianDigits.indexOf(d)]);
};
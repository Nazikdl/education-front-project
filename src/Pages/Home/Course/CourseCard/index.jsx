import React, { useRef, useState } from "react";
import { Button } from "antd";
import { Heart, ShoppingBag, Star, Tags, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  selectIsInCart,
  selectToken,
} from "../../../../Store/Slices/CartSlice";
import notify from "../../../../Utils/Notify";
import { formatPrice, toPersianNumber } from "../../../../Utils/FormatNumber";

const CURRENCY = "تومان"; 


function Shimmer({ delay = 0 }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      initial={{ x: "100%" }}
      animate={{ x: "-100%" }}
      transition={{ duration: 1.5, ease: "linear", repeat: Infinity, delay }}
    />
  );
}

export function CourseCardSkeleton({ delay = 0 }) {
  return (
    <div className="glass-card relative flex w-full flex-col gap-2 !rounded-md !px-3 !py-3 sm:!px-4 sm:!py-4">
      <div className="aspect-[16/10] w-full shrink-0 rounded-md bg-white/15" />
      <div className="h-4 w-3/4 shrink-0 rounded bg-white/15" />
      <div className="h-3 w-1/4 shrink-0 rounded bg-white/15" />
      <div className="flex min-h-[3.6em] flex-col justify-center gap-1.5 text-xs sm:text-sm">
        <div className="h-2.5 w-full rounded bg-white/15" />
        <div className="h-2.5 w-2/3 rounded bg-white/15" />
      </div>
      <div className="h-5 w-1/2 shrink-0 rounded bg-white/15" />
      <div className="!mt-auto flex shrink-0 gap-1.5">
        <div className="h-9 w-9 shrink-0 rounded-full bg-white/15" />
        <div className="h-9 flex-1 rounded-md bg-white/15" />
      </div>
      <Shimmer delay={delay} />
    </div>
  );
}

/* ============================================================
   کارت دوره
   course     : کل آبجکت دوره (از Course.jsx)
   open       : این کارت الان باز است؟ (فقط یک کارت هم‌زمان باز می‌ماند)
   onToggle   : باز/بسته کردن (در والد مدیریت می‌شود)
   isFav      : این دوره جزو علاقه‌مندی‌های کاربر است؟ (از والد)
   onToggleFav: زدن روی قلب (درخواست را والد می‌فرستد)
   ============================================================ */
export default function CourseCard({
  course,
  open = false,
  onToggle,
  isFav = false,
  onToggleFav,
}) {
  const {
    _id: id,
    title,
    slug,
    image: img,
    description: des,
    discountPercent = 0,
    finalPrice,
    price,
    avgRating = 0,
    isFree,
  } = course ?? {};

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduce = useReducedMotion();

  const token = useSelector(selectToken);
  const inCart = useSelector(selectIsInCart(id));
  const [cartLoading, setCartLoading] = useState(false);

  const filledHeart = !!token && isFav;
  const hasDiscount = !isFree && discountPercent > 0;
  const payable = hasDiscount ? (finalPrice ?? price) : price;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // وقتی کارت باز می‌شود، ارتفاعش قفل می‌شود تا اندازه‌ی کارت عوض نشود
  const rootRef = useRef(null);
  const [lockH, setLockH] = useState(null);
  const compact = lockH !== null;

  // اگه لاگین نیست: پیام بده، ببر به صفحه‌ی ورود و false برگردان
  const requireLogin = (text) => {
    if (token) return true;
    notify("error", text);
    navigate("/auth");
    return false;
  };

  const handleBag = () => {
    if (!requireLogin("برای افزودن به سبد خرید وارد حساب کاربری شوید")) return;
    if (!open) setLockH(rootRef.current.getBoundingClientRect().height);
    onToggle?.();
  };

  const handleHeart = () => {
    if (!requireLogin("برای افزودن به علاقه‌مندی‌ها وارد حساب کاربری شوید")) return;
    onToggleFav?.();
  };

  const handleCart = async () => {
    setCartLoading(true);
    const res = await dispatch(inCart ? removeItem(id) : addItem(id));
    setCartLoading(false);
    notify(res.success ? "success" : "error", res.message);
  };

  return (
    <div
      ref={rootRef}
      data-course-id={id}
      className="glass-card group relative flex w-full flex-col gap-2 !rounded-md !px-5 !py-4 hover:-translate-y-1.5 sm:!px-5 sm:!py-5"
      style={compact ? { height: lockH } : undefined}
    >
      {/* ---------- نوار مورب تخفیف (گوشه‌ی راست) ---------- */}
      {hasDiscount && (
        <div
          role="img"
          aria-label={`${toPersianNumber(discountPercent)} درصد تخفیف`}
          className="pointer-events-none absolute right-0 font-yekan top-0 z-20 h-20 w-20 overflow-hidden"
        >
          <span
            dir="ltr"
            className="absolute right-[-30px] top-[14px] block w-[110px] rotate-45 overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold text-center text-[11px] font-black leading-5 text-[#0b1457] shadow-md"
          >
            {toPersianNumber(discountPercent)} %
            {!reduce && (
              <motion.i
                className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                initial={{ x: "-150%" }}
                animate={{ x: "450%" }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            )}
          </span>
        </div>
      )}

      {/* ---------- عکس + قلب ---------- */}
      <div className="relative aspect-[16/10] w-full  shrink-0 overflow-hidden rounded-md bg-white/10">
        {!imgLoaded && !imgError && <Shimmer />}
        {!imgError && (
          <img
            src={import.meta.env.VITE_BASE_FILE + img}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <Button
          shape="circle"
          aria-label={
            filledHeart ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
          }
          aria-pressed={filledHeart}
          onClick={handleHeart}
          className="!absolute !left-2 !top-2 !z-10 !flex !h-8 !w-8 !min-w-0 !items-center !justify-center !border-0 !bg-black/40 !p-0 backdrop-blur-sm"
          icon={
            <motion.span
              className="flex"
              initial={false}
              animate={{ scale: filledHeart && !reduce ? [1, 1.4, 1] : 1 }}
              transition={{ duration: 0.35 }}
            >
              <Heart
                size={17}
                className={
                  filledHeart ? "fill-red-500 text-red-500" : "text-white"
                }
              />
            </motion.span>
          }
        />
      </div>

      {/* ---------- عنوان و امتیاز ---------- */}
      <h4
        title={title}
        className="line-clamp-1 shrink-0 text-sm !my-2 font-yekan !px-2  sm:text-base"
      >
        {title}
      </h4>
      <div className="flex shrink-0 font-vazir items-center gap-1 !px-2 text-xs text-white/70">
        <Star size={14} className="fill-gold text-gold" />
        <span>
          {avgRating > 0 ? toPersianNumber(Number(avgRating).toFixed(1)) : "جدید"}
        </span>
      </div>

      {/* ---------- توضیح (بخش انعطاف‌پذیر؛ وقتی کارت باز می‌شود جا را به دکمه می‌دهد) ---------- */}
      <motion.div
        className="overflow-hidden font-vazir text-[10px] !px-2 sm:text-xs"
        style={{ minHeight: compact ? 0 : "3.6em" }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
      >
        <p className="line-clamp-2">{des}</p>
      </motion.div>

      {/* ---------- قیمت: خط اول قیمت قبلی (یا خالی)، خط دوم قیمت نهایی ---------- */}
      <div className="shrink-0 !px-2">
        <div className="h-4 text-[11px] leading-4 font-vazir text-white/45 line-through">
          {hasDiscount ? formatPrice(price) : ""}
        </div>
        {isFree ? (
          <p className="flex items-center gap-1 text-sm font-vazir-bold !text-gold sm:text-base">
            رایگان <Tags size={16} />
          </p>
        ) : (
          <p className="text-sm font-vazir-bold !text-gold sm:text-base">
            {formatPrice(payable)}{" "}
            <small className="text-[10px] font-normal text-white/60">
              {CURRENCY}
            </small>
          </p>
        )}
      </div>

      {/* ---------- دکمه‌ها ---------- */}
      <div className="!mt-auto shrink-0">
        <div className="flex items-center gap-1.5">
          {!isFree && (
            <Button
              shape="circle"
              aria-label={inCart ? "این دوره در سبد خرید شماست" : "سبد خرید"}
              aria-expanded={open}
              onClick={handleBag}
              icon={<ShoppingBag size={17} />}
              className={`!flex !h-9 !w-9 !min-w-0 shrink-0 !items-center !justify-center !border !p-0 ${
                inCart
                  ? "!border-gold !bg-gold !text-[#0b1457]"
                  : "!border-white/25 !bg-white/10 !text-white"
              }`}
            />
          )}
          <Button
            className="gold-btn !h-9 !min-w-0 !flex-1 !px-2 !py-0 !text-xs sm:!text-sm"
            onClick={() => navigate(`/courses/${id}/${slug}`)}
          >
            اطلاعات دوره
          </Button>
        </div>

        {/* دکمه‌ی پنهان: با زدن روی سبد زیر ردیف باز می‌شود */}
        {!isFree && (
          <motion.div
            className="overflow-hidden"
            initial={false}
            animate={{ height: open ? 42 : 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: "easeInOut" }}
            onAnimationComplete={() => {
              if (!open) setLockH(null);
            }}
            aria-hidden={!open}
          >
            <div className="!pt-1.5">
              <Button
                type={inCart ? "default" : "primary"}
                tabIndex={open ? 0 : -1}
                loading={cartLoading}
                onClick={handleCart}
                icon={inCart ? <Trash2 size={16} /> : <ShoppingBag size={16} />}
                className={`!flex !h-9 !w-full !items-center !justify-center !py-0 !text-xs sm:!text-sm ${
                  inCart ? "gold-btn-outline" : ""
                }`}
              >
                {inCart ? "حذف از سبد خرید" : "افزودن به سبد خرید"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
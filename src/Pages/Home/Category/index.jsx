import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import fetchData from "../../../Utils/FetchData";
import CategoryCard from "./CategoryCard";
import { SectionStars } from "../../Decor";


const getPerView = () => {
  if (typeof window === "undefined") return 6;
  const w = window.innerWidth;
  if (w >= 1024) return 6;
  if (w >= 768) return 4;
  if (w >= 640) return 3;
  return 2;
};

function usePerView() {
  const [perView, setPerView] = useState(getPerView);
  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return perView;
}

/* ============================================================
   اسکلتون (شیمر موجی)
   ============================================================ */
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

function CategoryCardSkeleton({ delay }) {
  return (
    <div className="glass-card relative flex w-full flex-col items-center justify-center gap-4 rounded-md !p-5">
      <div className="h-20 w-20 rounded-full bg-white/15" />
      <div className="!my-1 h-4 w-3/4 rounded bg-white/15" />
      <Shimmer delay={delay} />
    </div>
  );
}

function CategorySkeleton({ perView }) {
  return (
    <div className="flex">
      {Array.from({ length: perView }).map((_, i) => (
        <div
          key={i}
          className="flex shrink-0 !px-2 !py-5 sm:!px-3"
          style={{ flexBasis: `${100 / perView}%` }}
        >
          <CategoryCardSkeleton delay={i * 0.15} />
        </div>
      ))}
    </div>
  );
}

/*
  className برای جابه‌جایی بصری فلش (relative + right/left).
  relative z-10: فلش روی کارت‌ها بیاید، بدون اینکه چیدمان فلکس عوض شود.
*/
function Arrow({ label, onClick, disabled, className = "", children }) {
  return (
    <motion.div
      className={`relative z-10 shrink-0 ${className}`}
      whileHover={disabled ? undefined : { scale: 1.1 }}
      whileTap={disabled ? undefined : { scale: 0.9 }}
    >
      <Button
        shape="circle"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        icon={children}
        className="!flex !h-6 !w-6 !min-w-0 !border-0 !bg-[#132494] !items-center !text-white !justify-center !p-0 sm:!h-8 sm:!w-8"
      />
    </motion.div>
  );
}

/* ============================================================
   کامپوننت اصلی
   ============================================================ */
export default function Category() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const perView = usePerView();

  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.3 });
  const [pos, setPos] = useState(0);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchData("Categories?limit=20", {
        method: "GET",
        headers: { "content-type": "application/json" },
      });
      if (result.success) {
        setCategory(result?.data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const N = category.length;
  const canSlide = N > perView;
  const slides = canSlide ? [...category, ...category, ...category] : category;
  const s = canSlide ? N + pos : 0; 

  const goNext = () => {
    if (!canSlide || pos + 1 > 2 * N - perView) return;
    setInstant(false);
    setPos(pos + 1);
  };
  const goPrev = () => {
    if (!canSlide || pos - 1 < -N) return;
    setInstant(false);
    setPos(pos - 1);
  };

  const handleSettled = () => {
    if (!canSlide) return;
    if (pos >= N) {
      setInstant(true);
      setPos(pos - N);
    } else if (pos < 0) {
      setInstant(true);
      setPos(pos + N);
    }
  };

  if (!loading && N === 0) return null;

  return (
    <section className="relative flex flex-col items-center justify-center !my-5 !mt-10 gap-2">
      <SectionStars preset="a" />
      <h3 className="!mb-4 flex flex-wrap items-center justify-center text-center">
        🔥 محبوب ترین
        <span className="text-gold font-vazir-bold !px-3"> دسته بندی ها </span>
      </h3>

      <div
        ref={wrapRef}
        className="flex w-full max-w-[1200px] items-center !gap-1 !px-6 sm:!gap-1 sm:!px-14"
      >
        {/* راست = قبلی (در RTL اولین عنصر سمت راست است) */}
        {(loading || canSlide) && (
          <Arrow
            className="right-6 sm:right-7"
            label="قبلی"
            onClick={goPrev}
            disabled={loading}
          >
            <ChevronRight size={20} />
          </Arrow>
        )}

        <div className="min-w-0 flex-1 overflow-hidden">
          {loading ? (
            <CategorySkeleton perView={perView} />
          ) : (
            <motion.div
              className="flex"
              initial={false}
              animate={{ x: `${s * (100 / perView)}%` }}
              transition={
                instant
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 260, damping: 32 }
              }
              onAnimationComplete={handleSettled}
            >
              {slides.map((item, g) => {
                const first = canSlide ? g - N : g;
                const delay = first >= 0 && first < perView ? first * 0.1 : 0;
                return (
                  <motion.div
                    key={`${g}-${item?._id}`}
                    className="flex shrink-0 !px-1 !py-5 sm:!px-2"
                    style={{ flexBasis: `${100 / perView}%` }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay }}
                  >
                    <CategoryCard
                      img={item?.image}
                      id={item?._id}
                      title={item?.title}
                      slug={item?.slug}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* چپ = بعدی */}
        {(loading || canSlide) && (
          <Arrow
            className="left-5 sm:left-7"
            label="بعدی"
            onClick={goNext}
            disabled={loading}
          >
            <ChevronLeft size={18} />
          </Arrow>
        )}
      </div>
    </section>
  );
}
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import notify from "../../../Utils/Notify";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/FetchData";
import CourseCard, { CourseCardSkeleton } from "./CourseCard";
import { RocketMan, SectionStars, SparkleStar, Star } from "../../Decor";

export default function Course() {
  // نام state را courses گذاشتم تا با پراپ course (یک دوره) اشتباه نشود
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null); // هر لحظه فقط یک کارت باز است

  // علاقه‌مندی‌ها
  const { token, user } = useSelector((state) => state.auth);
  const [favIds, setFavIds] = useState([]);
  // ⚠️ اگه بک‌اندت توکن را جور دیگری می‌خواهد، فقط همین خط را عوض کن
  const headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchData("courses?limit=20", {
        method: "GET",
        headers: { "content-type": "application/json" },
      });
      if (result.success) {
        setCourses(result?.data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  // یک فچ: لیست علاقه‌مندی‌های کاربر (فقط وقتی لاگین است)
  useEffect(() => {
    if (!token) return setFavIds([]);
    (async () => {
      const res = await fetchData(`users/${user._id}`, { headers });
      const u = Array.isArray(res.data) ? res.data[0] : res.data;
      setFavIds((u?.favoriteCourseIds ?? []).map((c) => c._id));
    })();
  }, [token]);

  // زدن روی قلب: بعد از موفق بودن، توی لیست اضافه یا حذف می‌شود
  const toggleFav = async (id) => {
    const res = await fetchData(`courses/${id}/favorite`, {
      method: "PATCH",
      headers,
    });
    if (!res.success) return notify("error", res.message);
    setFavIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    notify("success", res.message);
  };

  // بستن کارت باز: Esc، کلیک بیرون از همان کارت، یا تغییر عرض صفحه
  useEffect(() => {
    if (!openId) return;
    let width = window.innerWidth;
    const onKey = (e) => e.key === "Escape" && setOpenId(null);
    const onDown = (e) => {
      const card = e.target.closest?.("[data-course-id]");
      if (!card || card.dataset.courseId !== openId) setOpenId(null);
    };
    const onResize = () => {
      // موبایل با جمع‌شدن نوار آدرس هم resize می‌دهد؛ فقط تغییر عرض مهم است
      if (window.innerWidth !== width) setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, [openId]);

  const items = courses.map((cr, i) => (
    <motion.div
      key={cr?._id}
      className="flex"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.1 }}
    >
     
      <CourseCard
        course={cr}
        open={openId === cr?._id}
        isFav={favIds.includes(cr?._id)}
        onToggleFav={() => toggleFav(cr?._id)}
        onToggle={() => setOpenId((prev) => (prev === cr?._id ? null : cr?._id))}
      />
    </motion.div>
  ));

  return (
    <section className="relative overflow-hidden flex flex-col items-center !py-10 justify-center !my-5 !mt-20 gap-2">
      <div className="flex items-center justify-between gap-0 mx-auto">
        <SparkleStar className="w-15 absolute right-60 z-10" />
        <h3 className="!mb-12 flex flex-wrap items-center justify-center text-center">
          تخصصی ترین
          <span className="text-gold font-vazir-bold !px-3"> دوره ها </span>
        </h3>
        <RocketMan className="h-24 w-auto sm:h-28 absolute left-100 top-5 !z-10" />
      </div>
      <SectionStars preset="b" />

      <div className="relative z-10 grid w-full max-w-[1000px] grid-cols-1 gap-3 !px-35 sm:gap-4 sm:!px-12 md:grid-cols-2 lg:grid-cols-3 !mt-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <CourseCardSkeleton key={i} delay={(i % 4) * 0.15} />
            ))
          : items}
      </div>

      {!loading && courses.length === 0 && (
        <p className="relative z-10">هنوز دوره‌ای منتشر نشده است</p>
      )}
    </section>
  );
}
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ============================================================
   ستاره‌ی چهارپر (بسیار محو)
   tone: "gold" = زرد محو | "slate" = آبی‌خاکستری محو
   ============================================================ */
const STAR_PATH =
  "M50 0 C51 42 58 49 100 50 C58 51 51 58 50 100 C49 58 42 51 0 50 C42 49 49 42 50 0Z";

const TONES = {
  gold: { fill: "#ffc107", opacity: 0.35, core: "#fff3c4" },
  slate: { fill: "#8fa0d8", opacity: 0.4, core: "#cfd8ff" },
};

export function SparkleStar({
  tone = "slate",
  className = "",
  twinkle = true,
  delay = 0,
  style,
}) {
  const reduce = useReducedMotion();
  const t = TONES[tone] ?? TONES.slate;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
      animate={
        twinkle && !reduce
          ? { opacity: [0.45, 1, 0.45], scale: [1, 1.12, 1] }
          : undefined
      }
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <path d={STAR_PATH} fill={t.fill} fillOpacity={t.opacity} />
      <circle cx="50" cy="50" r="3" fill={t.core} fillOpacity={t.opacity + 0.15} />
    </motion.svg>
  );
}

/* ============================================================
   لایه‌ی ستاره‌های پس‌زمینه‌ی هر سکشن
   استفاده:
     <section className="relative overflow-hidden">
       <SectionStars preset="a" />
       <div className="relative z-10"> ...محتوا... </div>
     </section>
   هر سکشن یک preset متفاوت (a/b/c/d) بگیرد تا جای ستاره‌ها تکراری نشود.
   x و y درصدی هستند (از بالا و چپ)؛ size به پیکسل.
   ============================================================ */
const PRESETS = {
  a: [
    { x: "92%", y: "30%", size: 44, tone: "slate" },
    { x: "6%", y: "72%", size: 20, tone: "gold" },
  ],
  b: [
    { x: "5%", y: "18%", size: 36, tone: "gold" },
    { x: "90%", y: "75%", size: 24, tone: "slate" },
  ],
  c: [
    { x: "88%", y: "15%", size: 28, tone: "gold" },
    { x: "10%", y: "60%", size: 40, tone: "slate" },
    { x: "70%", y: "88%", size: 16, tone: "slate" },
  ],
  d: [
    { x: "50%", y: "6%", size: 22, tone: "slate" },
    { x: "94%", y: "55%", size: 36, tone: "gold" },
    { x: "4%", y: "85%", size: 18, tone: "slate" },
  ],
};

export function SectionStars({ preset = "a", stars }) {
  const list = stars ?? PRESETS[preset] ?? PRESETS.a;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {list.map((st, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 max-sm:scale-[.65]"
          style={{ left: st.x, top: st.y, width: st.size }}
        >
          <SparkleStar
            tone={st.tone}
            delay={i * 1.3}
            className="block h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   آیکون: مرد نشسته روی موشک
   اندازه را با className بده، مثلا: className="h-24 w-auto sm:h-28"
   ============================================================ */
export function RocketMan({ className = "" }) {
  const reduce = useReducedMotion();
  const flame = {
    style: { transformBox: "fill-box", transformOrigin: "0% 50%" },
    animate: reduce ? undefined : { scaleX: [1, 1.18, 1] },
    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <motion.svg
      viewBox="0 8 160 122"
      className={className}
      aria-hidden="true"
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* موشک (۲۵ درجه به سمت بالا-چپ) */}
      <g transform="rotate(25 80 78)">
        <motion.path
          d="M118 72 C130 74 141 79 153 82 C141 86 130 90 118 92 Z"
          fill="#ffd23f"
          {...flame}
        />
        <motion.path
          d="M118 76 C126 77 133 79 141 82 C133 85 126 87 118 88 Z"
          fill="#fff3a0"
          {...flame}
        />
        <path d="M94 62 L106 43 L119 45 L112 66 Z" fill="#a9b4ec" />
        <path d="M94 94 L103 110 L115 108 L112 90 Z" fill="#a9b4ec" />
        <path d="M110 66 L120 70 L120 94 L110 98 Z" fill="#8f9bdc" />
        <path
          d="M12 78 C28 67 56 61 92 61 L112 64 L112 94 L92 97 C56 97 28 91 12 78 Z"
          fill="#c8d0f6"
        />
        <path
          d="M12 78 C28 91 56 97 92 97 L112 94 L112 87 C88 92 48 90 22 81 Z"
          fill="#b3bdf0"
        />
        <circle cx="44" cy="77" r="6.5" fill="#e8ecff" />
        <circle cx="44" cy="77" r="4" fill="#6f7fd6" />
      </g>

      {/* سوارکار */}
      <g strokeLinecap="round" fill="none">
        <path d="M97 71 L108 89" stroke="#1d2a74" strokeWidth="6.5" />
        <path d="M91 71 L88 89" stroke="#1d2a74" strokeWidth="6.5" />
      </g>
      <path d="M84 55 C88 45 104 45 108 55 L111 73 L90 75 Z" fill="#f5c63c" />
      <path
        d="M104 49 C109 53 111 63 110 73 L100 74 C104 65 104 57 100 48 Z"
        fill="#dfa826"
      />
      <g strokeLinecap="round" fill="none" stroke="#e6eafc" strokeWidth="4.5">
        <path d="M88 55 C80 53 74 45 73 31" />
        <path d="M104 57 C110 61 112 67 111 73" />
      </g>
      <circle cx="96" cy="39" r="7.5" fill="#e6eafc" />
      <path
        d="M91.5 40 Q96 43.5 100.5 40"
        stroke="#2a3a8c"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M96 31.5 Q98 24 95 17"
        stroke="#c8d0f6"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

/* ============================================================
   ستاره‌ی دستی: هر جا خواستی بگذار، درست مثل RocketMan
   مثال:
     <Star tone="gold" size={28} className="absolute right-10 top-8" />
   - والدش باید relative باشد (برای absolute)
   - tone: "gold" | "slate"
   - size: اندازه به پیکسل (پیش‌فرض ۳۲)
   - twinkle={false} چشمک را خاموش می‌کند
   ============================================================ */
export function Star({
  tone = "slate",
  size = 32 ,
  className = "",
  twinkle = true,
  delay = 0,
}) {
  return (
    <SparkleStar
      tone={tone}
      twinkle={twinkle}
      delay={delay}
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
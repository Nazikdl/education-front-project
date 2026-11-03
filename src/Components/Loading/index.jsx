import React from "react";
import { TailSpin } from "react-loader-spinner";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[rgb(8,15,66)] relative overflow-hidden">
      {/* Glow های پس‌زمینه */}
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[120px] bg-blue-500/20 -top-24 -right-24 animate-float" />
      <div className="absolute w-[250px] h-[250px] rounded-full blur-[120px] bg-gold/20 -bottom-24 -left-24 animate-float" />

      {/* لوگو یا آیکون */}
      <div className="relative z-10">
        <TailSpin
          visible={true}
          height="80"
          width="80"
          color="#ffc107"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>

      {/* متن */}
      <motion.p
        className="text-white/70 font-vazir text-sm sm:text-base relative z-10"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        در حال بارگذاری...
      </motion.p>
    </div>
  );
}
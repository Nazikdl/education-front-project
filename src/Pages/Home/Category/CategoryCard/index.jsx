import React from "react";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";

export default function CategoryCard({ img, id, title, slug }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-md glass-card !px-5 !py-6 hover:-translate-y-1.5"
      onClick={() => navigate(`/categories/${slug}/${id}`)}
    >
      <div className="flex items-center justify-center rounded-full !bg-white !p-4">
        {/* Image خود antd بدون پیش‌نمایش؛ rootClassName=!flex تا فاصله‌ی اضافه‌ی inline ایجاد نشود */}
        <Image
          preview={false}
          src={import.meta.env.VITE_BASE_FILE + img}
          alt={title}
          width={32}
          height={32}
          rootClassName="!flex"
          className="!h-full !w-full object-contain"
        />
      </div>
      <h4 className="!my-1 text-center text-xs text-blue-400">{title}</h4>
    </div>
  );
}
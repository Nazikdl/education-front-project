import React, { useState, useEffect } from "react";
import { Button, Drawer, Dropdown, Skeleton } from "antd";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  GraduationCap,
  Handbag,
  Handshake,
  House,
  LibraryBig,
  Shapes,
  UserRound,
  X,
  LogOut,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../Store/Slices/AuthSlice";
import fetchData from "../../Utils/FetchData";

// ==================== NAV ITEMS ====================
const navItems = [
  { title: "خانه", icon: House, path: "/" },
  { title: "دسته بندی ها", icon: Shapes, path: "/categories", dropdownKey: "categories" },
  { title: "دوره ها", icon: LibraryBig, path: "/courses", dropdownKey: "courses" },
  { title: "آموزش رایگان", icon: BriefcaseBusiness, path: "/free-course" },
  { title: "اساتید برتر", icon: GraduationCap, path: "/instructors" },
  { title: "ارتباط با ما", icon: Handshake, path: "/about" },
];

// ==================== DESKTOP DROPDOWN ====================
const DesktopDropdown = ({ items, isOpen, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full !right-0 !mt-3 min-w-[220px] rounded-xl !p-2 z-50 shadow-2xl border border-white/10"
          style={{
            background: "rgba(92, 46, 119, 0.95)",
            backdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {loading ? (
            <div className="!p-2">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-white/40 text-xs !py-4 font-vazir">
              موردی یافت نشد
            </div>
          ) : (
            items.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="block !px-3 !py-2 rounded-lg text-sm text-white/70 hover:text-gold hover:bg-white/5 transition-colors font-vazir"
              >
                {item.title}
              </Link>
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==================== MOBILE MENU CONTENT ====================
const MobileMenuContent = ({
  navItems,
  token,
  user,
  cartLength,
  onClose,
  onNavigate,
  onLogout,
  dropdownData,
  loading,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between !pb-4 border-b border-white/10 !mb-4">
        <span className="text-lg font-vazir-bold text-white">منو</span>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-gold transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Cart */}
      <button
        onClick={() => onNavigate("/cart")}
        className="flex items-center justify-between w-full !px-4 !py-3 !mb-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-gold transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-vazir">
          <Handbag size={16} />
          سبد خرید
        </span>
        {cartLength > 0 && (
          <span className="bg-gold text-[#0b1457] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cartLength}
          </span>
        )}
      </button>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isOpen = openDropdown === item.title;
          const subItems = item.dropdownKey ? dropdownData[item.dropdownKey] : [];
          const hasSubmenu = item.dropdownKey && subItems.length > 0;

          return (
            <div key={i} className="!mb-1">
              <button
                onClick={() => {
                  if (hasSubmenu) {
                    setOpenDropdown(isOpen ? null : item.title);
                  } else {
                    onNavigate(item.path);
                  }
                }}
                className="flex items-center justify-between w-full !px-4 !py-3 rounded-xl text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-3 text-sm font-vazir">
                  <Icon size={16} />
                  {item.title}
                </span>
                {hasSubmenu && (
                  <ChevronLeft
                    size={16}
                    className={`transition-transform duration-300 ${
                      isOpen ? "-rotate-90" : ""
                    }`}
                  />
                )}
              </button>

              <AnimatePresence>
                {isOpen && hasSubmenu && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="!pr-8 !pl-2 !py-1">
                      {loading ? (
                        <Skeleton active paragraph={{ rows: 2 }} />
                      ) : (
                        subItems.map((sub, j) => (
                          <Link
                            key={j}
                            to={sub.path}
                            onClick={onClose}
                            className="block !px-3 !py-2  rounded-lg text-xs !text-white/60 !hover:text-gold !hover:bg-white/5 transition-colors font-vazir"
                          >
                            {sub.title}
                          </Link>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom Auth */}
      <div className="!pt-4 border-t border-white/10 !mt-4">
        {token ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() =>
                onNavigate(
                  user?.role === "instructor" ? "/instructor-profile" : "/profile"
                )
              }
              className="w-full !py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-[#0b1457] font-vazir-bold text-sm flex items-center justify-center gap-2"
            >
              <UserRound size={16} />
              داشبورد
            </button>
            <button
              onClick={onLogout}
              className="w-full !py-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors font-vazir text-sm flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              خروج از حساب کاربری
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate("/auth")}
            className="w-full !py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-[#0b1457] font-vazir-bold text-sm flex items-center justify-center gap-2"
          >
            <UserRound size={16} />
            ورود
          </button>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN NAVBAR ====================
export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const cartLength = useSelector((state) => state.cart.items).length;

  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [dropdownData, setDropdownData] = useState({
    categories: [],
    courses: [],
  });
  const [loading, setLoading] = useState(false);

  // ==================== FETCH CATEGORIES ====================
  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchData("categories?limit=8", {
        method: "GET",
        headers: { "content-type": "application/json" },
      });

      const categories = (result?.data || []).map((ct) => ({
        title: ct.title,
        path: `/categories/${ct?.slug}/${ct?._id}`,
      }));

      setDropdownData((prev) => ({ ...prev, categories }));
      setLoading(false);
    })();
  }, []);

  // ==================== FETCH COURSES ====================
  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchData("courses?limit=8", {
        method: "GET",
        headers: { "content-type": "application/json" },
      });

      const courses = (result?.data || []).map((co) => ({
        title: co.title,
        path: `/courses/${co?.slug}/${co?._id}`,
      }));

      setDropdownData((prev) => ({ ...prev, courses }));
      setLoading(false);
    })();
  }, []);

  const condition =
    user?.role === "student"
      ? () => navigate("/profile")
      : user?.role === "instructor"
      ? () => navigate("/instructor-profile")
      : () => navigate("/auth");

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const userMenuItems = [
    {
      key: "logout",
      label: (
        <span className="flex items-center gap-2 font-vazir text-sm text-red-500">
          <LogOut size={14} />
          خروج از حساب کاربری
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <nav className="flex !px-[5%] items-center h-20 justify-between bg-transparent sticky top-0 z-40 backdrop-blur-sm">
        {/* ==================== LOGO ==================== */}
        <div className="flex items-center justify-center gap-5 ">
  <motion.button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden !p-2 rounded-xl text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={22} />
          </motion.button>
        <motion.div
          onClick={() => navigate("/")}
          className="cursor-pointer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            className="h-18 md:h-20 !mt-1"
            src="./../../Public/assets/images/logo.png"
            alt="logo"
          />
        </motion.div>
        </div>
      

        {/* ==================== DESKTOP MENU ==================== */}
        <div className="hidden lg:block">
          <ul className="flex items-center font-vazir text-sm gap-8">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const hasSubmenu =
                item.dropdownKey && dropdownData[item.dropdownKey]?.length > 0;

              return (
                <li
                  key={i}
                  className="relative"
                  onMouseEnter={() => item.dropdownKey && setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    to={item.path}
                    className="flex items-center gap-1.5 text-white/80 hover:text-gold transition-colors duration-200"
                  >
                    <Icon size={16} />
                    <span>{item.title}</span>
                    {item.dropdownKey && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          hoveredItem === item.title ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {item.dropdownKey && (
                    <DesktopDropdown
                      items={dropdownData[item.dropdownKey]}
                      isOpen={hoveredItem === item.title}
                      loading={loading}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ==================== LEFT SIDE ==================== */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <motion.button
            onClick={() => navigate("/cart")}
            className="relative !p-2 rounded-xl text-white/80 hover:text-blue-400 transition-colors"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {cartLength > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-[#0b1457] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartLength}
              </span>
            )}
            <Handbag size={20} />
          </motion.button>

          {/* ==================== USER BUTTONS (DESKTOP) ==================== */}
          <div className="hidden lg:flex items-center">
            {token ? (
              <div className="flex items-center gap-2">
                <Button
                  className="ant-btn-primary !h-10 !rounded-xl !flex !items-center !gap-1.5 !font-vazir !mx-0"
                  onClick={condition}
                >
                  <UserRound size={15} />
                  داشبورد
                </Button>

                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomLeft"
                  trigger={["click"]}
                >
                  <Button
                    className="ant-btn-primary !h-10 !w-10 !rounded-xl !flex !items-center !justify-center !p-0 !mx-0"
                  >
                    <ChevronDown size={16} />
                  </Button>
                </Dropdown>
              </div>
            ) : (
              <Button
                className="ant-btn-primary !h-10 !rounded-xl !flex !items-center !gap-1.5 !font-vazir !mx-0"
                onClick={() => navigate("/auth")}
              >
                <UserRound size={15} />
                ورود
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== MOBILE DRAWER ==================== */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="right"
        closable={false}
        styles={{
          wrapper: { width: 300 },
          body: {
            padding: 20,
            background: "rgba(92, 46, 119, 0.95)",
            backdropFilter: "blur(20px)",
            height: "100%",
          },
          section: {
            background: "transparent",
            boxShadow: "none",
          },
          mask: {
            backdropFilter: "blur(4px)",
            background: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <MobileMenuContent
          navItems={navItems}
          token={token}
          user={user}
          cartLength={cartLength}
          onClose={() => setMobileOpen(false)}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          dropdownData={dropdownData}
          loading={loading}
        />
      </Drawer>
    </>
  );
}
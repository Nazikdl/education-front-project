import React, { useState } from "react";
import { useDispatch } from "react-redux";
import fetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import { login } from "../../../Store/Slices/AuthSlice";
import { Button, Form, Input, Typography } from "antd";
import { motion } from "framer-motion";
import {
  KeySquareIcon,
  Phone,
  UserLock,
  ArrowLeft,
  ChevronLeft,
  KeyRoundIcon,
  MessageCircleMoreIcon,
} from "lucide-react";
import { SyncOutlined } from "@ant-design/icons";
import { toPersianNumber } from "../../../Utils/FormatNumber";

export default function LoginPass({ phoneNumber, changePage }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { Text } = Typography;
  const [form] = Form.useForm();

  const handleOtp = async () => {
    setLoading(true);
    const result = await fetchData("auth/resend-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    notify(result.success ? "success" : "error", result.message);
    if (result.success) {
      changePage("otp");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await fetchData("auth/login-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneNumber, password }),
    });
    notify(result.success ? "success" : "error", result.message);
    if (result.success) {
      dispatch(login(result.data));
    }
    setLoading(false);
  };

  return (
     <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
          <div className="absolute w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[120px] bg-pink-custom/20 -top-24 -right-24 animate-float" />
          <div className="absolute w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full blur-[120px] bg-purple-custom/25 -bottom-24 -left-24 animate-float" />
    
          <motion.div
            className="card w-full max-w-[340px] sm:max-w-[440px] flex flex-col items-center gap-4 sm:gap-6"
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        <span
          onClick={() => changePage("first")}
          className="absolute top-6 sm:top-8 left-6 sm:left-8 text-white/60 hover:text-gold cursor-pointer flex items-center gap-1 text-xs sm:text-sm transition-colors z-10"
        >
          بازگشت
          <ChevronLeft size={14} className="sm:hidden" />
          <ChevronLeft size={16} className="hidden sm:block" />
        </span>
        {/* آیکون */}
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 !my-0 sm:!my-1 rounded-full bg-gold/10 border-[1.5px] border-gold/35 flex items-center justify-center animate-glow"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <UserLock size={20} className="sm:hidden" color="#ffc107" />
          <UserLock size={28} className="hidden sm:block" color="#ffc107" />
        </motion.div>
        {/* عنوان */}
        <motion.div
          className="flex flex-col items-center gap-2 text-center w-full"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Text
            strong
            className="!text-lg sm:!text-2xl !font-vazir-bold !text-white"
          >
            ورود با رمز عبور
          </Text>
        </motion.div>
        {/* فرم */}
        <Form
          layout="vertical"
          onSubmitCapture={handleSubmit}
          form={form}
          className="w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* شماره تلفن (readOnly) */}
            <Form.Item
              name="phoneNumber"
              initialValue={toPersianNumber(phoneNumber)}
              className="!mb-1"
            >
              <Input
                readOnly
                className="!px-3 sm:!px-4 !text-xs sm:!text-base"
                size="large"
                value={toPersianNumber(phoneNumber)}
                maxLength={11}
                prefix={
                  <>
                    <Phone
                      size={16}
                      className="sm:hidden text-gold !ml-1.5 !mb-1.5"
                    />
                    <Phone
                      size={18}
                      className="hidden sm:block text-gold !ml-1.5 !mb-1.5"
                    />
                  </>
                }
              />
            </Form.Item>

            {/* رمز عبور */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "رمز عبور نمی‌تواند خالی باشد!" },
              ]}
              className="!mb-6 sm:!mb-8"
            >
              <Input.Password
                className="!px-3 sm:!px-4 !text-xs sm:!text-base"
                size="large"
                placeholder="لطفا رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                prefix={
                  <>
                    <KeyRoundIcon
                      size={16}
                      className="sm:hidden text-gold !ml-1.5 !mb-1.5"
                    />
                    <KeyRoundIcon
                      size={18}
                      className="hidden sm:block text-gold !ml-1.5 !mb-1.5"
                    />
                  </>
                }
              />
            </Form.Item>
          </motion.div>

          {/* دکمه ورود */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <Form.Item className="!mb-0">
              <Button
                disabled={loading || !password || !phoneNumber}
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={loading ? <SyncOutlined spin /> : null}
                className="!h-[46px] sm:!h-[52px] !rounded-xl sm:!rounded-2xl w-full !font-vazir-bold !text-sm sm:!text-base"
                block
              >
                {loading ? "در حال بررسی..." : "ورود به حساب کاربری"}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>

        {/* Footer */}
        <motion.div
          className="w-full flex flex-col items-start !pr-3 justify-center gap-1 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            type="button"
            onClick={() => changePage("forget")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group flex flex-1 cursor-pointer justify-center !mt-3 items-center gap-1.5  py-1 rounded-xl text-[10px] sm:text-xs text-white/60 hover:text-gold font-vazir transition-all"
          >
            <KeyRoundIcon
              size={14}
              className="transition-transform group-hover:scale-110"
            />
            <span>رمز خود را فراموش کرده ام</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={handleOtp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center cursor-pointer justify-center flex-1 gap-1.5  !py-2 rounded-xl  text-[10px] sm:text-xs text-gold font-vazir transition-all"
          >
            <MessageCircleMoreIcon
              size={14}
              className="transition-transform group-hover:scale-110"
            />
            <span>ورود با کد یکبار مصرف</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

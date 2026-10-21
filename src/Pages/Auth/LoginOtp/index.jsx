import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import fetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import { login } from "../../../Store/Slices/AuthSlice";
import { SyncOutlined } from "@ant-design/icons";
import {
  MessageCircleMoreIcon,
  Phone,
  UserKeyIcon,
  ChevronLeft,
  KeyRoundIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button, Form, Input, Typography } from "antd";
import { toPersianNumber, toEnglishNumber } from "../../../Utils/FormatNumber";

export default function LoginOtp({ phoneNumber, changePage }) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [resendTime, setResendTime] = useState(120);
  const dispatch = useDispatch();
  const { Text } = Typography;
  const [form] = Form.useForm();

  const formatTime = () => {
    const min = Math.floor(resendTime / 60);
    const sec = resendTime % 60;
    return toPersianNumber(`${min}:${sec < 10 ? "0" + sec : sec}`);
  };

  useEffect(() => {
    if (resendTime <= 0) return;
    const timer = setInterval(() => setResendTime((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTime]);

  const handleCodeChange = (e) => {
    const value = e.target.value;
    setCode(toEnglishNumber(value));
  };

  const resendCode = async () => {
    setLoading(true);
    setCode("");
    const result = await fetchData("auth/resend-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    notify(result.success ? "success" : "error", result.message);
    if (result.success) {
      setResendTime(120);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await fetchData("auth/login-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneNumber, code }),
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
          <UserKeyIcon size={20} className="sm:hidden" color="#ffc107" />
          <UserKeyIcon size={28} className="hidden sm:block" color="#ffc107" />
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
            className="!text-lg sm:!text-2xl !mb-3 sm:!mb-5 !font-vazir-bold !text-white"
          >
            ورود با کد یکبار مصرف
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
            <div className="!mb-1">
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
            </div>

            {/* کد + ارسال مجدد */}
            <div className="flex items-center gap-2 !mb-6 sm:!mb-8">
              <Button
                disabled={resendTime > 0}
                onClick={resendCode}
                className="!h-[36px] sm:!h-[40px] !mb-0.5 !text-[10px] sm:!text-xs !rounded-lg !font-vazir-bold !bg-white/5 !text-white !border !border-white/15 hover:!border-gold hover:!text-gold"
              >
                {resendTime > 0 ? formatTime() : "ارسال مجدد کد"}
              </Button>

              <Form.Item
                initialValue={toPersianNumber(code)}
                className="!mb-0 flex-1"
              >
                <Input
                  autoComplete="one-time-code"
                  className="!px-3 sm:!px-4 !text-xs sm:!text-base"
                  size="large"
                  placeholder="لطفا کد ارسالی را وارد کنید"
                  value={toPersianNumber(code)}
                  onChange={handleCodeChange}
                  prefix={
                    <>
                      <MessageCircleMoreIcon
                        size={16}
                        className="sm:hidden text-gold !ml-1.5 !mb-1.5"
                      />
                      <MessageCircleMoreIcon
                        size={18}
                        className="hidden sm:block text-gold !ml-1.5 !mb-1.5"
                      />
                    </>
                  }
                />
              </Form.Item>
            </div>
          </motion.div>

          {/* دکمه ورود */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <Form.Item className="!mb-0">
              <Button
                disabled={loading || !code || !phoneNumber}
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
          className="text-[10px] sm:text-xs text-white/50 text-center !pt-3 sm:!pt-4 border-t border-white/10 w-full font-vazir flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <span
            onClick={() => changePage("password")}
            className="group flex flex-1 cursor-pointer justify-center  items-center gap-1.5  py-1 rounded-xl text-xs text-white/60 hover:text-gold font-vazir transition-all"
          >
            <KeyRoundIcon
              size={14}
              className="transition-transform group-hover:scale-110"
            />
            ورود با رمز کاربری
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

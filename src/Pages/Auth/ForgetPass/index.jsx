import React, { useEffect, useState } from "react";
import useFormFields from "../../../Hooks/UseFormFields";
import fetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import { Form, Input, Typography, Button } from "antd";
import { motion } from "framer-motion";
import {
  KeyRoundIcon,
  UserKeyIcon,
  Phone,
  MessageCircleMoreIcon,
  ChevronLeft,
} from "lucide-react";
import { SyncOutlined } from "@ant-design/icons";
import {
  toPersianNumber,
  toEnglishNumber,
} from "../../../Utils/FormatNumber";

export default function ForgetPass({ changePhone, changePage }) {
  const [resendTime, setResendTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [fields, handleChange] = useFormFields({
    phoneNumber: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const englishValue = toEnglishNumber(value);
    handleChange({ target: { name: "phoneNumber", value: englishValue } });
  };

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
      body: JSON.stringify({ phoneNumber: fields.phoneNumber }),
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
    const result = await fetchData("auth/forget-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fields, code }),
    });
    notify(result.success ? "success" : "error", result.message);
    if (result.success) {
      changePhone(fields.phoneNumber);
      changePage("password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bg-pink-custom/20 -top-24 -right-24 animate-float" />
      <div className="absolute w-[350px] h-[350px] rounded-full blur-[120px] bg-purple-custom/25 -bottom-24 -left-24 animate-float" />
<motion.div
        className="card w-full max-w-[440px] flex flex-col items-center gap-6"
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
    className="absolute top-8 left-8 text-white/60 hover:text-gold cursor-pointer flex items-center gap-1 text-sm transition-colors z-10"
  >
    
    بازگشت
    <ChevronLeft size={16} />
  </span>
        {/* آیکون */}
        <motion.div
          className="w-16 h-16 !my-3 rounded-full bg-gold/10 border-[1.5px] border-gold/35 flex items-center justify-center animate-glow"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        > <UserKeyIcon size={28} color="#ffc107" />
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
            className="!text-2xl !mb-1 !font-vazir-bold !text-white"
          >
            فراموشی رمز کاربری
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
            {/* شماره تلفن */}
            <Form.Item name="phoneNumber" initialValue={toPersianNumber(fields.phoneNumber)} className="!mb-1">
              <Input
                className="!px-4"
                size="large"
                placeholder="لطفا شماره همراه خود را وارد کنید"
                value={toPersianNumber(fields.phoneNumber)}
                onChange={handlePhoneChange}
                prefix={
                  <Phone size={18} className="text-gold !ml-1.5 !mb-1.5" />
                }
                maxLength={11}
              />
            </Form.Item>

            {/* کد + ارسال مجدد */}
            <div className="flex items-center gap-2 !mb-1">
              <Button
                disabled={resendTime > 0}
                onClick={resendCode}
                className="!h-[40px] !mb-0.5 !rounded-lg !font-vazir-bold !bg-white/5 !text-xs !text-white !border !border-white/15 hover:!border-gold hover:!text-gold"
              >
                {resendTime > 0 ? formatTime() : "ارسال مجدد کد"}
              </Button>

              <Form.Item
                name="code"
                rules={[{ required: true, message: "کد نمی‌تواند خالی باشد!" }]}
                className="!mb-0 flex-1"
              >
                <Input
                  autoComplete="one-time-code"
                  className="!px-4"
                  size="large"
                  placeholder="لطفا کد ارسالی را وارد کنید"
                  value={toPersianNumber(code)}
                  onChange={handleCodeChange}
                  prefix={
                    <MessageCircleMoreIcon
                      size={18}
                      className="text-gold !ml-1.5 !mb-1.5"
                    />
                  }
                />
              </Form.Item>
            </div>

            {/* رمز جدید */}
            <Form.Item
              name="newPassword"
              rules={[{ required: true, message: "رمز نمی‌تواند خالی باشد!" }]}
              className="!mb-1"
            >
              <Input.Password
              autoComplete="one-time-code"
                className="!px-4"
                size="large"
                placeholder="لطفا رمز جدید را وارد کنید"
                value={fields.newPassword}
                onChange={handleChange}
                prefix={
                  <KeyRoundIcon
                    size={18}
                    className="text-gold !ml-1.5 !mb-1.5"
                  />
                }
              />
            </Form.Item>

            {/* تکرار رمز جدید */}
            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: "تکرار رمز نمی‌تواند خالی باشد!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("رمز و تکرار رمز مطابقت ندارند!")
                    );
                  },
                }),
              ]}
              className="!mb-8"
            >
              <Input.Password
              autoComplete="one-time-code"
                className="!px-4"
                size="large"
                placeholder="لطفا رمز جدید را مجدد وارد کنید"
                value={fields.confirmPassword}
                onChange={handleChange}
                prefix={
                  <KeyRoundIcon
                    size={18}
                    className="text-gold !ml-1.5 !mb-1.5"
                  />
                }
              />
            </Form.Item>
          </motion.div>

          {/* دکمه */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <Form.Item className="!mb-0">
              <Button
                disabled={
                  loading ||
                  !code ||
                  !fields.phoneNumber ||
                  fields.confirmPassword !== fields.newPassword ||
                  !fields.confirmPassword ||
                  !fields.newPassword
                }
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={loading ? <SyncOutlined spin /> : null}
                className="!h-[52px] !rounded-2xl w-full !font-vazir-bold !text-base"
                block
              >
                {loading ? "در حال بررسی..." : "تغییر رمز عبور"}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>
      </motion.div>
    </div>
  );
}
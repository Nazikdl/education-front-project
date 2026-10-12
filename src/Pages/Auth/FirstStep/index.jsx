import React, { useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { motion } from "framer-motion";
import fetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import { SyncOutlined } from "@ant-design/icons";
import { UserRoundPen, Phone } from "lucide-react";
import { toPersianNumber, toEnglishNumber } from "../../../Utils/FormatNumber";

const { Text } = Typography;

export default function FirstStep({ phoneNumber, changePage, changePhone }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const englishValue = toEnglishNumber(value);
    changePhone(englishValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await fetchData("auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    notify(result.success ? "success" : "error", result.message);
    if (result.success) {
      changePage(result.data.passwordExist ? "password" : "otp");
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
        <motion.div
          className="w-16 h-16 rounded-full bg-gold/10 border-[1.5px] border-gold/35 flex items-center justify-center animate-glow"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <UserRoundPen size={28} color="#ffc107" />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Text strong className="!text-2xl !mb-5 !font-vazir-bold !text-white">
            ورود به حساب کاربری
          </Text>
        </motion.div>

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
            <div className="!mb-8">
              <Input
                className="!px-4"
                size="large"
                placeholder="لطفا شماره همراه خود را وارد کنید"
                value={toPersianNumber(phoneNumber)}
                onChange={handlePhoneChange}
                prefix={<Phone size={18} className="text-gold !ml-1.5 !mb-1.5" />}
                maxLength={11}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <Form.Item className="!mb-0">
              <Button
                disabled={loading || !phoneNumber}
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={loading ? <SyncOutlined spin /> : null}
                className="!h-[52px] !rounded-2xl w-full !font-vazir-bold !text-base"
                block
              >
                {loading ? "در حال بررسی..." : "ورود یا ثبت‌نام"}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>

        <motion.div
          className="text-xs text-white/50 text-center !pt-4 border-t border-white/10 w-full font-vazir"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          با ورود، <span className="text-gradient">قوانین و مقررات</span> را
          می‌پذیرید
        </motion.div>
      </motion.div>
    </div>
  );
}
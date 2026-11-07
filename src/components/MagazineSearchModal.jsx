import { Modal, Form, AutoComplete, DatePicker, Button, Divider } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { readMagazineFilter } from "../utils/magazine.js";

const { RangePicker } = DatePicker;

// Search / filter dialog for the magazine pages. Writes `name`, `from`, `to`
// into the current page's query string, so the page itself does the filtering
// and the result is shareable via URL.
export default function MagazineSearchModal({ open, onClose, nameOptions, title = "搜索杂志" }) {
  const [form] = Form.useForm();
  const [params, setParams] = useSearchParams();

  // pre-fill with the filter currently applied on the page
  useEffect(() => {
    if (!open) return;
    const { name, from, to } = readMagazineFilter(params);
    form.setFieldsValue({
      name: name || undefined,
      range: from || to
        ? [from ? dayjs(from, "YYYY-MM") : null, to ? dayjs(to, "YYYY-MM") : null]
        : undefined,
    });
  }, [open, params, form]);

  const writeParams = (name, from, to) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (name) next.set("name", name); else next.delete("name");
      if (from) next.set("from", from); else next.delete("from");
      if (to) next.set("to", to); else next.delete("to");
      next.set("p", "1");
      return next;
    });
    onClose();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const apply = ({ name, range }) => {
    const [from, to] = range || [];
    writeParams(
      (name || "").trim(),
      from ? from.format("YYYY-MM") : "",
      to ? to.format("YYYY-MM") : ""
    );
  };

  const reset = () => {
    form.resetFields();
    writeParams("", "", "");
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={title} centered width="min(520px, 92vw)">
      <Form form={form} layout="vertical" onFinish={apply}>
        <Form.Item label="杂志名" name="name">
          <AutoComplete
            allowClear
            placeholder="选择或输入杂志名"
            options={nameOptions}
            className="!font-heading w-full"
            filterOption={(input, option) =>
              (option?.value || "").toLowerCase().includes(input.toLowerCase())
            }
            getPopupContainer={(node) => node.parentElement}
          />
        </Form.Item>

        <Form.Item label="发售时间" name="range">
          <RangePicker
            picker="month"
            allowEmpty={[true, true]}
            placeholder={["开始月份", "结束月份"]}
            className="w-full"
            getPopupContainer={(node) => node.parentElement}
          />
        </Form.Item>

        <Divider className="!border-black/10 !my-4" />

        <div className="flex justify-end gap-3">
          <Button onClick={reset} className="!bg-black/60 !text-white !border-white/15 hover:!bg-white/20">
            重置
          </Button>
          <Button type="primary" htmlType="submit" className="!bg-black !text-white !border-white/15 hover:!bg-white/20">
            筛选
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

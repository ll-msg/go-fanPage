import { Modal, Form, Input, Select, Tag, Button, Divider, Space, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { CheckableTag } = Tag;

export default function SearchModal({ open, onClose }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  const [types, setTypes] = useState(["movie", "tv", "stage"]);

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: currentYear - 2003 + 1 },
    (_, i) => {
        const year = 2003 + i;
        return { value: String(year), label: String(year) };
    }
  );

  const tags = ["长发", "公务员", "眼镜", "黑发", "金发", "棕发", "银发", "红发", "胡子"]


  const onFinish = (values) => {
    const params = new URLSearchParams();

    const startYear = values.startYear || String(2003);
    const endYear = values.endYear || String(currentYear);

    if (values.keyword) params.set("q", values.keyword);
    if (values.startYear) params.set("startYear", startYear);
    if (values.endYear) params.set("endYear", endYear);
    if (selectedTags.length) params.set("tags", selectedTags.join(","));
    if (types.length) params.set("types", types.join(","));
    if (values.isLead) params.set("isLead", "1");

    onClose();
    navigate(`/search?${params.toString()}`);
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="搜索" centered width="min(520px, 92vw)" >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="关键词" name="keyword" className="font-heading">
          <Input placeholder="请输入关键词" allowClear />
        </Form.Item>

        <Form.Item label="上映年份" name="year">
          <Form.Item name="startYear" noStyle>
            <Select allowClear placeholder="开始" style={{ width: 120 }} options={yearOptions}/>
          </Form.Item>
          <span> - </span>
          <Form.Item name="endYear" noStyle>
            <Select allowClear placeholder="结束" style={{ width: 120 }} options={yearOptions}/>
          </Form.Item>
        </Form.Item>

        <Divider className="!border-black/10 !my-4" />

        <div className="mb-2 font-heading">类型</div>
        <div className="mb-4">
          <Checkbox.Group
            options={[
              { label: "电影", value: "movie" },
              { label: "电视剧", value: "tv" },
              { label: "舞台剧", value: "stage" },
            ]}
            value={types}
            onChange={(checkedValues) => {
              if (checkedValues.length == 0) {
                setTypes(["movie", "tv", "stage"]);
              } else {
                setTypes(checkedValues);
              }
            }}
          />
        </div>
        
        <div className="mb-2 font-heading">身份</div>
        <Form.Item name="isLead" valuePropName="checked">
          <Checkbox>仅主演</Checkbox>
        </Form.Item>

        <div className="mb-2 font-heading">相关标签</div>

        <Space wrap>
          {tags.map(tag => {
            const checked = selectedTags.includes(tag);
            return (
                <CheckableTag key={tag} checked={selectedTags.includes(tag)} 
                className={`px-3 py-1 rounded-full text-sm transition-all font-heading cursor-pointer hover:!bg-black hover:text-white border ${checked ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"}`}
                onChange={(checked) => setSelectedTags(prev => checked ? [...prev, tag] : prev.filter(t => t !== tag))}
                >
                {tag}
                </CheckableTag>
            );
          })}
        </Space>

        <Divider className="!border-black/10 !my-4" />

        <div className="flex justify-end gap-3">
          <Button onClick={() => {
              form.resetFields();
              setSelectedTags([]);
            }} className="!bg-black/60 !text-white !border-white/15 hover:!bg-white/20"
          >
            重置
          </Button>

          <Button type="primary" htmlType="submit" className="!bg-black !text-white !border-white/15 hover:!bg-white/20">
            搜索
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
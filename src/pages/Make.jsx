import { useMemo, useRef, useState } from "react";
import { Button, Input, Modal, Tabs, Card, Upload, Empty, Typography, App } from "antd";
import { toPng } from "html-to-image";
import { DownloadOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { useWorks } from "../store/worksStore";
import { getPosterUrl } from "../utils/poster";

const { Title, Text, Paragraph } = Typography;

export default function Make() {
  const { works } = useWorks();
  const exportRef = useRef(null);
  const { message } = App.useApp();

  const [cells, setCells] = useState(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      type: "empty",
      image: "",
      workId: null,
    }))
  );

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("works");

  const [keyword, setKeyword] = useState("");
  const [exportTitle, setExportTitle] = useState("我的绫野刚Top9!");
  const [filler, setFiller] = useState("");

  const placeholder = `${import.meta.env.BASE_URL}posters/placeholder.jpg`;

  const filteredWorks = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return [];

    // search title
    return (works || []).filter((w) => {
      const text = [w.title || w.name, w.original_name || w.original_title].filter(Boolean).join(" ").toLowerCase();
      return text.includes(q);
    });
  }, [works, keyword]);

  // 先fetch图 -> blob处理 -> FileReader -> 生成dataURL
  const urlToDataUrl = async (url) => {
    const res = await fetch(url, { mode: "cors", cache: "no-store" });
    if (!res.ok) throw new Error("图片获取失败");

    const blob = await res.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const openPicker = (index) => {
    setActiveIndex(index);
    setOpen(true);
  };
  const closePicker = () => {
    setOpen(false);
    setKeyword("");
    setActiveTab("works");
  };

  const fillCell = (index, nextCell) => {
    setCells((prev) =>
      prev.map((cell, i) => (i === index ? { ...cell, ...nextCell } : cell))
    );
  };

  // 改异步？
  const addWorkToCell = async (work) => {
    if (activeIndex === null) return;
    try {
      const posterUrl = getPosterUrl(work);
      const safeImage = posterUrl ? await urlToDataUrl(posterUrl) : "";

      fillCell(activeIndex, {
        type: "work",
        image: safeImage,
        workId: work.id,
      });
      closePicker();
    } catch (err) {
      console.error(err);
      message.error("海报加载失败，请换图或稍后重试");
    }
  };

  const exportNodeToPng = async () => {
    return await toPng(exportRef.current, {
      cacheBust: true,
      pixelRatio: 1,
      backgroundColor: "#000",
      skipAutoScale: true,
    });
  };

  const handleUpload = (file) => {
    if (!file || activeIndex === null) return Upload.LIST_IGNORE;
    const reader = new FileReader();
    
    reader.onload = () => {
      fillCell(activeIndex, {
        type: "upload",
        image: reader.result,
        workId: null,
      });
      closePicker();
    };

    reader.readAsDataURL(file);
    return false;
  };

  // 预热
  const waitForImages = async (root) => {
    const images = Array.from(root.querySelectorAll("img"));

    await Promise.all(
      images.map((img) => {
        if (!img.src) return Promise.resolve();
        if (img.complete && img.naturalWidth > 0) {
          return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
        }
        return new Promise((resolve) => {
          const done = () => {
            img.onload = null;
            img.onerror = null;
            resolve();
          };
          img.onload = done;
          img.onerror = done;
        });
      })
    );
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /** 导出函数 */
  const handleExport = async () => {
    if (!exportRef.current) return;

    try {
      await waitForImages(exportRef.current);
      await sleep(150);
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));

      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isIOS) {
        await exportNodeToPng(); // 预热一次
        await sleep(120);
      }

      const dataUrl = await exportNodeToPng();

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <title>九宫格</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #000;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
              }
            </style>
            <img src="${dataUrl}" alt="九宫格" />
          `);
          newWindow.document.close();
        } else {
          location.href = dataUrl;
        }
        return;
      }

      const link = document.createElement("a");
      link.download = "九宫格.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("导出失败:", error);
      message.error("导出失败，请稍后重试");
    }
  };

  const inputClass =
    "!h-11 !rounded-xl !border-black/10 !shadow-none hover:!border-black/20 focus-within:!border-black !font-heading";
  const panelClass =
    "rounded-3xl border border-black/10 bg-white shadow-sm !font-heading";
  const darkButtonClass =
    "!rounded-full !bg-black !border-black hover:!bg-black/85 hover:!border-black/85 !font-heading";

  return (
    <div className="bg-neutral-50 px-4 sm:px-6 lg:px-8 font-heading">
      <div className="mx-auto max-w-2xl py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Title level={2} className="!mb-1 !font-heading !text-2xl !tracking-tight">
              Go酱九宫格
            </Title>
            <Paragraph className="!mb-0 !text-sm !text-black/55 !font-heading">
              点击格子添加任意影视 / 自定义图片，标题也支持自定义，导出图片后长按保存到相册
            </Paragraph>
          </div>

          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} className={darkButtonClass}>
            导出图片
          </Button>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <Text className="w-16 shrink-0 !text-[16px] !text-black/60 !font-heading">标题</Text>
            <Input
              value={exportTitle}
              onChange={(e) => setExportTitle(e.target.value)}
              placeholder="输入标题"
              size="large"
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-3">
            <Text className="w-16 shrink-0 !text-[16px] !text-black/60 !font-heading">填表人</Text>
            <Input
              value={filler}
              onChange={(e) => setFiller(e.target.value)}
              placeholder="输入名字"
              size="large"
              className={inputClass}
            />
          </div>
        </div>

        <Card
          className={`${panelClass} [&_.ant-card-body]:p-4 sm:[&_.ant-card-body]:p-6`}
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {cells.map((cell, index) => (
              <div key={cell.id} className="group">
                {cell.type === "empty" ? (
                  <Button
                    type="default"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => openPicker(index)}
                    className="!flex !aspect-[3/4] !h-auto !items-center !justify-center !border-dashed !border-black/10 !bg-neutral-50 !text-black/35 hover:!bg-neutral-100 hover:!border-black/20"
                  >
                    添加
                  </Button>
                ) : (
                  <Card
                    hoverable
                    onClick={() => openPicker(index)}
                    className="overflow-hidden !border-black/10 [&_.ant-card-body]:!p-0"
                  >
                    <div className="relative aspect-[3/4] w-full bg-neutral-100">
                      {cell.image ? (
                        <img
                          src={cell.image}
                          crossOrigin="anonymous"
                          alt=""
                          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                          onError={(e) => {
                            e.currentTarget.src = placeholder;
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-black/30">
                          无图片
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Modal
          open={open}
          onCancel={closePicker}
          footer={null}
          centered
          width={640}
          className="[&_.ant-modal-content]:!p-5"
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="[&_.ant-tabs-nav]:!mb-4"
            items={[
              {
                key: "works",
                label: "搜索作品",
                children: (
                  <div>
                    <div className="mb-4">
                      <Input
                        value={keyword}
                        placeholder="搜索作品名"
                        allowClear
                        size="large"
                        onChange={(e) => setKeyword(e.target.value)}
                        prefix={<SearchOutlined className="text-black/35" />}
                        className={inputClass}
                      />
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto pr-1">
                      {!keyword.trim() ? (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="请输入作品名称开始搜索"
                          className="py-8"
                        />
                      ) : filteredWorks.length === 0 ? (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="没有找到相关作品"
                          className="py-8"
                        />
                      ) : (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                          {filteredWorks.slice(0, 24).map((work) => {
                            const title = work.title || work.name || "未命名作品";
                            const image = getPosterUrl(work);

                            return (
                              <Card
                                key={work.id}
                                hoverable
                                onClick={() => addWorkToCell(work)}
                                className="overflow-hidden !border-black/10 transition hover:-translate-y-0.5 [&_.ant-card-body]:!p-2"
                                cover={
                                  <div className="aspect-[3/4] bg-neutral-100">
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={title}
                                        crossOrigin="anonymous"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = placeholder;
                                        }}
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center text-xs text-black/35">
                                        无封面
                                      </div>
                                    )}
                                  </div>
                                }
                              >
                                <div className="line-clamp-1 text-xs">{title}</div>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: "upload",
                label: "上传图片",
                children: (
                  <Upload.Dragger
                    accept="image/*"
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={handleUpload}
                    className="!border-black/15 !bg-neutral-50 hover:!border-black/25"
                  >
                    <div className="py-8">
                      <UploadOutlined className="mb-3 text-xl text-black/55" />
                      <div className="text-sm font-medium">上传一张图片</div>
                      <div className="mt-1 text-xs text-black/45">
                        选择后将直接填入当前格子
                      </div>
                    </div>
                  </Upload.Dragger>
                ),
              },
            ]}
          />
        </Modal>

        <div
          style={{
            position: "fixed",
            left: "-99999px",
            top: 0,
            pointerEvents: "none",
          }}
        >
          <div ref={exportRef} className="w-[1080px] bg-black px-12 py-16">
            <div className="mb-14">
              <h1 className="mb-10 text-center text-7xl leading-none text-white font-heading">
                {exportTitle || "Go"}
              </h1>

              <div className="mb-6 mt-10 text-right text-5xl text-white font-heading">
                填表人：{filler || ""}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {cells.map((cell) => (
                <div
                  key={cell.id}
                  className="aspect-[3/4] overflow-hidden rounded-none bg-neutral-900"
                >
                  {cell.image ? (
                    <img
                      src={cell.image}
                      alt=""
                      crossOrigin="anonymous"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = placeholder;
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/20">
                      EMPTY
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
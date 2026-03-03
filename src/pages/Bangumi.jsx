import { useEffect, useMemo, useRef, useState } from "react";
import { Timeline, DatePicker, FloatButton, ConfigProvider, Empty, Input } from "antd";

function ymFromDate(dateStr) {
  return (dateStr || "").slice(0, 7);
}
function sortDesc(a, b) {
  return a > b ? -1 : a < b ? 1 : 0;
}

export default function BangumiTimeline() {
  const[list, setList] = useState([]);

  useEffect(() => {
  async function loadData() {
    const res = await fetch(`${import.meta.env.BASE_URL}bangumi.json`);
    const data = await res.json();
    setList(data.bangumi ?? []);
  }
  loadData();
}, []);

  const grouped = useMemo(() => {
    const m = new Map();
    for (const it of list) {
      if (!it?.air_date || !it?.title) continue;
      const ym = ymFromDate(it.air_date);
      if (!m.has(ym)) m.set(ym, []);
      m.get(ym).push({ title: it.title, air_date: it.air_date, link: it.link });
    }

    const yms = Array.from(m.keys()).sort(sortDesc);
    return yms.map((ym) => {
      const items = m
        .get(ym)
        .slice()
        .sort((a, b) => sortDesc(a.air_date, b.air_date));
      return { ym, items };
    });
  }, [list]);

  const ymRefs = useRef(new Map());
  const ymOptions = useMemo(() => grouped.map((g) => g.ym), [grouped]);

  const [jumpYM, setJumpYM] = useState("");

  useEffect(() => {
    if (!jumpYM && ymOptions.length) setJumpYM(ymOptions[0]);
  }, [ymOptions, jumpYM]);

  const scrollToYM = (ym) => {
    const el = ymRefs.current.get(ym);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  // search
  const [query, setQuery] = useState("");
  const [hitYMs, setHitYMs] = useState([]);
  const [hitIndex, setHitIndex] = useState(0);


  const handleSearchJump = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    const hits = grouped
      .filter((g) => g.items.some((it) => it.title.toLowerCase().includes(q)))
      .map((g) => g.ym);

    setHitYMs(hits);
    setHitIndex(0);

    if (hits.length > 0) {
      setJumpYM(hits[0]);
      scrollToYM(hits[0]);
    }
  };

  const jumpToHit = (nextIndex) => {
    if (!hitYMs.length) return;
    const i = (nextIndex + hitYMs.length) % hitYMs.length;
    setHitIndex(i);
    setJumpYM(hitYMs[i]);
    scrollToYM(hitYMs[i]);
  };

  const prevHit = () => jumpToHit(hitIndex - 1);
  const nextHit = () => jumpToHit(hitIndex + 1);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#000000" } }}>
      <div className="mx-auto w-full max-w-3xl px-4 py-4 font-heading">
        {/* 工具条 */}
        <div className="sticky top-[70px] z-10 mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 backdrop-blur">
          <span className="text-xs text-black/60">跳转到年月</span>

          <DatePicker picker="month" allowClear={false}
            onChange={(_, ym) => {
              if (!ym) return;
              setJumpYM(ym);
              scrollToYM(ym);
            }}
            placeholder="选择年月"
          />

          <button onClick={() => scrollToYM(jumpYM)} className="rounded-xl border border-black/10 bg-black/5 px-3 py-1.5 text-sm text-black/80 hover:bg-black/10">
            跳转
          </button>

          <span className="mx-1 h-5 w-px bg-black/10" />

          <Input allowClear value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索节目名" className="min-w-[220px] flex-1"/>

          <button
            onClick={handleSearchJump}
            className="rounded-xl border border-black/10 bg-black/5 px-3 py-1.5 text-sm text-black/80 hover:bg-black/10"
          >
            搜索
          </button>

          {query.trim() ? (
            hitYMs.length ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-black/50">
                  共 {hitYMs.length} 条（{hitIndex + 1}/{hitYMs.length}）搜索结果
                </span>

                <button
                  onClick={prevHit}
                  className="rounded-xl border border-black/10 bg-black/5 px-2.5 py-1.5 text-sm text-black/80 hover:bg-black/10"
                >
                  上一个
                </button>
                <button
                  onClick={nextHit}
                  className="rounded-xl border border-black/10 bg-black/5 px-2.5 py-1.5 text-sm text-black/80 hover:bg-black/10"
                >
                  下一个
                </button>
              </div>
            ) : (
              <span className="text-xs text-black/50">没有匹配</span>
            )
          ) : jumpYM ? (
            <span className="text-xs text-black/50">当前：{jumpYM}</span>
          ) : null}
        </div>

        {grouped.length === 0 ? (
          <div className="py-10">
            <Empty description="暂无数据" />
          </div>
        ) : (
          <Timeline
            className="bangumiTimeline"
            items={grouped.map(({ ym, items }) => ({
              content: (
                <div ref={(el) => el && ymRefs.current.set(ym, el)} id={`ym-${ym}`}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white/70"
                >
                  <div className="flex items-baseline justify-between gap-3 border-b border-black/10 px-4 py-3">
                    <div className="text-base font-semibold text-black/90">
                      {ym}
                    </div>
                    <div className="text-xs text-black/50">
                      共 {items.length} 条
                    </div>
                  </div>

                  <ul className="divide-y divide-black/5">
                    {items.map((it, idx) => (
                      <li key={`${it.air_date}-${idx}`} className="px-4 py-3">
                        <div className="text-xs text-black/50">
                          {it.air_date}
                        </div>
                        <div className="mt-1 text-sm font-medium leading-snug">
                          {it.link ? (
                            <a href={it.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                              {it.title}
                            </a>
                          ) : (
                            <span className="text-black/90">{it.title}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            }))}
          />
        )}
        <FloatButton.BackTop />
      </div>
    </ConfigProvider>
  );
}
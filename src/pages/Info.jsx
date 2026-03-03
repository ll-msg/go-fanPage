export default function Info() {
  return (
    <div className="pt-16 pb-20 font-heading px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-semibold mb-10">说明</h1>
        <p className="mt-2 text-gray-500 text-md">1. 本网站是个人兴起制作的<b>绫野刚</b>作品简易汇总，初衷是更便捷搜寻相关影视信息</p>
        <p className="mt-2 text-gray-500 text-md">2. 影视信息来自
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                TMDB
            </a>
          ，缺少部分由我手动根据三石官网/豆瓣补足；番组信息则来自
            <a href="https://www.oricon.co.jp/prof/346466/tv/" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                Oricon News
            </a>
        </p>
        <p className="mt-2 text-gray-500 text-md">3. <span className="line-through">（假如真的有人用并）</span>发现错漏信息请联系3764581291@qq.com</p>
        <p className="mt-2 text-gray-500 text-md">4. 链接暂时只收录我自己看过收藏的，后续会慢慢补，有原意告知的好心人也可以同上联系，感激不尽</p>
        <p className="mt-2 text-gray-500 text-md">5. 感谢各位发资讯、搬运、烤肉等等等等的老师们！！！没有你们我就不能吃这么爽</p>
        <img
            src={`${import.meta.env.BASE_URL}meme.png`}
            alt="meme"
            className="mt-6 mx-auto w-80 rounded-xl"
        />
      </div>
    </div>
  );
}
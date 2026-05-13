import Link from "next/link";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const isJP = locale === "jp";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">
      <div className="space-y-10">

        {/* TITLE */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold">
            {isJP ? "プライバシーポリシー" : "Privacy Policy"}
          </h1>

          <p className="text-white/70 leading-relaxed">
            {isJP
              ? "TCG Finder Japan（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。"
              : "TCG Finder Japan respects your privacy and is committed to protecting your personal information."}
          </p>
        </div>

        {/* SECTION 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {isJP ? "1. 収集する情報" : "1. Information We Collect"}
          </h2>

          <p className="text-white/80 leading-8">
            {isJP
              ? "当サービスでは、お問い合わせ時のメールアドレスなどの個人情報や、閲覧したページ、操作履歴などの利用データを収集する場合があります。"
              : "We may collect personal information such as email addresses submitted through contact forms, as well as usage data including visited pages and interaction history."}
          </p>
        </section>

        {/* SECTION 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {isJP ? "2. 情報の利用目的" : "2. Purpose of Use"}
          </h2>

          <p className="text-white/80 leading-8">
            {isJP
              ? "収集した情報は、お問い合わせへの回答、サービスの改善、ユーザー体験の向上、および機能の維持のために利用されます。"
              : "Collected information is used to respond to inquiries, improve the service, enhance user experience, and maintain platform functionality."}
          </p>
        </section>

        {/* SECTION 3 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            {isJP
              ? "3. 広告の配信について（Google AdSense）"
              : "3. Advertising (Google AdSense)"}
          </h2>

          <div className="space-y-4 text-white/80 leading-8">
            <p>
              {isJP
                ? "当サービスでは、第三者配信の広告サービス「Google AdSense」を利用しています。"
                : "This service uses the third-party advertising service Google AdSense."}
            </p>

            <p>
              {isJP
                ? "Googleなどの第三者配信事業者は、Cookie（クッキー）を使用して、ユーザーが当サービスや他のウェブサイトに過去にアクセスした際の情報に基づき、適切な広告を配信します。"
                : "Third-party vendors including Google use cookies to display personalized advertisements based on users’ previous visits to this and other websites."}
            </p>

            <p>
              {isJP
                ? "ユーザーはGoogle広告設定からパーソナライズ広告を無効にできます。"
                : "Users can disable personalized ads through Google Ad Settings."}
            </p>

            <a
              href="https://www.aboutads.info/"
              target="_blank"
              className="text-blue-400 hover:underline break-all"
            >
              https://www.aboutads.info/
            </a>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {isJP
              ? "4. アクセス解析ツールについて"
              : "4. Analytics Tools"}
          </h2>

          <p className="text-white/80 leading-8">
            {isJP
              ? "当サービスでは、Googleアナリティクスを利用しています。GoogleアナリティクスはCookieを使用して匿名のトラフィックデータを収集します。"
              : "This service uses Google Analytics to analyze traffic and usage trends. Anonymous traffic data may be collected using cookies."}
          </p>
        </section>

        {/* SECTION 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {isJP
              ? "5. 第三者サービス"
              : "5. Third-Party Services"}
          </h2>

          <p className="text-white/80 leading-8">
            {isJP
              ? "当サービスでは、Google Maps API等の第三者サービスを利用しており、匿名の利用データが収集される場合があります。"
              : "We use third-party services such as Google Maps API, which may also collect anonymized usage data."}
          </p>
        </section>

        {/* SECTION 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {isJP ? "6. データの保護" : "6. Data Protection"}
          </h2>

          <p className="text-white/80 leading-8">
            {isJP
              ? "当サービスは、ユーザー情報を保護するために適切な対策を講じていますが、完全な安全性を保証するものではありません。"
              : "We take appropriate measures to protect user information, although complete security cannot be guaranteed."}
          </p>
        </section>

        {/* SECTION 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {isJP ? "7. 免責事項" : "7. Disclaimer"}
          </h2>

          <p className="text-white/80 leading-8">
            {isJP
              ? "当サービスに掲載されている情報の正確性には万全を期していますが、利用者が本サービスの情報を用いて行う一切の行為について責任を負いません。また、TCG在庫や価格は常に変動するため、最終情報は各店舗にてご確認ください。"
              : "While we strive to keep information accurate, we are not responsible for actions taken based on information provided on this service. TCG inventory and prices may change frequently, so please confirm final details directly with each store."}
          </p>
        </section>

        {/* SECTION 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {isJP ? "8. ポリシーの変更" : "8. Policy Changes"}
          </h2>

          <p className="text-white/80 leading-8">
            {isJP
              ? "本ポリシーは必要に応じて変更される場合があります。変更後は本ページに掲載した時点で効力を生じます。"
              : "This policy may be updated when necessary. Changes become effective once published on this page."}
          </p>
        </section>

        {/* ABOUT US */}
        <section className="border-t border-white/10 pt-10 space-y-5">
          <h2 className="text-3xl font-bold">
            {isJP ? "当サイトについて" : "About Us"}
          </h2>

          <div className="space-y-4 text-white/80 leading-8">

            <p>
              <span className="font-semibold text-white">
                {isJP ? "運営者:" : "Operator:"}
              </span>{" "}
              TCG Finder Japan
            </p>

            <p>
              <span className="font-semibold text-white">
                Website:
              </span>{" "}
              <a
                href="https://www.tcgfinderjapan.com"
                target="_blank"
                className="text-blue-400 hover:underline break-all"
              >
                https://www.tcgfinderjapan.com
              </a>
            </p>

            <p>
              <span className="font-semibold text-white">
                {isJP ? "目的:" : "Purpose:"}
              </span>{" "}
              {isJP
                ? "日本国内のTCGショップ情報を集約し、海外から日本を訪れるコレクターやプレイヤーが目的のカードショップへ辿り着きやすくすることを目的としています。"
                : "This website helps collectors and players discover TCG shops across Japan, especially for international visitors."}
            </p>

            <p>
              <span className="font-semibold text-white">
                {isJP ? "活動内容:" : "Activities:"}
              </span>{" "}
              {isJP
                ? "日本各地のTCGショップ情報、取扱カード、PSA商品、未開封BOX情報などをマップ上で提供しています。"
                : "We provide map-based information about TCG shops, product categories, PSA products, and sealed boxes across Japan."}
            </p>

            <div>
              <span className="font-semibold text-white">
                {isJP ? "お問い合わせ:" : "Contact:"}
              </span>

              <div className="mt-2">
                <Link
                  href={`/${locale}/contact`}
                  className="text-blue-400 hover:underline"
                >
                  {isJP
                    ? "お問い合わせフォームはこちら"
                    : "Contact Form"}
                </Link>
              </div>
            </div>

            <p>
              <span className="font-semibold text-white">
                {isJP ? "免責事項:" : "Disclaimer:"}
              </span>{" "}
              {isJP
                ? "掲載情報は可能な限り最新状態を維持していますが、営業時間や所在地等は変更される場合があります。詳細は各店舗公式情報をご確認ください。"
                : "We strive to keep information updated, but store details such as location and business hours may change. Please verify with official store sources."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
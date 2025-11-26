import { getTranslations } from "next-intl/server";

const PrivacyPolicy: React.FC = async () => {
  const privacyPolicyT = await getTranslations("privacyPolicy");

  return (
    <section
      className={`
        flex flex-col items-center w-full my-20
      `}
    >
      {/* Container */}
      <div
        className={`
          container-medium flex flex-col gap-12 w-5/6
        `}
      >
        <h1>{privacyPolicyT("title")}</h1>
      </div>
    </section>
  );
};

export default PrivacyPolicy;

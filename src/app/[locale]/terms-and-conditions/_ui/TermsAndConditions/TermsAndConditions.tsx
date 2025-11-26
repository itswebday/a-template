import { getTranslations } from "next-intl/server";

const TermsAndConditions: React.FC = async () => {
  const termsAndConditionsT = await getTranslations("termsAndConditions");

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
        <h1>{termsAndConditionsT("title")}</h1>
      </div>
    </section>
  );
};

export default TermsAndConditions;

import { TermsAndConditions } from "./_ui";
import PageWrapper from "@/components/PageWrapper/PageWrapper";

const TermsAndConditionsPage: React.FC = () => {
  return (
    <PageWrapper pageLabel="termsAndConditions">
      <main className="text-primary-blue">
        <TermsAndConditions />
      </main>
    </PageWrapper>
  );
};

export default TermsAndConditionsPage;

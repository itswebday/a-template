import { PrivacyPolicy } from "./_ui";
import { PageWrapper } from "@/components";

const PrivacyPolicyPage: React.FC = async () => {
  return (
    <PageWrapper pageLabel="privacyPolicy">
      <main className="text-primary-blue">
        <PrivacyPolicy />
      </main>
    </PageWrapper>
  );
};

export default PrivacyPolicyPage;

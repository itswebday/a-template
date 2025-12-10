import "./styles.css";
import "swiper/css";
import "swiper/css/navigation";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default RootLayout;

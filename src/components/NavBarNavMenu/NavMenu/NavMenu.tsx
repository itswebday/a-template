"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { ButtonLink, type ButtonLinkProps } from "@/components";
import { useNavMenu } from "@/contexts";

type NavMenuProps = {
  className?: string;
  links: {
    text: string;
    href: string;
    clickable: boolean;
    newTab: boolean;
    subLinks: { text: string; href: string; newTab: boolean }[];
  }[];
  button?: Omit<ButtonLinkProps, "children" | "className" | "onClick"> & {
    text: string;
  };
  slideOutMenu?: boolean;
};

const NavMenu: React.FC<NavMenuProps> = ({
  className,
  links,
  button,
  slideOutMenu = false,
}) => {
  const { isOpen, close } = useNavMenu();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={slideOutMenu ? { x: "100%", opacity: 0 } : { opacity: 0 }}
          animate={slideOutMenu ? { x: 0, opacity: 1 } : { opacity: 1 }}
          exit={slideOutMenu ? { x: "100%", opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={twMerge(
            "z-90 fixed inset-0 flex flex-col",
            "bg-linear-to-t from-primary-purple/20 via-dark to-dark",
            "backdrop-blur-xl",
            !isOpen && "pointer-events-none",
            className,
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              close();
            }
          }}
        >
          {/* Top bar with close button area */}
          <div
            className={twMerge(
              "w-full h-nav-bar bg-dark/50 backdrop-blur-md",
              "border-b border-white/10",
            )}
          />

          {/* Container */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={twMerge(
              "flex-1 w-11/12 max-w-2xl py-12 mx-auto",
              "overflow-y-auto",
            )}
          >
            {/* Button */}
            {button && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mb-8"
              >
                <ButtonLink
                  href={button.href}
                  variant={button.variant}
                  target={button.target}
                  onClick={close}
                >
                  {button.text}
                </ButtonLink>
              </motion.div>
            )}

            {/* Links */}
            <div className="flex flex-col gap-4">
              {links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ x: slideOutMenu ? 50 : 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut",
                  }}
                  className="flex flex-col"
                >
                  {link.clickable ? (
                    <Link
                      className={twMerge(
                        "group relative px-4 py-3 rounded-xl",
                        "transition-all duration-300",
                        "hover:bg-white/10 hover:pl-6",
                      )}
                      href={link.href}
                      target={link.newTab ? "_blank" : "_self"}
                      rel={link.newTab ? "noopener noreferrer" : undefined}
                      prefetch={true}
                      onClick={close}
                    >
                      <motion.span
                        className="text-[18px] font-semibold text-white"
                        whileHover={{ color: "#c4b5fd", x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.text}
                      </motion.span>
                      <motion.div
                        className={twMerge(
                          "absolute left-0 top-1/2 -translate-y-1/2",
                          "w-1 h-0 bg-primary-purple rounded-r-full",
                        )}
                        initial={{ height: 0 }}
                        whileHover={{ height: "60%" }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  ) : (
                    <div className="px-4 py-3 opacity-50">
                      <span className="text-[18px] font-semibold text-white">
                        {link.text}
                      </span>
                    </div>
                  )}

                  {/* Sublinks */}
                  {link.subLinks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{
                        duration: 0.3,
                        delay: 0.25 + index * 0.1,
                      }}
                      className="flex flex-col pl-6 mt-2 gap-2"
                    >
                      {link.subLinks.map((sublink, i) => (
                        <Link
                          key={i}
                          className={twMerge(
                            "group px-4 py-2 rounded-lg",
                            "transition-all duration-300",
                            "hover:bg-white/5 hover:pl-6",
                          )}
                          href={sublink.href}
                          target={sublink.newTab ? "_blank" : "_self"}
                          rel={
                            sublink.newTab ? "noopener noreferrer" : undefined
                          }
                          prefetch={true}
                          onClick={close}
                        >
                          <motion.span
                            className="text-[15px] font-medium text-white/80"
                            whileHover={{ color: "#c4b5fd", x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            {sublink.text}
                          </motion.span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavMenu;

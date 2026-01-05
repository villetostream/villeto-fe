"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, RocketIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mobile Menu Context
type MobileMenuContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};
const MobileMenuContext = createContext<MobileMenuContextType>({
  isOpen: false,
  setIsOpen: () => {},
});
export const useMobileMenu = () => useContext(MobileMenuContext);
export const MobileMenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

// Mega Link Component
type MegaLinkProps = {
  href: string;
  title: string;
  description: string;
  onClick: () => void;
};
const MegaLink: React.FC<MegaLinkProps> = ({
  href,
  title,
  description,
  onClick,
}) => (
  <li>
    <a
      href={href}
      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700"
      onClick={onClick}
    >
      <div className="font-semibold">{title}</div>
      <span className="text-sm text-gray-500 dark:text-neutral-400">
        {description}
      </span>
    </a>
  </li>
);

// Mega Column Component
type MegaColumnProps = {
  children: ReactNode;
  className?: string;
};
const MegaColumn: React.FC<MegaColumnProps> = ({ children, className }) => (
  <ul className={cn("space-y-0.5", className)}>{children}</ul>
);

// Mega Content Components
type MegaContentProps = {
  closeMenu: () => void;
};
const ProductsMegaContent: React.FC<MegaContentProps> = ({ closeMenu }) => (
  <>
    <MegaColumn>
      <MegaLink
        href="#"
        title="Product Feature 1"
        description="Description of product feature 1."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Product Feature 2"
        description="Description of product feature 2."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Product Feature 3"
        description="Description of product feature 3."
        onClick={closeMenu}
      />
    </MegaColumn>
    <MegaColumn>
      <MegaLink
        href="#"
        title="Product Feature 4"
        description="Description of product feature 4."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Product Feature 5"
        description="Description of product feature 5."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Product Feature 6"
        description="Description of product feature 6."
        onClick={closeMenu}
      />
    </MegaColumn>
    <MegaColumn className="hidden md:block">
      <MegaLink
        href="#"
        title="Product Feature 7"
        description="Description of product feature 7."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Product Feature 8"
        description="Description of product feature 8."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Product Feature 9"
        description="Description of product feature 9."
        onClick={closeMenu}
      />
    </MegaColumn>
  </>
);

const SolutionsMegaContent: React.FC<MegaContentProps> = ({ closeMenu }) => (
  <>
    <MegaColumn>
      <MegaLink
        href="#"
        title="Solution 1"
        description="Description of solution 1."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Solution 2"
        description="Description of solution 2."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Solution 3"
        description="Description of solution 3."
        onClick={closeMenu}
      />
    </MegaColumn>
    <MegaColumn>
      <MegaLink
        href="#"
        title="Solution 4"
        description="Description of solution 4."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Solution 5"
        description="Description of solution 5."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Solution 6"
        description="Description of solution 6."
        onClick={closeMenu}
      />
    </MegaColumn>
    <MegaColumn className="hidden md:block">
      <MegaLink
        href="#"
        title="Solution 7"
        description="Description of solution 7."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Solution 8"
        description="Description of solution 8."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Solution 9"
        description="Description of solution 9."
        onClick={closeMenu}
      />
    </MegaColumn>
  </>
);

const PricingMegaContent: React.FC<MegaContentProps> = ({ closeMenu }) => (
  <>
    <MegaColumn>
      <MegaLink
        href="#"
        title="Basic Plan"
        description="Description of basic plan."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Pro Plan"
        description="Description of pro plan."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Enterprise Plan"
        description="Description of enterprise plan."
        onClick={closeMenu}
      />
    </MegaColumn>
    <MegaColumn>
      <MegaLink
        href="#"
        title="Add-on 1"
        description="Description of add-on 1."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Add-on 2"
        description="Description of add-on 2."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Add-on 3"
        description="Description of add-on 3."
        onClick={closeMenu}
      />
    </MegaColumn>
    <MegaColumn className="hidden md:block">
      <MegaLink
        href="#"
        title="Custom Pricing"
        description="Description of custom pricing."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="Compare Plans"
        description="Compare all plans side by side."
        onClick={closeMenu}
      />
      <MegaLink
        href="#"
        title="FAQ"
        description="Frequently asked questions about pricing."
        onClick={closeMenu}
      />
    </MegaColumn>
  </>
);

// Nav Item Component
type NavItemType = {
  label: string;
  href?: string;
  megaContent?: React.FC<MegaContentProps>;
};
type NavItemProps = {
  item: NavItemType;
  isMobileOpen: boolean;
  activeDropdown: string | null;
  setActiveDropdown: (label: string | null) => void;
  mobileDropdowns: Record<string, boolean>;
  toggleMobileDropdown: (label: string) => void;
  closeMenu: () => void;
  timeoutRef: React.RefObject<NodeJS.Timeout | null>;
};
const NavItem: React.FC<NavItemProps> = ({
  item,
  isMobileOpen,
  activeDropdown,
  setActiveDropdown,
  mobileDropdowns,
  toggleMobileDropdown,
  closeMenu,
  timeoutRef,
}) => {
  const hasDropdown = !!item.megaContent;
  return (
    <li key={item.label}>
      {hasDropdown ? (
        <button
          onClick={() => toggleMobileDropdown(item.label)}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setActiveDropdown(item.label);
          }}
          onMouseLeave={() => {
            timeoutRef.current = setTimeout(() => {
              setActiveDropdown(null);
            }, 200);
          }}
          className="flex items-center justify-between w-full py-3 px-4 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-primary md:py-0 md:px-0 md:w-auto dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-neutral-700"
        >
          {item.label}
          <ChevronDown className="w-4 h-4 ms-3" />
        </button>
      ) : (
        <a
          href={item.href}
          className="block py-3 px-4 text-gray-900 hover:bg-gray-50 border-b border-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:py-0 md:px-0 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-neutral-700"
          onClick={closeMenu}
        >
          {item.label}
        </a>
      )}
      {hasDropdown && mobileDropdowns[item.label] && (
        <div className="md:hidden bg-white border-b border-gray-100 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="grid px-4 py-5 mx-auto text-gray-900 grid-cols-1 sm:grid-cols-2 md:px-6 dark:text-white">
            {item.megaContent && <item.megaContent closeMenu={closeMenu} />}
          </div>
        </div>
      )}
    </li>
  );
};

// Mobile Overlay
type MobileOverlayProps = {
  isOpen: boolean;
  closeMenu: () => void;
};
const MobileOverlay: React.FC<MobileOverlayProps> = ({ isOpen, closeMenu }) =>
  isOpen ? (
    <div
      className="fixed inset-0 bg-black/30 z-40 md:hidden"
      onClick={closeMenu}
    />
  ) : null;

// Desktop Mega Menu
type DesktopMegaMenuProps = {
  activeDropdown: string | null;
  setActiveDropdown: (label: string | null) => void;
  getMegaContent: (label: string) => ReactNode;
  timeoutRef: React.RefObject<NodeJS.Timeout | null>;
};
const DesktopMegaMenu: React.FC<DesktopMegaMenuProps> = ({
  activeDropdown,
  setActiveDropdown,
  getMegaContent,
  timeoutRef,
}) =>
  activeDropdown ? (
    <div
      className="hidden md:block absolute left-0 right-0 top-full z-10 bg-white border-y border-gray-200 shadow-sm dark:bg-neutral-800 dark:border-neutral-700"
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={() => {
        setActiveDropdown(null);
      }}
    >
      <div className="grid max-w-[1560px] px-4 py-5 mx-auto text-gray-900 sm:grid-cols-2 md:grid-cols-3 md:px-6 dark:text-white">
        {getMegaContent(activeDropdown)}
      </div>
    </div>
  ) : null;

// Auth Buttons (used only on desktop – plain text links)
type AuthButtonsProps = {
  className?: string;
  closeMenu: () => void;
};
const AuthButtons: React.FC<AuthButtonsProps> = ({ className, closeMenu }) => (
  <div className={cn("flex items-center gap-8", className)}>
    <Link
      href="/login"
      className="text-base font-medium hover:text-primary"
      onClick={closeMenu}
    >
      Sign in
    </Link>
    <Link
      href="/pre-onboarding"
      className="text-base font-medium hover:text-primary"
      onClick={closeMenu}
    >
      See a Demo
    </Link>
    <Button variant="hero" size="lg" asChild>
      <Link href="/pre-onboarding" className="flex items-center">
        Get Started <RocketIcon className="ml-2 w-5 h-5" />
      </Link>
    </Button>
  </div>
);

// Mobile Toggle
type MobileToggleProps = {
  isOpen: boolean;
  toggleMenu: () => void;
};
const MobileToggle: React.FC<MobileToggleProps> = ({ isOpen, toggleMenu }) => (
  <button
    onClick={toggleMenu}
    type="button"
    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600"
    aria-controls="navbar-mega-menu"
    aria-expanded={isOpen}
  >
    <span className="sr-only">Open main menu</span>
    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
  </button>
);

// Logo Link
const LogoLink: React.FC<{ closeMenu: () => void }> = ({ closeMenu }) => (
  <Link
    href="/"
    className="flex items-center space-x-3 rtl:space-x-reverse"
    onClick={closeMenu}
  >
    <img
      src="/images/villeto-logo.png"
      alt="Villeto Logo"
      className="h-10 w-auto"
    />
  </Link>
);

// Header Component
export default function Header() {
  const { isOpen, setIsOpen } = useMobileMenu();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<
    Record<string, boolean>
  >({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems: NavItemType[] = [
    { label: "Company", href: "#company" },
    { label: "Products", megaContent: ProductsMegaContent },
    { label: "Solutions", megaContent: SolutionsMegaContent },
    { label: "Pricing Plans", megaContent: PricingMegaContent },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const getMegaContent = (label: string): ReactNode => {
    const item = navItems.find((i) => i.label === label);
    return item?.megaContent ? (
      <item.megaContent closeMenu={closeMenu} />
    ) : null;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="mx-auto max-w-[1560px] flex flex-wrap items-center justify-between p-4">
        <LogoLink closeMenu={closeMenu} />
        <MobileToggle isOpen={isOpen} toggleMenu={toggleMenu} />
        <div
          id="navbar-mega-menu"
          className={cn(
            "fixed md:relative top-0 bottom-0 left-0 w-[80vw] md:w-auto h-full md:h-auto bg-white dark:bg-neutral-800 shadow-2xl md:shadow-none flex flex-col md:flex-row md:items-center md:ml-6 transition-transform duration-300 ease-in-out z-50 md:z-auto md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <ul className="flex flex-col font-medium flex-1 overflow-y-auto md:p-0 md:flex-row md:space-x-8 md:items-center">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                isMobileOpen={isOpen}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                mobileDropdowns={mobileDropdowns}
                toggleMobileDropdown={toggleMobileDropdown}
                closeMenu={closeMenu}
                timeoutRef={timeoutRef}
              />
            ))}
          </ul>
          {isOpen && (
            <div className="sticky bottom-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-6 md:hidden">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center"
                    asChild
                  >
                    <Link href="/login" onClick={closeMenu}>
                      Sign in
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center"
                    asChild
                  >
                    <Link href="/pre-onboarding" onClick={closeMenu}>
                      See a Demo
                    </Link>
                  </Button>
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full justify-center"
                  asChild
                >
                  <Link href="/pre-onboarding" onClick={closeMenu}>
                    Get Started <RocketIcon className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
        <AuthButtons
          className="hidden md:flex md:ms-auto items-center gap-x-8"
          closeMenu={closeMenu}
        />
      </div>
      <MobileOverlay isOpen={isOpen} closeMenu={closeMenu} />
      <DesktopMegaMenu
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        getMegaContent={getMegaContent}
        timeoutRef={timeoutRef}
      />
    </header>
  );
}

import { cn } from "@/lib/utils";

interface SectionTitleProps {
  text: string;
  className?: string;
}

const SectionTitle = ({ text, className }: SectionTitleProps) => {
  return (
    <div className={cn("flex items-center gap-3 mb-8", className)}>
      <div className="w-2.5 h-2.5 rounded-full border border-[#cdcdcd]" />
      <div className="w-5 h-0 border-t border-[#cdcdcd]" />
      <span
        className={cn(
          "px-5 py-3 bg-[#eaeaea]/30 rounded-[50px] border border-[#eaeaea]/60 text-sm font-medium text-[#0d0d0d] font-['Figtree'] uppercase"
        )}
      >
        {text}
      </span>
      <div className="w-5 h-0 border-t border-[#cdcdcd]" />
      <div className="w-2.5 h-2.5 rounded-full border border-[#cdcdcd]" />
    </div>
  );
};

export default SectionTitle;

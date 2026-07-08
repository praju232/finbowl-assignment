import type { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const cn = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

export const Card = ({ children, className = "", ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={cn("rounded-xl border border-[#EAE7F7] bg-white", className)} {...props}>{children}</div>
);

export const Button = ({
  children,
  className = "",
  variant = "secondary",
  ...props
}: PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }
>) => {
  const variantClass =
    variant === "primary"
      ? "bg-[#6F52ED] text-white hover:opacity-90"
      : variant === "ghost"
        ? "bg-transparent border-transparent text-[#374151] hover:bg-[#F3F4F6]"
        : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F9FAFB]";
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition",
        variantClass,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#6F52ED]",
      props.className,
    )}
  />
);

export const SearchBar = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className={cn("relative w-full", className)}>
    <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
    <Input {...props} className="pl-9" />
  </div>
);

export const Badge = ({ value }: { value: string }) => {
  const map: Record<string, string> = {
    Draft: "bg-gray-100 text-gray-700",
    Submitted: "bg-green-100 text-green-700",
    Verified: "bg-blue-100 text-blue-700",
    Processed: "bg-yellow-100 text-yellow-700",
    Audited: "bg-purple-100 text-purple-700",
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Applicant: "bg-green-100 text-green-700",
    "Co-Applicant": "bg-sky-100 text-sky-700",
    "Home Loan": "bg-violet-100 text-violet-700",
    "Business Loan": "bg-cyan-100 text-cyan-700",
    "Commercial Loan": "bg-indigo-100 text-indigo-700",
    "Loan Against Property": "bg-amber-100 text-amber-700",
  };
  return <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", map[value] ?? "bg-gray-100 text-gray-700")}>{value}</span>;
};

export const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EDE9FE] text-xs font-semibold text-[#6F52ED]">{initials}</span>;
};

export const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <Card className="p-4">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="mt-1 text-2xl font-semibold text-[#111827]">{value}</p>
  </Card>
);

export const Header = ({ title, actions }: { title: string; actions?: ReactNode }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 className="text-2xl font-semibold text-[#111827]">{title}</h1>
      <p className="text-xs text-gray-500">RMS / Disbursement</p>
    </div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

export const SidebarItem = ({
  active,
  children,
  onClick,
}: PropsWithChildren<{ active?: boolean; onClick?: () => void }>) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full rounded-md px-3 py-2 text-left text-sm transition",
      active ? "bg-[#3B2A78] text-white" : "text-[#C7C2DF] hover:bg-[#2F1F63]",
    )}
  >
    {children}
  </button>
);

export const Table = ({
  head,
  children,
}: PropsWithChildren<{ head: Array<string> }>) => (
  <div className="overflow-x-auto rounded-xl border border-[#EAE7F7] bg-white">
    <table className="min-w-full text-sm">
      <thead className="bg-[#F8F7FF] text-left text-xs text-gray-500">
        <tr>{head.map((item) => <th key={item} className="px-4 py-3 font-medium whitespace-nowrap">{item}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-[#F1EFFA]">{children}</tbody>
    </table>
  </div>
);

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
}) => (
  <div className="mt-4 flex items-center justify-between">
    <p className="text-sm text-gray-500">
      Page {page} of {totalPages}
    </p>
    <div className="flex items-center gap-1">
      <Button variant="ghost" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
        <ChevronLeft size={16} />
      </Button>
      <Button variant="ghost" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
        <ChevronRight size={16} />
      </Button>
    </div>
  </div>
);

export const Drawer = ({
  open,
  title,
  children,
  onClose,
  widthClass = "w-full max-w-md",
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void; widthClass?: string }>) =>
  open ? (
    <div className="fixed inset-0 z-50 bg-black/30">
      <div className={cn("absolute top-0 right-0 h-full overflow-y-auto bg-white shadow-xl", widthClass)}>
        <div className="flex items-center justify-between border-b border-[#EAE7F7] p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  ) : null;

export const Modal = ({
  open,
  title,
  children,
  onClose,
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>) =>
  open ? (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4">
      <Card className="w-full max-w-md p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        {children}
      </Card>
    </div>
  ) : null;

export const Dropdown = ({
  options,
  value,
  onChange,
}: {
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export const SkeletonCard = () => <div className="h-24 animate-pulse rounded-xl border border-[#EAE7F7] bg-gray-100" />;

export const SkeletonTable = () => (
  <div className="animate-pulse rounded-xl border border-[#EAE7F7] bg-white p-4">
    <div className="h-5 w-1/3 rounded bg-gray-100" />
    <div className="mt-4 space-y-2">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="h-8 rounded bg-gray-100" />
      ))}
    </div>
  </div>
);

export const EmptyState = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) => (
  <Card className="p-10 text-center">
    <p className="text-lg font-semibold">{title}</p>
    <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    {action ? <div className="mt-4">{action}</div> : null}
  </Card>
);

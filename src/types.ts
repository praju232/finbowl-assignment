export type LoanStatus = "Draft" | "Submitted" | "Verified" | "Processed" | "Audited";

export interface Applicant {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface CommissionRow {
  partnerName: string;
  amount: number;
  status: "Paid" | "Pending";
}

export interface BrokerRow {
  brokerName: string;
  rate: string;
  amount: number;
  status: "Paid" | "Pending";
}

export interface LoanDocument {
  name: string;
  size: string;
}

export interface Loan {
  id: string;
  disbursementDate: string;
  applicantName: string;
  bankName: string;
  loanType: string;
  sanctionedAmount: number;
  verifiedAmount: number;
  referralPercent: number;
  creditExecutive: string;
  status: LoanStatus;
  totalSanctionedAmount: number;
  totalDisbursementAmount: number;
  commissionIncome: number;
  referralFee: number;
  totalIncome: number;
  applicants: Applicant[];
  sanctionDate: string;
  remarks: string;
  commissions: CommissionRow[];
  brokers: BrokerRow[];
  documents: LoanDocument[];
}

export interface SavedView {
  id: string;
  name: string;
  filters: string[];
}

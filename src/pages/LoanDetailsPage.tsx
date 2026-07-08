import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Activity, Archive, FileText, Pencil } from "lucide-react";
import { fetchLoanById } from "../services/loanService";
import {
  Badge,
  Button,
  Card,
  Drawer,
  EmptyState,
  Input,
  Modal,
  SkeletonCard,
  Table,
} from "../components/ui";
import type { Loan } from "../types";

const rupee = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const LoanDetailsPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityOpen, setActivityOpen] = useState(false);
  const [isSummaryEnabled, setIsSummaryEnabled] = useState(true);
  const [isArchived, setIsArchived] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedType, setEditedType] = useState("");
  const [documentNotice, setDocumentNotice] = useState("");
  const [activeSection, setActiveSection] = useState("Applicant Information");
  const sections = [
    "Applicant Information",
    "Loan Details",
    "Disbursement Information",
    "Commission",
    "Broker Information",
    "Additional Information",
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchLoanById(id);
        if (!data) setError("Loan not found.");
        setLoan(data);
      } catch {
        setError("Unable to fetch loans.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !loan) {
    return (
      <EmptyState
        title={error || "Loan not found"}
        subtitle="Please retry or return to disbursements."
        action={<Button onClick={() => navigate("/disbursement")}>Back to List</Button>}
      />
    );
  }

  const displayName = editedName || loan.applicantName;
  const displayType = editedType || loan.loanType;
  const displayStatus = isArchived ? "Audited" : loan.status;
  const disbursementRows = [
    { id: `${loan.id.slice(0, 8)}-01`, date: "22-11-2024", amount: loan.totalDisbursementAmount * 0.35, verified: loan.totalDisbursementAmount * 0.35, utr: "425676103247", tranche: "Full", status: "Processed" },
    { id: `${loan.id.slice(0, 8)}-02`, date: "23-11-2024", amount: loan.totalDisbursementAmount * 0.35, verified: loan.totalDisbursementAmount * 0.35, utr: "425676193245", tranche: "Full", status: "Processed" },
    { id: `${loan.id.slice(0, 8)}-03`, date: "24-11-2024", amount: loan.totalDisbursementAmount * 0.30, verified: loan.totalDisbursementAmount * 0.30, utr: "425676289557", tranche: "Full", status: "Processed" },
  ];

  const brokerDetailedRows = loan.brokers.map((row, index) => ({
    ...row,
    amountReceived: row.amount * 0.5,
    transactionDate: `24-11-202${index + 2}`,
    roiDate: `RNS-PY-2026-00${index + 1}`,
  }));

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold text-[#111827]">Loan - {loan.id}</h1>
          <p className="text-xs text-gray-500">RMS / Disbursement / {displayName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setIsArchived((prev) => !prev)}>
            <Archive size={14} /> Archive
          </Button>
          <Button onClick={() => setActivityOpen(true)}>
            <Activity size={14} /> Activity Logs
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditedName(loan.applicantName);
              setEditedType(loan.loanType);
              setEditOpen(true);
            }}
          >
            <Pencil size={14} /> Edit Loan
          </Button>
          <Button onClick={() => navigate("/disbursement")}>
            <ArrowLeft size={14} /> Back
          </Button>
        </div>
      </div>

      <Card className="space-y-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#111827]">{displayName} <Badge value={displayStatus} /></h2>
            <p className="text-sm text-gray-500">{displayType}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Summary Tiles</span>
            <button
              type="button"
              className={`inline-flex h-5 w-9 items-center rounded-full p-1 transition ${isSummaryEnabled ? "bg-[#6F52ED]" : "bg-[#D1D5DB]"}`}
              onClick={() => setIsSummaryEnabled((prev) => !prev)}
            >
              <span className={`h-3.5 w-3.5 rounded-full bg-white transition ${isSummaryEnabled ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {isSummaryEnabled ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Card className="p-4"><p className="text-xs text-gray-500">Total Sanctioned Amount</p><p className="text-xl font-semibold">{rupee(loan.totalSanctionedAmount)}</p></Card>
            <Card className="p-4"><p className="text-xs text-gray-500">Total Disbursement Amount</p><p className="text-xl font-semibold">{rupee(loan.totalDisbursementAmount)}</p></Card>
            <Card className="p-4"><p className="text-xs text-gray-500">Commission Income</p><p className="text-xl font-semibold">{rupee(loan.commissionIncome)}</p></Card>
            <Card className="p-4"><p className="text-xs text-gray-500">Referral Fee</p><p className="text-xl font-semibold">{rupee(loan.referralFee)}</p></Card>
            <Card className="p-4"><p className="text-xs text-gray-500">Total Income</p><p className="text-xl font-semibold text-green-600">{rupee(loan.totalIncome)}</p></Card>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Card className="h-fit p-3">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(section);
                    const idValue = section.toLowerCase().replace(/\s+/g, "-");
                    document.getElementById(idValue)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    activeSection === section ? "bg-[#F3F0FF] text-[#6F52ED] font-medium" : "text-gray-600 hover:bg-[#F8F7FF]"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card id="applicant-information" className="p-4">
            <h3 className="font-semibold">Applicant Information</h3>
            <Table head={["Name", "Type", "Email ID", "Phone Number"]}>
              {loan.applicants.map((item) => (
                <tr key={item.email}>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3"><Badge value={item.role} /></td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.phone}</td>
                </tr>
              ))}
            </Table>
            </Card>

            <Card id="loan-details" className="space-y-3 p-4">
              <h3 className="font-semibold">Loan Details</h3>
              <div className="grid gap-4 text-sm text-gray-700 md:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">Loan ID</p>
                  <p className="font-medium">{loan.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Loan Type</p>
                  <p><Badge value={displayType} /></p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bank</p>
                  <p className="font-medium">{loan.bankName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Stage</p>
                  <p className="font-medium">Lead</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sanction Date</p>
                  <p className="font-medium">{loan.sanctionDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Loan Sanctioned Amount</p>
                  <p className="font-medium">{rupee(loan.totalSanctionedAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Verified Sanctioned Amount</p>
                  <p className="font-semibold text-[#D97706]">{rupee(loan.verifiedAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Team Details</p>
                  <p className="font-medium">Amit Sharma / Preethi Sharma / Ramesh Kumar</p>
                </div>
              </div>
            </Card>

            <Card id="disbursement-information" className="p-4">
            <h3 className="mb-2 font-semibold">Disbursement Information</h3>
            <Table head={["Disbursement ID", "Disbursement Date", "Disbursement Amount", "Verified Disbursement Amount", "UTR Number", "Tranche", "Disbursement Status"]}>
              {disbursementRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3 text-green-600">{rupee(row.amount)}</td>
                  <td className="px-4 py-3 text-green-600">{rupee(row.verified)}</td>
                  <td className="px-4 py-3">{row.utr}</td>
                  <td className="px-4 py-3">{row.tranche}</td>
                  <td className="px-4 py-3"><Badge value={row.status} /></td>
                </tr>
              ))}
            </Table>
            </Card>

            <Card id="commission" className="p-4">
            <h3 className="mb-2 font-semibold">Commission <span className="ml-2 text-xs font-medium text-green-600">Total Commission: {rupee(loan.commissionIncome)}</span></h3>
            <Table head={["Party Name (Loan Details)", "Sub Credit Commission (%)", "Total Commission (%)", "Commission Amount", "Transaction ID", "Banking Status"]}>
              {loan.commissions.map((row) => (
                <tr key={row.partnerName}>
                  <td className="px-4 py-3">{row.partnerName}</td>
                  <td className="px-4 py-3">0.75%</td>
                  <td className="px-4 py-3">1.25%</td>
                  <td className="px-4 py-3 text-green-600">{rupee(row.amount)}</td>
                  <td className="px-4 py-3">RNS-PY-2026-00{Math.floor(row.amount % 10)}</td>
                  <td className="px-4 py-3"><Badge value={row.status} /></td>
                </tr>
              ))}
            </Table>
            </Card>

            <Card id="broker-information" className="p-4">
            <h3 className="mb-2 font-semibold">Broker Information <span className="ml-2 text-xs font-medium text-rose-500">Total Referral Fee: {rupee(loan.referralFee)}</span></h3>
            <Table head={["Broker Name (Loan ID)", "Broker Commission (%)", "Referral Fee", "ROI Ref Code", "ROI Date", "ROI Status"]}>
              {brokerDetailedRows.map((row) => (
                <tr key={row.brokerName}>
                  <td className="px-4 py-3">{row.brokerName}</td>
                  <td className="px-4 py-3">{row.rate}</td>
                  <td className="px-4 py-3">{rupee(row.amountReceived)}</td>
                  <td className="px-4 py-3 text-rose-500">{row.roiDate}</td>
                  <td className="px-4 py-3">{row.transactionDate}</td>
                  <td className="px-4 py-3"><Badge value={row.status} /></td>
                </tr>
              ))}
            </Table>
            </Card>

            <Card id="additional-information" className="p-4">
            <h3 className="font-semibold">Additional Information</h3>
            <p className="mt-2 text-sm text-gray-600">{loan.remarks}</p>
            </Card>

            <Card className="p-4">
            <h3 className="font-semibold">Documents</h3>
            {documentNotice ? <p className="mt-2 text-xs text-green-600">{documentNotice}</p> : null}
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {loan.documents.map((doc) => (
                <button
                  type="button"
                  key={doc.name}
                  onClick={() => setDocumentNotice(`${doc.name} opened successfully.`)}
                  className="flex items-center gap-3 rounded-md border border-[#EAE7F7] p-3 text-left text-sm transition hover:bg-[#F8F7FF]"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#FEE2E2] text-red-600">
                    <FileText size={14} />
                  </span>
                  <div>
                    <p className="font-medium text-[#111827]">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                </button>
              ))}
            </div>
            </Card>
          </div>
        </div>
      </Card>

      <Drawer open={activityOpen} onClose={() => setActivityOpen(false)} title="Activity Log">
        <div className="space-y-4 text-sm">
          <div className="rounded-lg border border-[#EAE7F7] p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-[#111827]">Loan Created</p>
                <p className="text-xs text-gray-500">Amit Sharma</p>
              </div>
              <p className="text-xs text-gray-500">20 May (8:20 AM)</p>
            </div>
          </div>
          <div className="rounded-lg border border-[#EAE7F7] p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-[#111827]">Status Updated</p>
                <p className="text-xs text-gray-500">Amit Sharma</p>
              </div>
              <p className="text-xs text-gray-500">20 May (9:30 AM)</p>
            </div>
            <div className="mt-3 rounded-md bg-[#F8F7FF] p-2">
              <p className="text-xs text-gray-500">From</p>
              <Badge value="Verified" />
              <p className="mt-2 text-xs text-gray-500">To</p>
              <Badge value="Processed" />
            </div>
          </div>
        </div>
      </Drawer>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Loan">
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs text-gray-500">Applicant Name</p>
            <Input value={editedName} onChange={(event) => setEditedName(event.target.value)} />
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500">Loan Type</p>
            <Input value={editedType} onChange={(event) => setEditedType(event.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setEditOpen(false)}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

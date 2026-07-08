import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Plus } from "lucide-react";
import { fetchLoans } from "../services/loanService";
import type { Loan, SavedView } from "../types";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  EmptyState,
  Header,
  Input,
  Modal,
  Pagination,
  SearchBar,
  SkeletonCard,
  SkeletonTable,
  StatCard,
  Table,
} from "../components/ui";

const filterFields = ["Disbursement Date", "Loan ID", "Applicant Name", "Bank Name", "Status"];

export const DisbursementListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activityOpen, setActivityOpen] = useState(false);
  const [saveViewOpen, setSaveViewOpen] = useState(false);
  const [createViewOpen, setCreateViewOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["Disbursement Date", "Loan ID", "Applicant Name", "Bank Name", "Status"]);
  const [savedViews, setSavedViews] = useState<SavedView[]>([{ id: "default", name: "Default View", filters: filterFields }]);
  const [activeView, setActiveView] = useState("default");
  const [viewName, setViewName] = useState("");
  const pageSize = 8;

  const loadLoans = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLoans();
      setLoans(data);
    } catch {
      setError("Unable to fetch loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLoans();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredLoans = useMemo(
    () =>
      loans.filter((loan) => {
        const q = search.toLowerCase();
        return (
          loan.id.toLowerCase().includes(q) ||
          loan.applicantName.toLowerCase().includes(q) ||
          loan.bankName.toLowerCase().includes(q) ||
          loan.status.toLowerCase().includes(q)
        );
      }),
    [loans, search],
  );

  const pagedLoans = filteredLoans.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredLoans.length / pageSize));

  const saveView = () => {
    if (!viewName.trim()) return;
    const id = viewName.toLowerCase().replace(/\s+/g, "-");
    setSavedViews((prev) => [...prev, { id, name: viewName, filters: selectedFilters }]);
    setActiveView(id);
    setViewName("");
    setCreateViewOpen(false);
    setSaveViewOpen(false);
  };

  return (
    <div className="space-y-4">
      <Header
        title="Disbursement"
        actions={
          <>
            <Button onClick={() => setActivityOpen(true)}>
              <Activity size={14} /> Activity
            </Button>
            <Button variant="primary">
              <Plus size={14} /> Add Disbursement
            </Button>
          </>
        }
      />

      {loading ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonTable />
        </>
      ) : error ? (
        <EmptyState title="Unable to fetch loans." subtitle="Please check your network and try again." action={<Button onClick={loadLoans}>Retry</Button>} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <StatCard title="Total Disbursements" value={loans.length} />
            <StatCard title="Total Disbursed Amount" value={`₹${loans.reduce((sum, loan) => sum + loan.totalDisbursementAmount, 0).toLocaleString("en-IN")}`} />
            <StatCard title="Submitted" value={loans.filter((item) => item.status === "Submitted").length} />
            <StatCard title="Verified" value={loans.filter((item) => item.status === "Verified").length} />
            <StatCard title="Processed" value={loans.filter((item) => item.status === "Processed").length} />
            <StatCard title="Audited" value={loans.filter((item) => item.status === "Audited").length} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SearchBar
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search for disbursement"
              className="max-w-md"
            />
            <div className="relative ml-auto flex gap-2">
              <Dropdown
                value={activeView}
                onChange={(value) => {
                  setActiveView(value);
                  setPage(1);
                }}
                options={savedViews.map((item) => ({ label: item.name, value: item.id }))}
              />
              <Button onClick={() => setSaveViewOpen(true)}>Saved View</Button>
              {saveViewOpen ? (
                <div className="absolute top-11 right-0 z-20 w-72 rounded-xl border border-[#EAE7F7] bg-white p-3 shadow-lg">
                  <SearchBar placeholder="Search for Loans" />
                  <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                    {filterFields.map((field) => (
                      <label key={field} className="flex items-center gap-2 text-sm text-[#374151]">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(field)}
                          onChange={(e) =>
                            setSelectedFilters((prev) =>
                              e.target.checked ? [...prev, field] : prev.filter((item) => item !== field),
                            )
                          }
                        />
                        {field}
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Button variant="primary" className="h-8 px-3 text-xs" onClick={() => setCreateViewOpen(true)}>
                      Save View
                    </Button>
                    <Button variant="ghost" className="h-8 px-3 text-xs" onClick={() => setSaveViewOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {filteredLoans.length === 0 ? (
            <EmptyState
              title="No Loans Found"
              subtitle="Try changing your search or clear filters."
              action={
                <Button
                  onClick={() => {
                    setSearch("");
                    setSelectedFilters(filterFields);
                    setActiveView("default");
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <>
              <Table
                head={[
                  "Disbursement Date",
                  "Loan ID",
                  "Status",
                  "Applicant Name",
                  "Bank Name",
                  "Sanctioned Amt",
                  "Verified",
                  "Referral %",
                  "Credit Executive",
                ]}
              >
                {pagedLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-[#FAF9FF]">
                    <td className="px-4 py-3">{loan.disbursementDate}</td>
                    <td className="px-4 py-3">
                      <button className="text-[#6F52ED] underline-offset-2 hover:underline" onClick={() => navigate(`/disbursement/${loan.id}`)}>
                        {loan.id}
                      </button>
                    </td>
                    <td className="px-4 py-3"><Badge value={loan.status} /></td>
                    <td className="px-4 py-3">{loan.applicantName}</td>
                    <td className="px-4 py-3">{loan.bankName}</td>
                    <td className="px-4 py-3">₹{loan.sanctionedAmount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">₹{loan.verifiedAmount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">{loan.referralPercent.toFixed(2)}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={loan.creditExecutive} /> {loan.creditExecutive}
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}

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

          <div className="rounded-lg border border-[#EAE7F7] p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-[#111827]">Updated</p>
                <p className="text-xs text-gray-500">Amit Sharma</p>
              </div>
              <p className="text-xs text-gray-500">20 May (9:43 AM)</p>
            </div>
            <div className="mt-3 rounded-md bg-[#F8F7FF] p-2">
              <p className="text-xs text-gray-500">Disbursed Amount</p>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span>₹30,00,000.00</span>
                <span className="font-semibold text-[#111827]">₹31,00,000.00</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Modal open={createViewOpen} onClose={() => setCreateViewOpen(false)} title="Create Custom View">
        <Input
          placeholder="Enter view name"
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setCreateViewOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveView}>Create View</Button>
        </div>
      </Modal>
    </div>
  );
};

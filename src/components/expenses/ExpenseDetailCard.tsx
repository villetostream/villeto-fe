import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ExpenseData {
  title: string;
  department: string;
  dateSubmitted: string;
  vendor: string;
  category: string;
  amount: string;
  paymentMethod: string;
  policyCompliance: "within" | "exceeded";
  currency: string;
  status: "approved" | "rejected" | "pending";
  description: string;
}

interface ExpenseDetailCardProps {
  expense: ExpenseData;
}

export function ExpenseDetailCard({ expense }: ExpenseDetailCardProps) {
  return (
    <div className="space-y-4">
      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="detail-card">
          <p className="detail-label">Expense Title</p>
          <p className="detail-value">{expense.title}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">Department</p>
          <p className="detail-value">{expense.department}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">Date Submitted</p>
          <p className="detail-value">{expense.dateSubmitted}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">Vendor</p>
          <p className="detail-value">{expense.vendor}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">Expense Category</p>
          <p className="detail-value">{expense.category}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">Total Amount</p>
          <p className="detail-value">{expense.amount}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">Payment Method</p>
          <p className="detail-value">{expense.paymentMethod}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">Policy Compliance</p>
          <div className="flex items-center gap-1.5">
            {expense.policyCompliance === "within" ? (
              <>
                <CheckCircle2 size={16} className="text-success" />
                <span className="detail-value text-success">Within limit</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} className="text-destructive" />
                <span className="detail-value text-destructive">Exceeded Limit</span>
              </>
            )}
          </div>
        </div>
        <div className="detail-card">
          <p className="detail-label">Currency</p>
          <p className="detail-value">{expense.currency}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">Status</p>
          <div className="mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              expense.status === "approved" 
                ? "bg-success/10 text-success" 
                : expense.status === "rejected" 
                ? "bg-destructive/10 text-destructive"
                : "bg-warning/10 text-warning"
            }`}>
              {expense.status === "approved" && <CheckCircle2 size={12} />}
              {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="detail-card col-span-2">
        <p className="detail-label">Description</p>
        <p className="detail-value">{expense.description}</p>
      </div>
    </div>
  );
}
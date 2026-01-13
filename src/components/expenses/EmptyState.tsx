import { PenLine } from "lucide-react";
import NewExpenseButtonTrigger from "./NewExpenseButtonTrigger";

interface EmptyStateProps {
  onNewReport: () => void;
}

const ExpenseEmptyState = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 mb-8 relative">
          <div className="w-full h-full bg-primary/10 rounded-2xl transform rotate-12"></div>
          <PenLine
            size={64}
            className="text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12"
            strokeWidth={1.5}
          />
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          No expenses yet
        </h3>
        <p className="text-muted-foreground mb-8">
          You haven&apos;t added any expenses. Create your first expense to get
          started.
        </p>
        <NewExpenseButtonTrigger />
      </div>
    </>
  );
};

export default ExpenseEmptyState;

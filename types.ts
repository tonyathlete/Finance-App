export interface RevenueData {
  salaryNet: number;
  otherIncome: number;
}

export interface FixedExpensesData {
  housing: number;
  transport: number;
  insurance: number;
  debts: number;
}

export interface VariableExpensesData {
  groceries: number;
  restaurants: number;
  leisure: number;
  clothing: number;
  health: number;
  other: number;
}

export interface BudgetData {
  revenue: RevenueData;
  fixedExpenses: FixedExpensesData;
  variableExpenses: VariableExpensesData;
}

export interface LeadInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

export interface CategoryAnalysis {
  name: string;
  amount: number;
  percent: number;
  benchmark: number;
  status: 'ok' | 'warning' | 'danger';
  color: string;
}

export interface BudgetAnalysis {
  totalIncome: number;
  totalExpenses: number;
  surplus: number;
  categories: CategoryAnalysis[];
  healthScore: number;
  insights: string[];
}

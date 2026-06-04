export type AvatarId = 'bear' | 'owl' | 'beaver';

export interface RevenueData {
  salaryNet: number;
  otherIncome: number;
}

export interface FixedExpensesData {
  housing: number;
  housingSub: { rent: number; mortgage: number; condo: number };
  transport: number;
  transportSub: { carPayment: number; carInsurance: number; gas: number };
  insurance: number;
  insuranceSub: { life: number; disability: number; home: number };
  debts: number;
  debtsSub: { creditCard1: number; creditCard2: number; personalLoan: number; creditLine: number };
}

export interface VariableExpensesData {
  groceries: number;
  groceriesSub: { food: number; household: number };
  restaurants: number;
  restaurantsSub: { restaurants: number; cafes: number; delivery: number };
  leisure: number;
  leisureSub: { subscriptions: number; sports: number; outings: number; hobbies: number };
  clothing: number;
  clothingSub: { clothes: number; shoes: number; accessories: number };
  health: number;
  healthSub: { medication: number; dental: number; vision: number; personal: number };
  other: number;
}

export type PlacementFrequency = 'weekly' | 'monthly';

export interface PlacementAccount {
  contribution: number;
  frequency: PlacementFrequency;
  totalInvested: number;
}

export interface PlaementsData {
  reer: PlacementAccount;
  celi: PlacementAccount;
  celiapp: PlacementAccount;
  reee: PlacementAccount;
  other: PlacementAccount;
}

export interface BudgetData {
  revenue: RevenueData;
  fixedExpenses: FixedExpensesData;
  variableExpenses: VariableExpensesData;
  placements: PlaementsData;
}

export interface LeadInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
  totalPlacements: number;
  surplus: number;
  categories: CategoryAnalysis[];
  placementCategories: { name: string; amount: number; color: string }[];
  healthScore: number;
  insights: string[];
}

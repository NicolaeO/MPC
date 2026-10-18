// FILE: src/components/widgets/index.js
// Widgets a post can embed with <div data-widget="name" data-…="defaults"></div>.
import MortgageCalculator from './MortgageCalculator'
import CompoundGrowth from './CompoundGrowth'
import BudgetPlanner from './BudgetPlanner'
import Checklist from './Checklist'

export const WIDGETS = {
  'mortgage-calculator': MortgageCalculator,
  'compound-growth': CompoundGrowth,
  'budget-planner': BudgetPlanner,
  checklist: Checklist,
}

import { ExpenseType } from "@prisma/client";
import inflection from "inflection";

export function mapExpenseToEmoji(expenseType: ExpenseType) {
  switch (expenseType.toString()) {
    case ExpenseType.GROCERIES.toString():
      return "🥑";
    case ExpenseType.SNACKS.toString():
      return "🍪";
    case ExpenseType.EATING_OUT.toString():
      return "🍽";
    case ExpenseType.COFFEE.toString():
      return "☕️";
    case ExpenseType.DRINKS.toString():
      return "🍹";
    case ExpenseType.CLOTHING.toString():
      return "👕";
    case ExpenseType.ENTERTAINMENT.toString():
      return "🍿";
    case ExpenseType.SUBSCRIPTION.toString():
      return "📅";
    case ExpenseType.TRAVEL.toString():
      return "🛫";
    case ExpenseType.OTHER.toString():
      return "🎭";
  }
}

export function humanizeExpense(expenseType: ExpenseType) {
  return inflection.humanize(expenseType.toString());
}

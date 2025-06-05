import { format, parseISO } from 'date-fns';
      import Text from '../atoms/Text';
      
      export default function ExpenseCard({ expense, currency }) {
        return (
          &lt;div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"&gt;
            &lt;div&gt;
              &lt;Text as="h4" className="font-medium text-gray-800"&gt;{expense.description}&lt;/Text&gt;
              &lt;Text className="text-sm text-gray-600 capitalize"&gt;
                {expense.category} • {format(parseISO(expense.date), 'MMM dd, yyyy')}
              &lt;/Text&gt;
            &lt;/div&gt;
            &lt;Text className="font-semibold text-gray-800"&gt;
              {currency} {expense.amount.toLocaleString()}
            &lt;/Text&gt;
          &lt;/div&gt;
        );
      }
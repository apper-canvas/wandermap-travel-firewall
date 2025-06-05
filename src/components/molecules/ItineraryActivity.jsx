import ApperIcon from '../atoms/ApperIcon';
      import Text from '../atoms/Text';
      
      export default function ItineraryActivity({ activity }) {
        return (
          &lt;div className="timeline-item pl-6 pb-4"&gt;
            &lt;div className="flex items-start space-x-4"&gt;
              &lt;div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"&gt;
                &lt;ApperIcon name="Clock" className="w-5 h-5 text-primary" /&gt;
              &lt;/div&gt;
              &lt;div className="flex-grow"&gt;
                &lt;div className="flex items-center space-x-3 mb-2"&gt;
                  &lt;Text as="h4" className="font-semibold text-gray-800"&gt;{activity.title}&lt;/Text&gt;
                  &lt;Text className="text-sm text-gray-500"&gt;
                    {activity.startTime}
                    {activity.endTime && ` - ${activity.endTime}`}
                  &lt;/Text&gt;
                &lt;/div&gt;
                {activity.location && (
                  &lt;Text className="text-sm text-gray-600 mb-1"&gt;
                    &lt;ApperIcon name="MapPin" className="w-4 h-4 inline mr-1" /&gt;
                    {activity.location}
                  &lt;/Text&gt;
                )}
                {activity.notes && (
                  &lt;Text className="text-sm text-gray-600"&gt;{activity.notes}&lt;/Text&gt;
                )}
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        );
      }
import ApperIcon from '../atoms/ApperIcon';
      import Text from '../atoms/Text';
      import Card from '../molecules/Card';
      
      export default function MapSection() {
        return (
          &lt;div className="space-y-6"&gt;
            &lt;Text as="h1" className="text-3xl font-heading font-bold text-gray-800"&gt;
              Map View
            &lt;/Text&gt;
            
            &lt;Card className="p-8 text-center"&gt;
              &lt;div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full flex items-center justify-center mb-6"&gt;
                &lt;ApperIcon name="Map" className="w-16 h-16 text-blue-500" /&gt;
              &lt;/div&gt;
              &lt;Text as="h3" className="text-xl font-heading font-semibold text-gray-800 mb-4"&gt;
                Interactive Map Coming Soon
              &lt;/Text&gt;
              &lt;Text className="text-gray-600 max-w-md mx-auto"&gt;
                Visualize your trip destinations, view routes between locations, and explore points of interest on our interactive map.
              &lt;/Text&gt;
            &lt;/Card&gt;
          &lt;/div&gt;
        );
      }
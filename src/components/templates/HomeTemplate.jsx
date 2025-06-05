import { motion } from 'framer-motion';
      import Sidebar from '../organisms/Sidebar';
      import DashboardSection from '../organisms/DashboardSection';
      import ItinerarySection from '../organisms/ItinerarySection';
      import MapSection from '../organisms/MapSection';
      import BudgetSection from '../organisms/BudgetSection';
      
      export default function HomeTemplate({
        trips,
        selectedTrip,
        activeView,
        sidebarExpanded,
        setSidebarExpanded,
        navigationItems,
        handleNavClick,
        onCreateTrip,
        onTripSelect,
        onDeleteTrip,
      }) {
        const getViewContent = () =&gt; {
          switch (activeView) {
            case 'dashboard': return &lt;DashboardSection 
                                        trips={trips} 
                                        onCreateTrip={onCreateTrip} 
                                        onTripSelect={onTripSelect} 
                                        onDeleteTrip={onDeleteTrip} 
                                      /&gt;;
            case 'itinerary': return &lt;ItinerarySection selectedTrip={selectedTrip} /&gt;;
            case 'map': return &lt;MapSection /&gt;;
            case 'budget': return &lt;BudgetSection selectedTrip={selectedTrip} /&gt;;
            default: return &lt;DashboardSection 
                                        trips={trips} 
                                        onCreateTrip={onCreateTrip} 
                                        onTripSelect={onTripSelect} 
                                        onDeleteTrip={onDeleteTrip} 
                                      /&gt;;
          }
        };
      
        return (
          &lt;div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"&gt;
            &lt;Sidebar
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
              navigationItems={navigationItems.map(item =&gt; ({ ...item, activeView }))} // Pass activeView to NavItem
              handleNavClick={handleNavClick}
              trips={trips}
              selectedTrip={selectedTrip}
            /&gt;
      
            &lt;motion.main 
              className={`transition-all duration-300 ${sidebarExpanded ? 'ml-80' : 'ml-20'}`}
              initial={false}
              animate={{ marginLeft: sidebarExpanded ? 320 : 80 }}
            &gt;
              &lt;div className="min-h-screen p-4 lg:p-8"&gt;
                {getViewContent()}
              &lt;/div&gt;
            &lt;/motion.main&gt;
          &lt;/div&gt;
        );
      }
import { Code2, PlayCircle, CircleDollarSign } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SubTabContent from "./sub-tab-content";
import EndpointHeader from "./endpoint-header";
import EndpointReponse from "./endpoint-response";

import { Endpoint } from "../../app/page";

const TabContent = ({
  selectedEndpoint,
  selectedTab,
  content,
  handleTabChange,
}: {
  selectedEndpoint: string;
  selectedTab: string;
  content: Endpoint[];
  handleTabChange: (tab: string) => void;
}) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-blue-500";
    if (status >= 400 && status < 500) return "bg-yellow-500";
    if (status >= 500) return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <>
      {content
        .filter((endpoint) => endpoint.id === selectedEndpoint)
        .map((endpoint) => (
          <div key={endpoint.path} className="space-y-6">
            <EndpointHeader endpoint={endpoint} />

            <Tabs defaultValue={selectedTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="try">
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4" />
                    <span>Try It</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="code">
                  <div className="flex items-center space-x-2">
                    <Code2 className="h-4 w-4" />
                    <span>Code</span>
                  </div>
                </TabsTrigger>
                {endpoint?.tiers && (
                  <TabsTrigger value="pricing">
                    <div className="flex items-center space-x-2">
                      <CircleDollarSign className="h-4 w-4" />
                      <span>Pricing</span>
                    </div>
                  </TabsTrigger>
                )}
              </TabsList>

              <SubTabContent
                selectedEndpoint={selectedEndpoint}
                content={content}
                endpoint={endpoint}
                getStatusColor={getStatusColor}
              />
            </Tabs>

            <EndpointReponse endpoint={endpoint} />
          </div>
        ))}
    </>
  );
};

export default TabContent;

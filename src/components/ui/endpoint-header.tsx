import { Lock, ExternalLink } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Endpoint } from "../../app/page";

const EndpointHeader = ({ endpoint }: { endpoint: Endpoint }) => {
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-500";
      case "POST":
        return "bg-purple-700";
      case "PUT":
        return "bg-yellow-500";
      case "DELETE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getMethodColor(endpoint.method)}>
              {endpoint.method}
            </Badge>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {endpoint.path}
            </code>
          </div>
          {endpoint.requiresAuth && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              Authentication Required
            </Badge>
          )}
        </div>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>
      {endpoint.requiresAuth && (
        <CardFooter>
          <Alert>
            <AlertTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Premium API
            </AlertTitle>
            <AlertDescription className="mt-2">
              This is a premium API endpoint that requires authentication.{" "}
              <a
                href={endpoint.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 inline-flex items-center gap-1"
              >
                Learn more about authentication
                <ExternalLink className="h-4 w-4" />
              </a>
            </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
};

export default EndpointHeader;

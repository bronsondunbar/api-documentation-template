import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Endpoint } from "../../app/page";

const EndpointReponse = ({ endpoint }: { endpoint: Endpoint }) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-blue-500";
    if (status >= 400 && status < 500) return "bg-yellow-500";
    if (status >= 500) return "bg-red-500";
    return "bg-gray-500";
  };

  const renderResponseSchema = (schema: string | Record<string, unknown>) => {
    if (!schema) return null;

    if (typeof schema === "string") {
      return schema;
    }

    return JSON.stringify(schema, null, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Responses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {endpoint?.responses?.map((response) => (
          <div key={response.status} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(response.status)}>
                {response.status}
              </Badge>
              <span className="font-medium">{response.description}</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Content-Type: {response.contentType}
              </div>
              {response.schema && (
                <div className="relative">
                  <div className="absolute top-2 right-2 text-xs text-muted-foreground">
                    Response Schema
                  </div>
                  <code className="relative rounded bg-muted p-4 font-mono text-sm block whitespace-pre overflow-x-auto">
                    {renderResponseSchema(response.schema)}
                  </code>
                </div>
              )}
              {response.example && (
                <div className="relative mt-4">
                  <div className="absolute top-2 right-2 text-xs text-muted-foreground">
                    Example Response
                  </div>
                  <code className="relative rounded bg-muted p-4 font-mono text-sm block whitespace-pre overflow-x-auto">
                    {typeof response.example === "string"
                      ? response.example
                      : JSON.stringify(response.example, null, 2)}
                  </code>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EndpointReponse;

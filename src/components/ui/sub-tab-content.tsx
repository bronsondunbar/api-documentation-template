import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const FileUploadSection = ({
  onFileSelect,
  acceptedFileTypes,
}: {
  onFileSelect: (file: File) => void;
  acceptedFileTypes: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedFileTypes.split(",").join(" or ")} files only
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={acceptedFileTypes}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

const PricingCard = ({
  endpoint,
  tier,
}: {
  endpoint: Endpoint;
  tier: PricingTier;
}) => {
  return (
    <Card
      className={`flex flex-col ${tier.highlighted ? "border-primary" : ""}`}
    >
      <CardHeader>
        <CardTitle className="text-xl">
          {tier.name}
          {tier.highlighted && (
            <Badge className="ml-2 bg-primary">Most Popular</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="text-3xl font-bold">
          {tier.price === -1 ? "Contact Us" : `$${tier.price}`}
          {tier.price !== -1 && (
            <span className="text-sm font-normal">/month</span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {tier.requests === -1
            ? "Custom volume"
            : `${tier.requests.toLocaleString()} requests/month`}
        </div>
        <ul className="space-y-2 text-sm">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-primary"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <a
          href={endpoint?.documentationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({
              variant: tier.highlighted ? "default" : "outline",
              className: "w-full",
            })
          )}
        >
          {tier.price === -1 ? "Contact Sales" : "Get Started"}
        </a>
      </CardContent>
    </Card>
  );
};

const SubTabContent = ({
  selectedEndpoint,
  endpoint,
  getStatusColor,
}: {
  selectedEndpoint: string;
  content: Endpoint[];
  endpoint: Endpoint;
  getStatusColor: (status: number) => string;
}) => {
  const [queryParams, setQueryParams] = useState<{ [key: string]: string }>(
    () => {
      const defaultParams: { [key: string]: string } = {};
      endpoint.parameters?.forEach((param) => {
        if (param.default !== undefined) {
          defaultParams[param.name] = String(param.default);
        } else if (param.example !== undefined) {
          defaultParams[param.name] = String(param.example);
        }
      });
      return defaultParams;
    }
  );

  const [jsonBody, setJsonBody] = useState(endpoint?.body || "");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) return true;
    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (error) {
      setJsonError((error as Error).message);
      return false;
    }
  };

  const handleTestEndpoint = async () => {
    if (endpoint.body && endpoint?.type !== "file" && !validateJson(jsonBody)) {
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(endpoint.path, {
          method: "POST",
          body: formData,
        });

        const contentType = response.headers.get("content-type") || "";
        const data = await response.json();

        setResponse({
          status: response.status,
          data,
          contentType,
        });
      } else {
        const requestBody = endpoint.body ? JSON.parse(jsonBody) : undefined;
        const queryString = Object.entries(queryParams)
          .filter(([, value]) => value !== "")
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");

        const url = queryString
          ? `${endpoint.path}?${queryString}`
          : endpoint.path;

        const response = await fetch(url, {
          method: endpoint.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody ? JSON.stringify(requestBody) : undefined,
        });

        const contentType = response.headers.get("content-type") || "";
        let data;

        if (contentType.includes("application/json")) {
          data = await response.json();
        } else if (contentType.includes("text/")) {
          data = await response.text();
        } else {
          data = await response.blob();
        }

        setResponse({
          status: response.status,
          data,
          contentType,
        });
      }
    } catch (error) {
      setResponse({
        status: 500,
        data: null,
        error: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderResponseType = (response: ApiResponse) => {
    if (response.error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{response.error}</AlertDescription>
        </Alert>
      );
    }

    if (response?.data instanceof Blob) {
      return (
        <div className="flex flex-col items-center space-y-4">
          {response.contentType?.includes("application/json") && (
            <pre className="whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          )}

          {response.contentType?.includes("image/") && (
            <div className="flex justify-center">
              <img
                src={URL.createObjectURL(response.data)}
                alt="API Response"
                className="max-w-full"
              />
            </div>
          )}

          {response.contentType?.includes("application/pdf") && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-muted-foreground">
                File ready for download:{" "}
                {response.fileName || "downloaded-file"}
              </p>
              <Button
                onClick={() =>
                  handleDownload(
                    response.data as Blob,
                    response.fileName || "downloaded-file"
                  )
                }
              >
                Download File
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (typeof response.data === "string") {
      return (
        <pre className="whitespace-pre-wrap overflow-x-auto">
          {response.data}
        </pre>
      );
    }

    if (response.data) {
      return (
        <pre className="whitespace-pre-wrap overflow-x-auto">
          {JSON.stringify(response.data, null, 2)}
        </pre>
      );
    }

    return (
      <div className="text-center text-muted-foreground">No data returned</div>
    );
  };

  const renderResponsePreview = () => {
    if (!response) return null;

    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(response.status)}>
              {response.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {response.contentType || "Unknown"}
            </span>
          </div>

          {renderResponseType(response)}
        </div>
      </>
    );
  };

  const chunkArray = (arr: PricingTier[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  let pricingRows: PricingTier[][] = [];

  if (endpoint?.tiers) {
    pricingRows = chunkArray(endpoint?.tiers, 3);
  }

  const prettifyJson = (jsonString: string, indentSize: number = 2): string => {
    try {
      const parsedJson = JSON.parse(jsonString);
      return JSON.stringify(parsedJson, null, indentSize);
    } catch (error) {
      return `// Invalid JSON: ${(error as Error).message}\n${jsonString}`;
    }
  };

  return (
    <>
      <TabsContent value="try" className="space-y-4">
        <>
          {endpoint.parameters && (
            <Card>
              <CardHeader>
                <CardTitle>Query Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {endpoint.parameters.map((param) => (
                  <div key={param.name} className="space-y-2">
                    <label htmlFor={param.name} className="text-sm font-medium">
                      {param.name}
                      <span className="text-xs text-muted-foreground ml-2">
                        {param.type}
                        {param.required && " (required)"}
                        {param.default !== undefined &&
                          ` (default: ${param.default})`}
                      </span>
                    </label>
                    <Input
                      id={param.name}
                      value={queryParams[param.name] || ""}
                      onChange={(e) =>
                        setQueryParams((prev) => ({
                          ...prev,
                          [param.name]: e.target.value,
                        }))
                      }
                      placeholder={param.example?.toString()}
                    />
                    <p className="text-xs text-muted-foreground">
                      {param.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {endpoint.body && (
            <Card>
              <CardHeader>
                <CardTitle>Request Body</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    value={prettifyJson(endpoint.body) || jsonBody}
                    onChange={(e) => setJsonBody(e.target.value)}
                    className="font-mono min-h-[200px]"
                    placeholder="Enter request body..."
                  />
                  {jsonError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Invalid JSON: {jsonError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {endpoint.id === "fileparser" && (
            <>
              <FileUploadSection
                onFileSelect={(file) => setSelectedFile(file)}
                acceptedFileTypes=".xml,.csv"
              />

              {selectedFile && (
                <Alert>
                  <AlertDescription>
                    Selected file: {selectedFile.name}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          <div className="flex justify-end">
            <Button onClick={() => handleTestEndpoint()} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Endpoint
            </Button>
          </div>

          {(loading || response) && (
            <Card>
              <CardHeader>
                <CardTitle>Response Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  renderResponsePreview()
                )}
              </CardContent>
            </Card>
          )}
        </>
      </TabsContent>

      <TabsContent value="code">
        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fetch">
              <TabsList>
                <TabsTrigger value="fetch">Fetch</TabsTrigger>
                <TabsTrigger value="axios">Axios</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>
              {endpoint?.examples?.map((example, index) => (
                <TabsContent
                  key={index}
                  value={Object.keys(example)[0]}
                  className="space-y-4"
                >
                  <code className="relative rounded bg-muted p-4 font-mono text-sm block whitespace-pre overflow-x-auto">
                    {Object.values(example)[0]?.replace(
                      "[PATH]",
                      selectedEndpoint
                    )}
                  </code>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pricing">
        <div className="space-y-6">
          {pricingRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {row.map((tier, index) => (
                <PricingCard key={index} endpoint={endpoint} tier={tier} />
              ))}
            </div>
          ))}
        </div>
      </TabsContent>
    </>
  );
};

export default SubTabContent;

interface Endpoint {
  id: string;
  type?: string;
  method: string;
  path: string;
  description: string;
  requiresAuth?: boolean;
  documentationUrl?: string;
  parameters?: Parameter[];
  body?: string;
  examples?: Example[];
  responses: Response[];
  tiers?: PricingTier[];
}

interface Parameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string | number;
  example?: string | number;
}

interface Example {
  fetch?: string;
  axios?: string;
  curl?: string;
}

export interface Response {
  status: number;
  description?: string;
  headers?: Record<string, unknown>;
  contentType?: string;
  schema?: Record<string, unknown>;
  example?: Record<string, unknown> | string;
}

interface ApiResponse {
  status: number;
  data: string | Blob | { [key: string]: unknown } | null;
  contentType?: string;
  error?: string;
  fileName?: string;
}
interface PricingTier {
  name: string;
  requests: number;
  price: number;
  features: string[];
  highlighted?: boolean;
}

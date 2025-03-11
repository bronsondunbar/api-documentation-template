"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

import Hero from "@/components/ui/hero";
import TabContent from "@/components/ui/tab-content";

import { freeApis, paidApis } from "../data/apis";

const APILibrary = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("try");

  const findEndpointById = (id: string) => {
    return [...freeApis, ...paidApis].find((endpoint) => endpoint.id === id);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const [endpointId, tab] = hash.slice(1).split(":");
      if (findEndpointById(endpointId)) {
        setSelectedEndpointId(decodeURIComponent(endpointId));
        if (tab && ["try", "code", "pricing"].includes(tab)) {
          setSelectedTab(tab);
        }
      }
    } else {
      const defaultId = freeApis[0]?.id || "placeholder-image";
      setSelectedEndpointId(defaultId);
      window.history.replaceState(null, "", `#${defaultId}:try`);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const [endpointId, tab] = window.location.hash.slice(1).split(":");
      if (findEndpointById(endpointId)) {
        setSelectedEndpointId(decodeURIComponent(endpointId));
        if (tab && ["try", "code", "pricing"].includes(tab)) {
          setSelectedTab(tab);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-green-500";
      case "POST":
        return "bg-purple-800";
      case "PUT":
        return "bg-yellow-500";
      case "DELETE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEndpointSelect = (id: string) => {
    if (findEndpointById(id)) {
      setSelectedEndpointId(id);
      window.history.pushState(null, "", `#${encodeURIComponent(id)}`);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    window.history.pushState(
      null,
      "",
      `#${encodeURIComponent(selectedEndpointId)}:${tab}`
    );
  };

  const selectedEndpoint = findEndpointById(selectedEndpointId);

  const EndpointListItem = ({ endpoint }: { endpoint: Endpoint }) => (
    <button
      onClick={() => handleEndpointSelect(endpoint.id)}
      className={`w-full text-left p-2 rounded-lg transition-colors ${
        selectedEndpointId === endpoint.id ? "bg-muted" : "hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge className={getMethodColor(endpoint.method)}>
            {endpoint.method}
          </Badge>
          <span className="text-sm font-medium">{endpoint.path}</span>
        </div>
        {endpoint.requiresAuth && (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </button>
  );

  return (
    <>
      <div>
        <Hero title="API Documentation Template" subtitle="" />
      </div>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <div className="sticky top-[88px] space-y-6 max-h-[calc(100vh-88px)] overflow-y-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Free APIs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {freeApis.map((endpoint) => (
                        <EndpointListItem
                          key={endpoint.id}
                          endpoint={endpoint}
                        />
                      ))}
                    </nav>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Premium APIs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {paidApis.map((endpoint) => (
                        <EndpointListItem
                          key={endpoint.id}
                          endpoint={endpoint}
                        />
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="col-span-12 md:col-span-9 space-y-6">
              {selectedEndpoint && (
                <>
                  <TabContent
                    selectedEndpoint={selectedEndpointId}
                    selectedTab={selectedTab}
                    content={freeApis}
                    handleTabChange={handleTabChange}
                  />
                  <TabContent
                    selectedEndpoint={selectedEndpointId}
                    selectedTab={selectedTab}
                    content={paidApis}
                    handleTabChange={handleTabChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default APILibrary;

export interface Parameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string | number;
  example?: string | number;
}

export interface Response {
  status: number;
  description?: string;
  headers?: Record<string, unknown>;
  contentType?: string;
  schema?: Record<string, unknown>;
  example?: Record<string, unknown> | string;
}

export interface Endpoint {
  id: string;
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

interface Example {
  fetch?: string;
  axios?: string;
  curl?: string;
}

interface PricingTier {
  name: string;
  requests: number;
  price: number;
  features: string[];
  highlighted?: boolean;
}

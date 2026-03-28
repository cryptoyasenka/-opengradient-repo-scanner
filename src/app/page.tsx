"use client";

import { useState } from "react";
import { RepoInput } from "@/components/RepoInput";
import { RepoDataDisplay } from "@/components/RepoDataDisplay";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { Button } from "@/components/ui/button";
import type { RepoData, FetchRepoError } from "@/types/github";

type PageState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [fetchError, setFetchError] = useState<FetchRepoError | null>(null);

  async function handleRepoSubmit(repoInput: string) {
    setPageState("loading");
    setRepoData(null);
    setFetchError(null);

    try {
      const response = await fetch("/api/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repoInput }),
      });

      const json = await response.json();

      if (!response.ok) {
        setFetchError(json as FetchRepoError);
        setPageState("error");
        return;
      }

      setRepoData(json as RepoData);
      setPageState("success");
    } catch {
      setFetchError({
        error: "Network error: could not reach the server. Check your connection.",
        code: "API_ERROR",
      });
      setPageState("error");
    }
  }

  function handleReset() {
    setPageState("idle");
    setRepoData(null);
    setFetchError(null);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">GitHub Security Checker</h1>
          <p className="mt-2 text-muted-foreground">
            Analyze any public GitHub repository for supply chain security signals.
          </p>
        </div>

        <RepoInput
          onSubmit={handleRepoSubmit}
          isLoading={pageState === "loading"}
        />

        {pageState === "loading" && <LoadingDisplay />}

        {pageState === "error" && fetchError && (
          <div className="mt-8">
            <ErrorDisplay error={fetchError} onReset={handleReset} />
          </div>
        )}

        {pageState === "success" && repoData && (
          <div className="mt-8">
            <RepoDataDisplay data={repoData} />
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={handleReset}>
                Check another repository
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm border-slate-200">
            <CardContent className="pt-5 pb-4">
              <div className="h-3 bg-slate-200 rounded w-20 mb-2" />
              <div className="h-8 bg-slate-200 rounded w-16 mb-1" />
              <div className="h-2 bg-slate-100 rounded w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <div className="h-5 bg-slate-200 rounded w-32" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-slate-100 rounded flex items-center justify-center">
              <div className="w-32 h-32 bg-slate-200 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <div className="h-5 bg-slate-200 rounded w-40" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-slate-100 rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

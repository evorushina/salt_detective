"use client";

import { useMemo } from "react";

export default function DashboardPage() {
  // Simulate loading for skeleton demo
  const stats = useMemo(() => ([
    { label: "Games Played", value: 42 },
    { label: "Correct Guesses", value: 29 },
    { label: "Avg. Tests per Game", value: 3.2 },
    { label: "Win Rate", value: "69%" },
  ]), []);

  const recent = useMemo(() => ([
    { salt: "Eisen(III)-chlorid", result: "Win", tests: 4, time: "2m 31s" },
    { salt: "Copper(II) Sulfate", result: "Win", tests: 3, time: "1m 48s" },
    { salt: "Potassium Permanganate", result: "Lose", tests: 5, time: "3m 05s" },
    { salt: "Sodium Chloride", result: "Win", tests: 2, time: "0m 58s" },
  ]), []);
  const loading = false;

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="text-white/70 mb-6">Overview of your gameplay.</p>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="skeleton h-3 rounded w-1/2 mb-2" />
              <div className="skeleton h-7 rounded w-2/3" />
            </div>
          ))
        ) : (
          stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/60">{s.label}</div>
              <div className="text-2xl mt-1">{s.value}</div>
            </div>
          ))
        )}
      </section>

      <section className="rounded-lg border border-white/10 overflow-hidden">
        <div className="px-4 py-3 bg-white/5 border-b border-white/10 font-medium">Recent Activity</div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-6 rounded" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-white/70">
                <tr>
                  <th className="px-4 py-2">Salt</th>
                  <th className="px-4 py-2">Result</th>
                  <th className="px-4 py-2">Tests</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-4 py-2">{r.salt}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${r.result === "Win" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                        {r.result}
                      </span>
                    </td>
                    <td className="px-4 py-2">{r.tests}</td>
                    <td className="px-4 py-2">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}



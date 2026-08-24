"use client";

import React, { useState } from "react";
import Icon from "@/components/Icon";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  market: string;
  message: string;
  date: string;
  status: "new" | "contacted" | "closed";
};

// Initial sample and storage-backed leads
const initialSampleLeads: Lead[] = [
  {
    id: "lead-001",
    name: "Nguyễn Hoàng Minh",
    email: "minh.nguyen@gamestudio.vn",
    phone: "0908 123 456",
    company: "Apex Game Studio",
    service: "Game & App Marketing",
    budget: "150 – 500 triệu",
    market: "Việt Nam & Đông Nam Á",
    message: "Chúng tôi chuẩn bị phát hành một tựa game MMORPG 3D vào tháng 11, cần tư vấn kế hoạch UA, Booking KOL và chạy Performance Ad.",
    date: "2026-08-20 14:32",
    status: "new",
  },
  {
    id: "lead-002",
    name: "Sarah Jenkins",
    email: "s.jenkins@globalkol.sg",
    phone: "+65 8123 9876",
    company: "SEA Brands Alliance",
    service: "Influencer & KOL/KOC Marketing",
    budget: "> 500 triệu",
    market: "Vietnam & Thailand",
    message: "Looking for a specialized gaming marketing agency in Vietnam to execute TikTok creator challenges for our upcoming anime gacha title.",
    date: "2026-08-19 09:15",
    status: "contacted",
  },
  {
    id: "lead-003",
    name: "Trần Anh Quân",
    email: "quan.tran@vnmobile.com",
    phone: "0934 888 999",
    company: "VN Mobile Interactive",
    service: "Chiến lược & Định vị Thương hiệu",
    budget: "50 – 150 triệu",
    market: "Việt Nam",
    message: "Cần xây dựng bộ nhận diện và chiến lược Go-To-Market cho ứng dụng thể thao điện tử.",
    date: "2026-08-15 16:45",
    status: "closed",
  },
];

export default function LeadsManager({ locale }: { locale: string }) {
  const [leads, setLeads] = useState<Lead[]>(initialSampleLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.service.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === "all" || lead.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, newStatus: Lead["status"]) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const exportCSV = () => {
    const headers = "ID,Name,Email,Phone,Company,Service,Budget,Market,Status,Date\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.id}","${l.name}","${l.email}","${l.phone}","${l.company}","${l.service}","${l.budget}","${l.market}","${l.status}","${l.date}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anbu-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === "vi" ? "Tìm theo tên, email, công ty..." : "Search leads..."}
              className="w-72 rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                filterStatus === "all" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {locale === "vi" ? "Tất cả" : "All"} ({leads.length})
            </button>
            <button
              onClick={() => setFilterStatus("new")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                filterStatus === "new" ? "bg-white text-rose-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {locale === "vi" ? "Mới nhận" : "New"} ({leads.filter((l) => l.status === "new").length})
            </button>
            <button
              onClick={() => setFilterStatus("contacted")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                filterStatus === "contacted" ? "bg-white text-amber-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {locale === "vi" ? "Đã liên hệ" : "Contacted"}
            </button>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <span>📥 Xuất file CSV</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Khách hàng</th>
                <th className="px-6 py-3.5">Dịch vụ quan tâm</th>
                <th className="px-6 py-3.5">Ngân sách</th>
                <th className="px-6 py-3.5">Thời gian</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="transition hover:bg-slate-50/80">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{lead.name}</div>
                    <div className="text-xs text-slate-500">{lead.company} • {lead.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {lead.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{lead.budget}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{lead.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === "new"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : lead.status === "contacted"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {lead.status === "new" ? "Mới nhận" : lead.status === "contacted" ? "Đã liên hệ" : "Hoàn tất"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-[#2271b1] hover:text-white transition"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">{selectedLead.name}</h3>
                <p className="text-xs text-slate-500">{selectedLead.company} • Gửi lúc {selectedLead.date}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-slate-500">Email:</span>
                <p className="mt-1 font-bold text-slate-900">{selectedLead.email}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-slate-500">Số điện thoại:</span>
                <p className="mt-1 font-bold text-slate-900">{selectedLead.phone}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-slate-500">Dịch vụ:</span>
                <p className="mt-1 font-bold text-blue-700">{selectedLead.service}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-slate-500">Gói ngân sách:</span>
                <p className="mt-1 font-bold text-slate-900">{selectedLead.budget}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Yêu cầu từ đối tác / khách hàng:</span>
              <p className="mt-2 text-sm leading-relaxed text-slate-800">{selectedLead.message}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Đổi trạng thái:</span>
                <button
                  onClick={() => updateStatus(selectedLead.id, "new")}
                  className="rounded px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100"
                >
                  Mới
                </button>
                <button
                  onClick={() => updateStatus(selectedLead.id, "contacted")}
                  className="rounded px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100"
                >
                  Đã liên hệ
                </button>
                <button
                  onClick={() => updateStatus(selectedLead.id, "closed")}
                  className="rounded px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                >
                  Hoàn tất
                </button>
              </div>

              <a
                href={`mailto:${selectedLead.email}?subject=ANBU phản hồi tư vấn chiến dịch cho ${selectedLead.company}`}
                className="rounded-lg bg-[#2271b1] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#135e96]"
              >
                Gửi Email Phản Hồi ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

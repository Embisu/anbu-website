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
      <div className="flex flex-col gap-4 rounded-3xl border border-navy-800 bg-navy-950 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === "vi" ? "Tìm theo tên, email, công ty..." : "Search leads..."}
              className="w-72 rounded-2xl border border-navy-800 bg-navy-900 py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex rounded-xl border border-navy-800 bg-navy-900/60 p-1">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                filterStatus === "all" ? "bg-orange-500 text-white" : "text-navy-400 hover:text-white"
              }`}
            >
              {locale === "vi" ? "Tất cả" : "All"} ({leads.length})
            </button>
            <button
              onClick={() => setFilterStatus("new")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                filterStatus === "new" ? "bg-orange-500 text-white" : "text-navy-400 hover:text-white"
              }`}
            >
              {locale === "vi" ? "Mới" : "New"} ({leads.filter((l) => l.status === "new").length})
            </button>
            <button
              onClick={() => setFilterStatus("contacted")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                filterStatus === "contacted" ? "bg-orange-500 text-white" : "text-navy-400 hover:text-white"
              }`}
            >
              {locale === "vi" ? "Đã liên hệ" : "Contacted"}
            </button>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-xl border border-navy-800 bg-navy-900 px-4 py-2 text-xs font-bold text-navy-200 hover:border-orange-500 hover:text-white"
        >
          <span>📥 Xuất file CSV</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-3xl border border-navy-800 bg-navy-950/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-navy-300">
            <thead className="border-b border-navy-800 bg-navy-900/90 text-[11px] font-bold uppercase tracking-wider text-navy-400">
              <tr>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Dịch vụ quan tâm</th>
                <th className="px-6 py-4">Ngân sách</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="transition hover:bg-navy-900/40">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{lead.name}</div>
                    <div className="text-xs text-navy-400">{lead.company} • {lead.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-navy-800 px-2.5 py-1 text-xs font-semibold text-orange-400">
                      {lead.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">{lead.budget}</td>
                  <td className="px-6 py-4 text-xs font-mono">{lead.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === "new"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : lead.status === "contacted"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {lead.status === "new" ? "Mới nhận" : lead.status === "contacted" ? "Đã liên hệ" : "Hoàn tất"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="rounded-xl bg-navy-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-500"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl border border-navy-800 bg-navy-900 p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white">{selectedLead.name}</h3>
                <p className="text-xs text-navy-400">{selectedLead.company} • Gửi lúc {selectedLead.date}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-navy-800 text-navy-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-navy-950 p-4">
                <span className="text-navy-400">Email:</span>
                <p className="mt-1 font-semibold text-white">{selectedLead.email}</p>
              </div>
              <div className="rounded-2xl bg-navy-950 p-4">
                <span className="text-navy-400">Số điện thoại:</span>
                <p className="mt-1 font-semibold text-white">{selectedLead.phone}</p>
              </div>
              <div className="rounded-2xl bg-navy-950 p-4">
                <span className="text-navy-400">Dịch vụ:</span>
                <p className="mt-1 font-semibold text-orange-400">{selectedLead.service}</p>
              </div>
              <div className="rounded-2xl bg-navy-950 p-4">
                <span className="text-navy-400">Gói ngân sách:</span>
                <p className="mt-1 font-semibold text-white">{selectedLead.budget}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-navy-950 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-400">Tin nhắn yêu cầu từ khách hàng:</span>
              <p className="mt-2 text-sm leading-relaxed text-navy-100">{selectedLead.message}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-navy-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy-400">Chuyển trạng thái:</span>
                <button
                  onClick={() => updateStatus(selectedLead.id, "new")}
                  className="rounded-lg bg-navy-800 px-3 py-1 text-xs text-rose-400 hover:bg-rose-500/20"
                >
                  Mới
                </button>
                <button
                  onClick={() => updateStatus(selectedLead.id, "contacted")}
                  className="rounded-lg bg-navy-800 px-3 py-1 text-xs text-amber-400 hover:bg-amber-500/20"
                >
                  Đã liên hệ
                </button>
                <button
                  onClick={() => updateStatus(selectedLead.id, "closed")}
                  className="rounded-lg bg-navy-800 px-3 py-1 text-xs text-emerald-400 hover:bg-emerald-500/20"
                >
                  Hoàn tất
                </button>
              </div>

              <a
                href={`mailto:${selectedLead.email}?subject=ANBU phản hồi tư vấn chiến dịch cho ${selectedLead.company}`}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110"
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

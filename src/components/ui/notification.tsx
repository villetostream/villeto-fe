"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

export default function Notification({ onClose }) {
  const initialNotifications = [
    {
      id: 1,
      title:
        "We noticed that you used your expense card to make some transactions kindly log your expense.",
      actionText: "Log Expense",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title:
        "We noticed that you used your expense card to make some transactions kindly log your expense.",
      actionText: "Log Expense",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 3,
      title:
        "We noticed that you used your expense card to make some transactions kindly log your expense.",
      actionText: "Log Expense",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 4,
      title:
        "We  that you used your expense card to make some transactions kindly log your expense.",
      actionText: "Log Expense",
      time: "4 hours ago",
      unread: false,
    },
    {
      id: 5,
      title:
        "We expense card to make some transactions kindly log your expense.",
      actionText: "Log Expense",
      time: "5 hours ago",
      unread: false,
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [showAll, setShowAll] = useState(false);
  const visibleNotifications = showAll
    ? notifications
    : notifications.slice(0, 3);
  const allRead = notifications.every((n) => !n.unread);

  // Load saved notifications from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("villeto.notifications");
      if (saved) setNotifications(JSON.parse(saved));
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Persist notifications whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "villeto.notifications",
        JSON.stringify(notifications)
      );
    } catch (e) {
      // ignore quota errors
    }
  }, [notifications]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden">
      <div className="flex items-start justify-between p-5 border-b">
        <div>
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
      </div>

      <div className="flex items-start gap-4 mt-4 place-self-end">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-foreground">Mark all as read</span>
          <input
            type="checkbox"
            className="w-4 h-4 rounded border text-primary accent-primary"
            checked={allRead}
            onChange={(e) =>
              setNotifications((prev) =>
                prev.map((p) => ({ ...p, unread: !e.target.checked }))
              )
            }
          />
        </label>
        {/* <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button> */}
      </div>

      <div
        className={`p-5 space-y-4 ${
          showAll ? "max-h-113 overflow-y-auto pr-2" : ""
        }`}
      >
        {visibleNotifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-4 p-4 rounded-md shadow-sm ${
              n.unread ? "bg-emerald-50" : "bg-slate-50"
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-4 h-4 rounded-full">
                <img
                  src="/images/villeto-logo-v.png"
                  alt="Villeto logo"
                  className="w-4 h-4 object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{n.title}</p>
              <a
                className="text-teal-600 font-medium text-sm inline-block mb-2"
                href="#"
              >
                {n.actionText}
              </a>
              <div className="text-xs text-muted-foreground">{n.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 border-t text-center">
        {notifications.length > 3 ? (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="text-teal-600 text-sm font-medium"
          >
            {showAll ? "Show less" : "View more notifications"}
          </button>
        ) : (
          <a className="text-teal-600 text-sm font-medium" href="#">
            View more notifications
          </a>
        )}
      </div>
    </div>
  );
}

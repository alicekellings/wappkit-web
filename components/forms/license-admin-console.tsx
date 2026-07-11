"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LicenseStatus = "active" | "inactive" | "disabled" | "unknown";
type SortField =
  | "updatedAt"
  | "createdAt"
  | "customerEmail"
  | "status"
  | "productName";
type SortDirection = "asc" | "desc";
type DeviceFilter = "all" | "bound" | "unbound";

type AdminLicenseListItem = {
  id: string;
  key: string;
  status: LicenseStatus;
  boundDevice?: {
    deviceId: string;
    deviceName: string;
    boundAt: string;
    lastValidatedAt: string;
  } | null;
  checkoutId: string;
  requestId: string | null;
  orderId: string;
  customerEmail: string;
  customerName: string | null;
  productName: string;
  toolSlug: string;
  createdAt: string;
  updatedAt: string;
};

type AdminLicenseListResponse = {
  items: AdminLicenseListItem[];
  summary: {
    total: number;
    active: number;
    inactive: number;
    disabled: number;
    bound: number;
  };
};

type QaLicenseResult = {
  orderId: string;
  customerEmail: string;
  productName: string;
  toolSlug: string;
  licenseKey: string;
  status: LicenseStatus;
};

function getLicenseStatusTone(status: LicenseStatus) {
  switch (status) {
    case "active":
      return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300";
    case "inactive":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "disabled":
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    default:
      return "border-muted bg-muted/40 text-muted-foreground";
  }
}

function buildSummary(items: AdminLicenseListItem[]) {
  return {
    total: items.length,
    active: items.filter((item) => item.status === "active").length,
    inactive: items.filter((item) => item.status === "inactive").length,
    disabled: items.filter((item) => item.status === "disabled").length,
    bound: items.filter((item) => item.boundDevice).length,
  };
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function matchesQuery(item: AdminLicenseListItem, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    item.key,
    item.orderId,
    item.customerEmail,
    item.customerName ?? "",
    item.productName,
    item.toolSlug,
    item.boundDevice?.deviceName ?? "",
    item.boundDevice?.deviceId ?? "",
  ].some((value) => value.toLowerCase().includes(normalizedQuery));
}

function truncateMiddle(value: string, start = 6, end = 5) {
  if (value.length <= start + end + 3) {
    return value;
  }

  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

function compareStatus(left: LicenseStatus, right: LicenseStatus) {
  const order: Record<LicenseStatus, number> = {
    active: 0,
    inactive: 1,
    disabled: 2,
    unknown: 3,
  };

  return order[left] - order[right];
}

function sortItems(
  items: AdminLicenseListItem[],
  sortField: SortField,
  sortDirection: SortDirection,
) {
  const direction = sortDirection === "asc" ? 1 : -1;

  return [...items].sort((left, right) => {
    let comparison = 0;

    switch (sortField) {
      case "createdAt":
        comparison = left.createdAt.localeCompare(right.createdAt);
        break;
      case "customerEmail":
        comparison = left.customerEmail.localeCompare(right.customerEmail);
        break;
      case "status":
        comparison = compareStatus(left.status, right.status);
        break;
      case "productName":
        comparison = left.productName.localeCompare(right.productName);
        break;
      case "updatedAt":
      default:
        comparison = left.updatedAt.localeCompare(right.updatedAt);
        break;
    }

    if (comparison === 0) {
      comparison = left.key.localeCompare(right.key);
    }

    return comparison * direction;
  });
}

function replaceLicenseState(
  currentItems: AdminLicenseListItem[],
  licenseKey: string,
  data: { status: string; boundDevice?: AdminLicenseListItem["boundDevice"] },
) {
  const nextUpdatedAt = new Date().toISOString();

  return currentItems.map((item) =>
    item.key === licenseKey
      ? {
          ...item,
          status: data.status as LicenseStatus,
          boundDevice: data.boundDevice ?? null,
          updatedAt: nextUpdatedAt,
        }
      : item,
  );
}

function SortableHeader({
  label,
  field,
  sortField,
  sortDirection,
  onSort,
  className,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}) {
  const isActive = sortField === field;

  return (
    <TableHead className={className}>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
        onClick={() => onSort(field)}
      >
        <span>{label}</span>
        {isActive ? (
          sortDirection === "asc" ? (
            <ArrowUp className="size-3.5" />
          ) : (
            <ArrowDown className="size-3.5" />
          )
        ) : (
          <ChevronsUpDown className="size-3.5 opacity-60" />
        )}
      </button>
    </TableHead>
  );
}

export function LicenseAdminConsole() {
  const [items, setItems] = useState<AdminLicenseListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>("all");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<AdminLicenseListItem | null>(null);
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreatingQaLicense, setIsCreatingQaLicense] = useState(false);
  const [qaLicenseResult, setQaLicenseResult] = useState<QaLicenseResult | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [activeBatchAction, setActiveBatchAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const summary = useMemo(() => buildSummary(items), [items]);

  async function loadLicenseList(showSpinner = false) {
    try {
      if (showSpinner) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetch("/api/admin/license/list", {
        method: "GET",
      });
      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: AdminLicenseListResponse;
      };

      if (response.status === 401) {
        window.location.reload();
        return;
      }

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message ?? "Failed to load license records.");
      }

      const data = payload.data;

      setItems(data.items);
      setSelectedKeys((current) =>
        current.filter((key) => data.items.some((item) => item.key === key)),
      );
      setSelectedItem((current) =>
        current ? data.items.find((item) => item.key === current.key) ?? null : null,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to load license records.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    void loadLicenseList();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, deviceFilter, sortField, sortDirection, pageSize]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const statusMatches =
        statusFilter === "all" ? true : item.status === statusFilter;
      const deviceMatches =
        deviceFilter === "all"
          ? true
          : deviceFilter === "bound"
            ? Boolean(item.boundDevice)
            : !item.boundDevice;
      return statusMatches && deviceMatches && matchesQuery(item, searchQuery);
    });
  }, [deviceFilter, items, searchQuery, statusFilter]);

  const sortedItems = useMemo(
    () => sortItems(filteredItems, sortField, sortDirection),
    [filteredItems, sortField, sortDirection],
  );

  const pageSizeNumber = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSizeNumber));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSizeNumber;
    return sortedItems.slice(startIndex, startIndex + pageSizeNumber);
  }, [currentPage, pageSizeNumber, sortedItems]);

  const allVisibleKeys = paginatedItems.map((item) => item.key);
  const allVisibleSelected =
    allVisibleKeys.length > 0 &&
    allVisibleKeys.every((key) => selectedKeys.includes(key));
  const visibleRangeStart =
    sortedItems.length === 0 ? 0 : (currentPage - 1) * pageSizeNumber + 1;
  const visibleRangeEnd =
    sortedItems.length === 0
      ? 0
      : Math.min(currentPage * pageSizeNumber, sortedItems.length);

  function updateLicenseLocally(
    licenseKey: string,
    data: { status: string; boundDevice?: AdminLicenseListItem["boundDevice"] },
  ) {
    setItems((current) => replaceLicenseState(current, licenseKey, data));
    setSelectedItem((current) =>
      current && current.key === licenseKey
        ? {
            ...current,
            status: data.status as LicenseStatus,
            boundDevice: data.boundDevice ?? null,
            updatedAt: new Date().toISOString(),
          }
        : current,
    );
  }

  async function handleCopyValue(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setNotice(`${label} copied.`);
    setError(null);
  }

  async function handleCreateQaLicense() {
    const confirmed = window.confirm(
      "Create an internal QA license for AI E-commerce Visual Studio? This writes a test record to the live license store.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsCreatingQaLicense(true);
      setError(null);
      setNotice(null);
      setQaLicenseResult(null);

      const response = await fetch("/api/admin/license/create-qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolSlug: "ai-ecom-visual-studio",
        }),
      });
      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: QaLicenseResult;
      };

      if (response.status === 401) {
        window.location.reload();
        return;
      }

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message ?? "Failed to create the QA license.");
      }

      setQaLicenseResult(payload.data);
      setNotice("Internal QA license created. Use it to test activation and unbind.");
      await loadLicenseList(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to create the QA license.",
      );
    } finally {
      setIsCreatingQaLicense(false);
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection(field === "updatedAt" ? "desc" : "asc");
  }

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setDeviceFilter("all");
    setSelectedKeys([]);
  }

  function confirmLicenseAction(
    action:
      | { type: "unbind" }
      | { type: "status"; value: "disable" | "enable" },
  ) {
    if (action.type === "status" && action.value === "enable") {
      return true;
    }

    if (action.type === "unbind") {
      return window.confirm(
        "Unbind this device now? The customer will need to activate again on the next launch.",
      );
    }

    return window.confirm(
      "Disable this license now? The customer will no longer be able to validate it until you re-enable it.",
    );
  }

  async function handleLicenseAction(
    licenseKey: string,
    action:
      | { type: "unbind" }
      | { type: "status"; value: "disable" | "enable" },
  ) {
    if (!confirmLicenseAction(action)) {
      return;
    }

    try {
      setActiveActionKey(licenseKey);
      setError(null);
      setNotice(null);

      const endpoint =
        action.type === "unbind"
          ? "/api/admin/license/unbind"
          : "/api/admin/license/status";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          action.type === "unbind"
            ? JSON.stringify({ licenseKey })
            : JSON.stringify({ licenseKey, action: action.value }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: {
          licenseKey: string;
          status: string;
          boundDevice?: AdminLicenseListItem["boundDevice"];
        };
      };

      if (response.status === 401) {
        window.location.reload();
        return;
      }

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message ?? "Failed to update the license.");
      }

      updateLicenseLocally(payload.data.licenseKey, {
        status: payload.data.status,
        boundDevice: payload.data.boundDevice ?? null,
      });
      setNotice(payload.message ?? "The license was updated.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to update the license.",
      );
    } finally {
      setActiveActionKey(null);
    }
  }

  async function handleBatchAction(action: "disable" | "enable" | "unbind") {
    if (selectedKeys.length === 0) {
      return;
    }

    const confirmed =
      action === "enable"
        ? true
        : window.confirm(
            action === "unbind"
              ? `Unbind ${selectedKeys.length} selected device binding(s)?`
              : `Disable ${selectedKeys.length} selected license(s)?`,
          );

    if (!confirmed) {
      return;
    }

    try {
      setActiveBatchAction(action);
      setError(null);
      setNotice(null);

      for (const licenseKey of selectedKeys) {
        const endpoint =
          action === "unbind"
            ? "/api/admin/license/unbind"
            : "/api/admin/license/status";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:
            action === "unbind"
              ? JSON.stringify({ licenseKey })
              : JSON.stringify({ licenseKey, action }),
        });
        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: {
            licenseKey: string;
            status: string;
            boundDevice?: AdminLicenseListItem["boundDevice"];
          };
        };

        if (response.status === 401) {
          window.location.reload();
          return;
        }

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.message ?? "Failed to update one or more licenses.");
        }

        updateLicenseLocally(payload.data.licenseKey, {
          status: payload.data.status,
          boundDevice: payload.data.boundDevice ?? null,
        });
      }

      setNotice(
        action === "unbind"
          ? "Selected devices were unbound."
          : action === "disable"
            ? "Selected licenses were disabled."
            : "Selected licenses were re-enabled.",
      );
      setSelectedKeys([]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to update the selected licenses.",
      );
    } finally {
      setActiveBatchAction(null);
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/session", {
        method: "DELETE",
      });
    } finally {
      window.location.reload();
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border bg-card p-8 text-sm text-muted-foreground">
        Loading license records...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Internal Admin
            </p>
            <h1 className="mt-3 font-heading text-4xl text-foreground">
              License operations console
            </h1>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              Review licenses in one list, filter by status, inspect device
              bindings, and perform support actions without jumping through
              separate search screens.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              rounded="full"
              variant="outline"
              onClick={() => {
                void handleCreateQaLicense();
              }}
              disabled={isCreatingQaLicense}
            >
              {isCreatingQaLicense ? "Creating..." : "Create QA License"}
            </Button>
            <Button
              type="button"
              rounded="full"
              variant="outline"
              onClick={() => {
                void loadLicenseList(true);
              }}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              type="button"
              rounded="full"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Closing..." : "Log Out"}
            </Button>
          </div>
        </div>

        {qaLicenseResult ? (
          <div className="mt-6 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  Internal QA license ready
                </p>
                <p className="mt-1 text-muted-foreground">
                  Use this key in the desktop app, then test retrieval and unbind with
                  the order ID and email below.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                rounded="full"
                variant="outline"
                onClick={() => {
                  void handleCopyValue(qaLicenseResult.licenseKey, "QA license key");
                }}
              >
                Copy key
              </Button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  License key
                </p>
                <code className="mt-1 block break-all text-foreground">
                  {qaLicenseResult.licenseKey}
                </code>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Order ID
                </p>
                <code className="mt-1 block break-all text-foreground">
                  {qaLicenseResult.orderId}
                </code>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <code className="mt-1 block break-all text-foreground">
                  {qaLicenseResult.customerEmail}
                </code>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">{summary.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-sky-700 dark:text-sky-300">
                {summary.active}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
                {summary.inactive}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Disabled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-700 dark:text-amber-300">
                {summary.disabled}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Bound Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">{summary.bound}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,2fr)_200px_200px_170px]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Search licenses, orders, emails, devices
            </label>
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by key, order ID, email, customer, device..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Binding</label>
            <Select
              value={deviceFilter}
              onValueChange={(value) => setDeviceFilter(value as DeviceFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All bindings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All bindings</SelectItem>
                <SelectItem value="bound">Bound only</SelectItem>
                <SelectItem value="unbound">Unbound only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rows per page</label>
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger>
                <SelectValue placeholder="10 rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 rows</SelectItem>
                <SelectItem value="20">20 rows</SelectItem>
                <SelectItem value="50">50 rows</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            rounded="full"
            variant="destructive"
            onClick={() => {
              void handleBatchAction("disable");
            }}
            disabled={selectedKeys.length === 0 || activeBatchAction != null}
          >
            {activeBatchAction === "disable" ? "Disabling..." : "Batch Disable"}
          </Button>
          <Button
            type="button"
            rounded="full"
            variant="outline"
            onClick={() => {
              void handleBatchAction("enable");
            }}
            disabled={selectedKeys.length === 0 || activeBatchAction != null}
          >
            {activeBatchAction === "enable" ? "Updating..." : "Batch Re-enable"}
          </Button>
          <Button
            type="button"
            rounded="full"
            variant="outline"
            onClick={() => {
              void handleBatchAction("unbind");
            }}
            disabled={selectedKeys.length === 0 || activeBatchAction != null}
          >
            {activeBatchAction === "unbind" ? "Removing..." : "Batch Unbind"}
          </Button>
          <Button type="button" rounded="full" variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
          <div className="ml-auto rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground">
            {selectedKeys.length} selected
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Physical delete is intentionally not exposed here. For license support,
          disable, re-enable, unbind, and audit-friendly detail views are safer
          than destructive removal.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          {notice}
        </div>
      ) : null}

      <div className="rounded-[2rem] border bg-card p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">License list</p>
            <p className="text-sm text-muted-foreground">
              Showing {visibleRangeStart}-{visibleRangeEnd} of {sortedItems.length} matching
              licenses
            </p>
          </div>
          <div className="rounded-full border bg-background px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {sortField} {sortDirection}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedKeys((current) =>
                          Array.from(new Set([...current, ...allVisibleKeys])),
                        );
                      } else {
                        setSelectedKeys((current) =>
                          current.filter((key) => !allVisibleKeys.includes(key)),
                        );
                      }
                    }}
                  />
                </TableHead>
                <SortableHeader
                  label="License"
                  field="productName"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="min-w-[220px]"
                />
                <SortableHeader
                  label="Status"
                  field="status"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[120px]"
                />
                <SortableHeader
                  label="Customer"
                  field="customerEmail"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="min-w-[180px]"
                />
                <TableHead className="min-w-[130px]">Order</TableHead>
                <TableHead className="min-w-[150px]">Device</TableHead>
                <SortableHeader
                  label="Updated"
                  field="updatedAt"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[130px]"
                />
                <TableHead className="sticky right-0 z-20 w-[72px] bg-card text-right shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.45)]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <TableRow key={item.key}>
                    <TableCell className="py-3">
                      <Checkbox
                        checked={selectedKeys.includes(item.key)}
                        onCheckedChange={(checked) => {
                          setSelectedKeys((current) =>
                            checked
                              ? Array.from(new Set([...current, item.key]))
                              : current.filter((key) => key !== item.key),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{item.productName}</p>
                        <code
                          className="block text-xs text-muted-foreground"
                          title={item.key}
                        >
                          {truncateMiddle(item.key, 8, 6)}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge className={getLicenseStatusTone(item.status)} variant="outline">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="space-y-1 text-sm">
                        <p className="truncate font-medium text-foreground" title={item.customerEmail}>
                          {item.customerName || "Name not provided"}
                        </p>
                        <p className="truncate text-muted-foreground" title={item.customerEmail}>
                          {item.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-foreground" title={item.orderId}>
                          {truncateMiddle(item.orderId, 7, 6)}
                        </p>
                        <p className="truncate text-muted-foreground" title={item.toolSlug}>
                          {item.toolSlug}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {item.boundDevice ? (
                        <div className="space-y-1 text-sm">
                          <p
                            className="truncate font-medium text-foreground"
                            title={item.boundDevice.deviceName}
                          >
                            {item.boundDevice.deviceName}
                          </p>
                          <p
                            className="truncate text-muted-foreground"
                            title={item.boundDevice.deviceId}
                          >
                            {truncateMiddle(item.boundDevice.deviceId, 8, 6)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not bound</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground">
                      <div className="leading-5">
                        {formatDateTime(item.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell className="sticky right-0 z-10 bg-card py-3 text-right shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.45)]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            rounded="full"
                            className="size-9"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setSelectedItem(item)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              void handleCopyValue(item.key, "License key");
                            }}
                          >
                            Copy license
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {item.boundDevice ? (
                            <DropdownMenuItem
                              onClick={() => {
                                void handleLicenseAction(item.key, { type: "unbind" });
                              }}
                              disabled={
                                activeActionKey === item.key || activeBatchAction != null
                              }
                            >
                              {activeActionKey === item.key ? "Working..." : "Unbind device"}
                            </DropdownMenuItem>
                          ) : null}
                          {item.status === "disabled" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                void handleLicenseAction(item.key, {
                                  type: "status",
                                  value: "enable",
                                });
                              }}
                              disabled={
                                activeActionKey === item.key || activeBatchAction != null
                              }
                            >
                              {activeActionKey === item.key ? "Working..." : "Re-enable license"}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                void handleLicenseAction(item.key, {
                                  type: "status",
                                  value: "disable",
                                });
                              }}
                              disabled={
                                activeActionKey === item.key || activeBatchAction != null
                              }
                            >
                              {activeActionKey === item.key ? "Working..." : "Disable license"}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        No license records match the current filter.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try clearing one or more filters to see the full license list again.
                      </p>
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          rounded="full"
                          onClick={clearFilters}
                        >
                          Reset filters
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              rounded="full"
              variant="outline"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              type="button"
              rounded="full"
              variant="outline"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={selectedItem != null} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          {selectedItem ? (
            <>
              <SheetHeader>
                <SheetTitle>License details</SheetTitle>
                <SheetDescription>
                  Review the current status, device binding, and order linkage for this
                  license.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    License key
                  </p>
                  <code className="mt-2 block break-all text-sm text-foreground">
                    {selectedItem.key}
                  </code>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className={getLicenseStatusTone(selectedItem.status)} variant="outline">
                      {selectedItem.status}
                    </Badge>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      rounded="full"
                      onClick={() => {
                        void handleCopyValue(selectedItem.key, "License key");
                      }}
                    >
                      Copy key
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-medium text-foreground">
                        {selectedItem.customerName || "Name not provided"}
                      </p>
                      <p className="break-all text-sm text-muted-foreground">
                        {selectedItem.customerEmail}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Product</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-medium text-foreground">{selectedItem.productName}</p>
                      <p className="text-sm text-muted-foreground">{selectedItem.toolSlug}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Order linkage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-foreground">Order ID:</span>{" "}
                      <span className="break-all text-muted-foreground">{selectedItem.orderId}</span>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Checkout ID:</span>{" "}
                      <span className="break-all text-muted-foreground">
                        {selectedItem.checkoutId}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Request ID:</span>{" "}
                      <span className="break-all text-muted-foreground">
                        {selectedItem.requestId || "Not captured"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Created:</span>{" "}
                      <span className="text-muted-foreground">
                        {formatDateTime(selectedItem.createdAt)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Updated:</span>{" "}
                      <span className="text-muted-foreground">
                        {formatDateTime(selectedItem.updatedAt)}
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Device binding</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {selectedItem.boundDevice ? (
                      <>
                        <p>
                          <span className="font-medium text-foreground">Device:</span>{" "}
                          <span className="text-muted-foreground">
                            {selectedItem.boundDevice.deviceName}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Device ID:</span>{" "}
                          <span className="break-all text-muted-foreground">
                            {selectedItem.boundDevice.deviceId}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Bound at:</span>{" "}
                          <span className="text-muted-foreground">
                            {formatDateTime(selectedItem.boundDevice.boundAt)}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-foreground">
                            Last validated:
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {formatDateTime(selectedItem.boundDevice.lastValidatedAt)}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">
                        This license is not currently bound to a device.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

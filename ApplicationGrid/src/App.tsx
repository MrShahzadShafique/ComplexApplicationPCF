import * as React from "react";
import { Application } from "./models/Application";
import "./App.css";

interface AppProps { applications: Application[]; loading: boolean; }
type SortKey = "applicationNumber" | "applicationType" | "status" | "submittedDate";

const samples: Application[] = [
    { id: "sample-1", applicationNumber: "APP-10245", name: "Northwind license renewal", applicationType: "Renewal", status: "Under Review", customer: "Northwind Traders", submittedDate: new Date("2026-08-20") },
    { id: "sample-2", applicationNumber: "APP-10244", name: "Contoso operating permit", applicationType: "Permit", status: "Approved", customer: "Contoso Ltd", submittedDate: new Date("2026-08-18") },
    { id: "sample-3", applicationNumber: "APP-10243", name: "Adventure Works application", applicationType: "License", status: "Pending", customer: "Adventure Works", submittedDate: new Date("2026-08-15") },
    { id: "sample-4", applicationNumber: "APP-10242", name: "Fabrikam renewal request", applicationType: "Renewal", status: "Rejected", customer: "Fabrikam Inc", submittedDate: new Date("2026-08-10") }
];

const dateText = (date?: Date) => date ? date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "-";
const badgeClass = (status: string) => `badge badge-${status.toLowerCase().replace(" ", "-")}`;

export const App: React.FC<AppProps> = ({ applications, loading }) => {
    const [query, setQuery] = React.useState("");
    const [status, setStatus] = React.useState("All statuses");
    const [type, setType] = React.useState("All types");
    const [sort, setSort] = React.useState<SortKey>("submittedDate");
    const [ascending, setAscending] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [selected, setSelected] = React.useState<Application>();
    const source = applications.length ? applications : samples;
    const statuses = Array.from(new Set(source.map((item) => item.status)));
    const types = Array.from(new Set(source.map((item) => item.applicationType)));
    const filtered = source.filter((item) => {
        const search = query.toLowerCase();
        return [item.applicationNumber, item.name, item.customer].some((value) => value.toLowerCase().includes(search)) &&
            (status === "All statuses" || item.status === status) && (type === "All types" || item.applicationType === type);
    }).sort((left, right) => {
        const leftValue = left[sort]?.valueOf() ?? "";
        const rightValue = right[sort]?.valueOf() ?? "";
        return String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true }) * (ascending ? 1 : -1);
    });
    const pageSize = 6;
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);
    const sortBy = (key: SortKey) => { setAscending(sort === key ? !ascending : true); setSort(key); setPage(0); };
    const reset = () => { setQuery(""); setStatus("All statuses"); setType("All types"); setPage(0); };

    if (loading) return <main className="application-control loading" aria-busy="true"><div className="spinner" />Loading applications...</main>;
    return <main className="application-control">
        <header className="heading"><div><div className="eyebrow">Application operations</div><h1>My applications</h1><p>Review, triage, and open submitted applications.</p></div><strong>{filtered.length} records</strong></header>
        <section className="toolbar" aria-label="Application filters">
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Search number, name, or customer" aria-label="Search applications" />
            <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }} aria-label="Filter by status"><option>All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={type} onChange={(event) => { setType(event.target.value); setPage(0); }} aria-label="Filter by application type"><option>All types</option>{types.map((item) => <option key={item}>{item}</option>)}</select>
            <button className="quiet" onClick={reset}>Clear</button>
        </section>
        <section className="table-shell"><table><caption className="sr-only">Applications</caption><thead><tr><th><button onClick={() => sortBy("applicationNumber")}>Application # {sort === "applicationNumber" && (ascending ? "↑" : "↓")}</button></th><th>Name</th><th><button onClick={() => sortBy("applicationType")}>Type {sort === "applicationType" && (ascending ? "↑" : "↓")}</button></th><th><button onClick={() => sortBy("status")}>Status {sort === "status" && (ascending ? "↑" : "↓")}</button></th><th><button onClick={() => sortBy("submittedDate")}>Submitted {sort === "submittedDate" && (ascending ? "↑" : "↓")}</button></th></tr></thead><tbody>{visible.map((item) => <tr key={item.id} onClick={() => setSelected(item)} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setSelected(item)}><td><strong>{item.applicationNumber}</strong></td><td>{item.name}</td><td>{item.applicationType}</td><td><span className={badgeClass(item.status)}>{item.status}</span></td><td>{dateText(item.submittedDate)}</td></tr>)}</tbody></table>{!visible.length && <div className="empty"><h2>No applications found</h2><p>Try clearing a filter or changing your search.</p></div>}</section>
        <footer><span>Showing {visible.length ? page * pageSize + 1 : 0}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}</span><span><button disabled={!page} onClick={() => setPage(page - 1)}>Previous</button><button disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</button></span></footer>
        {selected && <div className="overlay" role="presentation" onClick={() => setSelected(undefined)}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="details-title" onClick={(event) => event.stopPropagation()}><button className="close" aria-label="Close details" onClick={() => setSelected(undefined)}>×</button><div className="eyebrow">Application details</div><h2 id="details-title">{selected.applicationNumber}</h2><p>{selected.name}</p><dl><div><dt>Customer</dt><dd>{selected.customer}</dd></div><div><dt>Type</dt><dd>{selected.applicationType}</dd></div><div><dt>Status</dt><dd><span className={badgeClass(selected.status)}>{selected.status}</span></dd></div><div><dt>Submitted</dt><dd>{dateText(selected.submittedDate)}</dd></div><div><dt>Expiry</dt><dd>{dateText(selected.expiryDate)}</dd></div></dl><button className="primary" onClick={() => setSelected(undefined)}>Close</button></section></div>}
    </main>;
};

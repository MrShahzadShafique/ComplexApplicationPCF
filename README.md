# Application Management PCF

A dataset PCF control for reviewing Dataverse applications. It includes search, status and type filtering, sortable columns, pagination, status badges, loading and empty states, and a record details dialog.

## Build

```powershell
npm install
npm run build
```

Add the control to a Power Apps model-driven app and configure the `Applications` dataset with the columns used by the adapter: `mcs_applicationnumber`, `mcs_name`, `mcs_applicationtype`, `mcs_status`, `mcs_customer`, `mcs_submitteddate`, and `mcs_expirydate`.

When the dataset is empty in the local harness, the control displays representative sample rows so the interaction model can be previewed.

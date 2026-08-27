import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import { App } from "./src/App";

export class ApplicationGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private root: Root | undefined;
    private container: HTMLDivElement | undefined;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.container = container;
        this.root = createRoot(container);
        this.render(context);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.render(context);
    }

    private render(context: ComponentFramework.Context<IInputs>): void {
        if (!this.root || !this.container) {
            return;
        }

        const dataset = context.parameters.sampleDataSet;
        const applications = dataset.sortedRecordIds.map((id) => {
            const record = dataset.records[id];
            return {
                id,
                applicationNumber: this.getFormattedValue(record, "mcs_applicationnumber", id),
                name: this.getFormattedValue(record, "mcs_name", "Untitled application"),
                applicationType: this.getFormattedValue(record, "mcs_applicationtype", "Application"),
                status: this.getFormattedValue(record, "mcs_status", "Pending"),
                customer: this.getFormattedValue(record, "mcs_customer", "Not assigned"),
                submittedDate: this.getDateValue(record, "mcs_submitteddate"),
                expiryDate: this.getDateValue(record, "mcs_expirydate")
            };
        });

        this.root.render(createElement(App, { applications, loading: dataset.loading }));
    }

    private getFormattedValue(
        record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
        column: string,
        fallback: string
    ): string {
        return record.getFormattedValue(column) || String(record.getValue(column) ?? fallback);
    }

    private getDateValue(
        record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
        column: string
    ): Date | undefined {
        const value = record.getValue(column);
        return value ? new Date(String(value)) : undefined;
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        this.root?.unmount();
        this.root = undefined;
        this.container = undefined;
    }
}

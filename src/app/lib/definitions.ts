import z from "zod";

export type COAOption = {
    group_id: number;
    group_name: string;
};

export type Template = {
    id: number;
    // author: string;
    title: string;
    // coa_group: string;
}

export type User = {
    id: string;
    username: string;
}

export type ItemizedRecord = {
    index: number;
    date: string;
    number: string;
    payee: string;
    account: string;
    amount: number;
    description: string;
    old_description: string;
    group: number;
}

export type SummaryRecord = {
    index: number;
    description: string;
    account: string;
    total: number;
    instances: number;
    prediction_confidence: string;
}

export type UnresolvedRecord = {
    index: number;
    description: string;
    vendor: string;
    group: number;
}

export type Option = {
    label: string;
    value: string;
};

export type CategoryTotals = {
    index: number;
    Account: string;
    Total: number;
}

export const coaSchema = z.object({
    name: z.string().min(1, "Provide a name for the chart of accounts"),
    file: z.instanceof(File),
});
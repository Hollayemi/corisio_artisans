// types/specializations.ts
export interface SpecSchema {
    spec: Record<string, string[]>;
    label: string;
}

export interface Group {
    _id: string;
    label: string;
    spec?: SpecSchema;
}

export interface SubCategory {
    _id: string;
    label: string;
    s_id: string;
    groups: Group[];
}

export interface Category {
    _id: string;
    category: string;
    sub_category: SubCategory[];
}

export interface SpecializationFormData {
    selectedGroups: string[];
    specifications: Record<string, string>;
}

export function collectSpecFromGroups(groups: Group[]): Record<string, string[]> {
    const merged: Record<string, string[]> = {};
    for (const g of groups) {
        if (!g.spec?.spec) continue;
        for (const [key, options] of Object.entries(g.spec.spec)) {
            if (!merged[key]) merged[key] = options;
        }
    }
    return merged;
}

export const prettyKey = (key: string) => key.replaceAll("_", " ");
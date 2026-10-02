import type { KcContext } from "../types/kc-context.js";

export function parseKcContext(root?: ParentNode | Document): KcContext;
export function formatMsg(ctx: KcContext, key: string, ...params: unknown[]): string;

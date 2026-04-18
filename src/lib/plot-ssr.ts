// ABOUTME: Server-side rendering shim for Observable Plot via JSDOM, used at Astro build time.
// ABOUTME: Exposes a `renderPlot` that takes Plot options and returns inline SVG/HTML markup.

import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");

const globals = globalThis as unknown as Record<string, unknown>;
globals.document = dom.window.document;
globals.window = dom.window;
globals.HTMLElement = dom.window.HTMLElement;
globals.SVGElement = dom.window.SVGElement;
globals.Node = dom.window.Node;

// Importing after globals are set so Plot's internal DOM checks resolve correctly.
// eslint-disable-next-line import/first
import * as Plot from "@observablehq/plot";

export { Plot };

export function renderPlot(options: Parameters<typeof Plot.plot>[0]): string {
  const plot = Plot.plot(options);
  return (plot as unknown as { outerHTML: string }).outerHTML;
}

// Optional lazily-loaded dependency of ai-ui-kit's MermaidRenderer. When the
// package is not installed the renderer degrades to a warning; declaring the
// module here keeps `tsc` happy under strict settings.
declare module 'mermaid';

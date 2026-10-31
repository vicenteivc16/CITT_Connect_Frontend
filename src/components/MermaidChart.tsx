'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCittNetwork } from '@/context/CittNetworkContext';

interface MermaidChartProps {
  chart: string;
}

export function MermaidChart({ chart }: MermaidChartProps) {
  const { theme } = useCittNetwork();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        setHasError(false);
        const mermaid = (await import('mermaid')).default;
        const uniqueId = `mermaid-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'neutral',
          themeVariables:
            theme === 'dark'
              ? {
                  darkMode: true,
                  background: '#141414',
                  primaryColor: '#307FE2',
                  primaryTextColor: '#FFFFFF',
                  primaryBorderColor: '#307FE2',
                  lineColor: '#FFB800',
                  secondaryColor: '#FFB800',
                  tertiaryColor: '#1A1A1A',
                }
              : {
                  darkMode: false,
                  background: '#FFFFFF',
                  primaryColor: '#307FE2',
                  primaryTextColor: '#1A1A1A',
                  primaryBorderColor: '#307FE2',
                  lineColor: '#1A1A1A',
                  secondaryColor: '#FFB800',
                  tertiaryColor: '#F5F5F5',
                },
          securityLevel: 'loose',
          fontFamily: 'Lato, -apple-system, sans-serif',
        });

        const { svg } = await mermaid.render(uniqueId, chart.trim());
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.warn('Mermaid rendering warning:', err);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, theme]);

  if (hasError) {
    return (
      <div className="my-4 rounded-xl border border-theme bg-theme-subtle p-4 font-mono text-xs text-theme-secondary">
        <p className="font-bold text-[#FFB800]">Diagrama Mermaid:</p>
        <pre className="mt-2 whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-5 flex justify-center overflow-x-auto rounded-2xl border border-theme bg-theme-subtle p-5 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

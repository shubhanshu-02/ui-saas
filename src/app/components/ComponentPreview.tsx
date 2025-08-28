'use client';
import React, { useEffect, useState } from 'react';

interface ComponentPreviewProps {
  code: string;
}

const iframeTemplate = (code: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body { margin: 1rem; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'https://esm.sh/react@18';
    import ReactDOM from 'https://esm.sh/react-dom@18';

    const Component = () => {
      ${code}
      try {
         ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(${extractComponentName(code)}));
      } catch(e) {
         document.body.innerHTML = '<pre style="color: red;">' + e.toString() + '</pre>';
      }
      
      function extractComponentName(code) {
         const match = code.match(/export function\\s+(\\w+)/);
         return match ? match[1] : null;
      }
    };
    Component();
  </script>
</body>
</html>`;

export function ComponentPreview({ code }: ComponentPreviewProps) {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    if (!code) return;
    // Sanitize input before usage in production
    const html = iframeTemplate(code);
    setSrcDoc(html);
  }, [code]);

  return (
    <iframe
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      frameBorder="0"
      title="Component Preview"
      className="w-full h-full rounded-md border border-gray-700"
    />
  );
}

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Props
interface PersonaFigmaExportProps {
  personaName: string;
  items: SerializedItem[];
  settings: PersonaSettings;
  figmaFileId: string;
  figmaAccessToken: string;
}
type SerializedItem = {
    x: number;
    y: number;
    w: number;
    h: number;
    content: string;
};
export type PersonaSettings = {
  // Theme colors
  backgroundColor: string; // Background of the grid
  columnColor: string;     // Background color of each column/item
  textColor: string;       // Text color inside items
  titleColor: string;      // Title color inside items

  // Text settings
  titleSize: number;       // Font size of the title
  textSize: number;        // Font size of the description
  titleWeight: number;     // Font weight of the title
  titleAlign: 'left' | 'center' | 'right'; // Text alignment
  lineHeight: number;      // Line height of description text
  imgMaxWidth: number;     // Max width of images in %

  // Card / box styling
  radius: number;          // Border radius
  padding: number;         // Padding inside the items
  shadow: number;          // Shadow intensity
  borderOn: boolean;       // Whether border is enabled
  borderColor: string;     // Border color
  borderWidth: number;     // Border width in px
};
export const PersonaFigmaExport: React.FC<PersonaFigmaExportProps> = ({
  personaName,
  items,
  settings,
  figmaFileId,
  figmaAccessToken,
}) => {

  const handleExport = async () => {
    if (!items || items.length === 0) {
      toast.error('No persona items to export.');
      return;
    }

    try {
      // Step 1: Convert items + settings to JSON
      const personaData = {
        name: personaName,
        items,
        settings,
      };

      const blob = new Blob([JSON.stringify(personaData)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);

      // Step 2: Trigger download so user can load it in Figma plugin
      const link = document.createElement('a');
      link.href = url;
      link.download = `${personaName || 'persona'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Persona JSON exported! Open Figma plugin to import.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export persona.');
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button onClick={handleExport}>Export to Figma</Button>
    </div>
  );
};

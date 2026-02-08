export type PartType = "front" | "middle" | "back";

export type ShelfPart = {
  id: string;
  partType: PartType;
  width: number;
  height: number;
  radius: number;
  label: string;
  outlines: Outline[];
};

export type PartPlacement = ShelfPart & {
  x: number;
  y: number;
};

export type Outline = {
  outerWidth: number;
  outerHeight: number;
  outerRadius: number;
  innerWidth: number;
  innerHeight: number;
  innerRadius: number;
  notches: Notch[];
};

export type Notch = {
  x: number;
  y: number;
  size: number;
  entranceRadius: number;
  materialRadius: number;
  side: "left" | "right";
};

type BuildPartsInput = {
  shelfCount: number;
  middleCount: number;
  minInnerWidth: number;
  minInnerHeight: number;
  borderThickness: number;
  toolGap: number;
  radiusPercent: number;
  notchSize: number;
  notchInterval: number;
  notchCornerRadius: number;
};

type LayoutInput = {
  parts: ShelfPart[];
  sheetWidth: number;
  sheetHeight: number;
  gap: number;
};

type SheetLayout = {
  id: string;
  placements: PartPlacement[];
};

export function buildShelfParts(input: BuildPartsInput): ShelfPart[] {
  const {
    shelfCount,
    middleCount,
    minInnerWidth,
    minInnerHeight,
    borderThickness,
    toolGap,
    radiusPercent,
    notchSize,
    notchInterval,
    notchCornerRadius,
  } = input;

  const parts: ShelfPart[] = [];
  const layerCount = Math.max(2, 2 + middleCount);

  const outlines = buildOutlines({
    shelfCount,
    minInnerWidth,
    minInnerHeight,
    borderThickness,
    toolGap,
    radiusPercent,
    notchSize,
    notchInterval,
    notchCornerRadius,
  });

  if (!outlines.length) {
    return parts;
  }

  const largest = outlines[outlines.length - 1];

  parts.push(
    buildPart({
      partType: "front",
      width: largest.outerWidth,
      height: largest.outerHeight,
      radius: largest.outerRadius,
      label: "Front",
      outlines,
    }),
  );

  for (let middleIndex = 0; middleIndex < middleCount; middleIndex += 1) {
    parts.push(
      buildPart({
        partType: "middle",
        width: largest.outerWidth,
        height: largest.outerHeight,
        radius: largest.outerRadius,
        label: `Middle ${middleIndex + 1}`,
        outlines,
      }),
    );
  }

  parts.push(
    buildPart({
      partType: "back",
      width: largest.outerWidth,
      height: largest.outerHeight,
      radius: largest.outerRadius,
      label: "Back",
      outlines,
    }),
  );

  return parts.slice(0, layerCount);
}

export function layoutSheets(input: LayoutInput): SheetLayout[] {
  const { parts, sheetWidth, sheetHeight, gap } = input;
  const sheets: SheetLayout[] = [];

  let currentSheet: SheetLayout = {
    id: `sheet-${sheets.length + 1}`,
    placements: [],
  };
  let cursorX = gap;
  let cursorY = gap;
  let rowHeight = 0;

  const sorted = [...parts].sort((a, b) => b.height - a.height);

  for (const part of sorted) {
    const widthWithGap = part.width + gap;
    const heightWithGap = part.height + gap;

    if (cursorX + widthWithGap > sheetWidth && cursorX > gap) {
      cursorX = gap;
      cursorY += rowHeight + gap;
      rowHeight = 0;
    }

    if (
      cursorY + heightWithGap > sheetHeight &&
      currentSheet.placements.length
    ) {
      sheets.push(currentSheet);
      currentSheet = {
        id: `sheet-${sheets.length + 1}`,
        placements: [],
      };
      cursorX = gap;
      cursorY = gap;
      rowHeight = 0;
    }

    currentSheet.placements.push({
      ...part,
      x: cursorX,
      y: cursorY,
    });

    cursorX += widthWithGap;
    rowHeight = Math.max(rowHeight, part.height);
  }

  if (currentSheet.placements.length) {
    sheets.push(currentSheet);
  }

  return sheets;
}

function buildPart(part: Omit<ShelfPart, "id">): ShelfPart {
  return {
    id: `${part.partType}-${part.label}`,
    ...part,
  };
}

function buildOutlines(input: {
  shelfCount: number;
  minInnerWidth: number;
  minInnerHeight: number;
  borderThickness: number;
  toolGap: number;
  radiusPercent: number;
  notchSize: number;
  notchInterval: number;
  notchCornerRadius: number;
}): Outline[] {
  const {
    shelfCount,
    minInnerWidth,
    minInnerHeight,
    borderThickness,
    toolGap,
    radiusPercent,
    notchSize,
    notchInterval,
    notchCornerRadius,
  } = input;

  if (shelfCount <= 0) {
    return [];
  }

  const outlines: Outline[] = [];

  let innerWidth = minInnerWidth;
  let innerHeight = minInnerHeight;
  const clampedPercent = clamp(radiusPercent, 0, 50) / 100;
  const minRadius = toolGap / 2;

  for (let shelfIndex = 0; shelfIndex < shelfCount; shelfIndex += 1) {
    const innerRadius = Math.max(
      minRadius,
      clampedPercent * Math.min(innerWidth, innerHeight),
    );
    const outerRadius = innerRadius + borderThickness;
    const outerWidth = innerWidth + borderThickness * 2;
    const outerHeight = innerHeight + borderThickness * 2;
    const notches = buildNotches({
      outerWidth,
      outerHeight,
      outerRadius,
      innerWidth,
      notchSize,
      notchInterval,
      notchCornerRadius,
      toolWidth: toolGap,
    });
    outlines.push({
      outerWidth,
      outerHeight,
      outerRadius,
      innerWidth,
      innerHeight,
      innerRadius,
      notches,
    });

    innerWidth = outerWidth + toolGap * 2;
    innerHeight = outerHeight + toolGap * 2;
  }

  return outlines;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function buildNotches(input: {
  outerWidth: number;
  outerHeight: number;
  outerRadius: number;
  innerWidth: number;
  notchSize: number;
  notchInterval: number;
  notchCornerRadius: number;
  toolWidth: number;
}): Notch[] {
  const {
    outerWidth,
    outerHeight,
    outerRadius,
    innerWidth,
    notchSize,
    notchInterval,
    notchCornerRadius,
    toolWidth,
  } = input;

  const size = Math.max(notchSize, toolWidth);
  const interval = Math.max(1, notchInterval);
  const straightHeight = Math.max(0, outerHeight - outerRadius * 2);
  if (straightHeight < size) {
    return [];
  }

  const count = Math.max(1, Math.floor((straightHeight - size) / interval) + 1);
  const used = (count - 1) * interval + size;
  const start = outerRadius + (straightHeight - used) / 2;
  const entranceRadius = Math.max(0, Math.min(size / 2, notchCornerRadius));
  const materialRadius = Math.max(0, Math.min(size / 2, toolWidth / 2));

  const notches: Notch[] = [];

  const innerOffsetX = (outerWidth - innerWidth) / 2;

  for (let index = 0; index < count; index += 1) {
    const centerY = start + size / 2 + index * interval;
    const y = centerY - size / 2;

    const leftX = clamp(innerOffsetX - size, 0, outerWidth - size);
    const rightX = clamp(innerOffsetX + innerWidth, 0, outerWidth - size);

    notches.push({
      x: leftX,
      y,
      size,
      entranceRadius,
      materialRadius,
      side: "left",
    });
    notches.push({
      x: rightX,
      y,
      size,
      entranceRadius,
      materialRadius,
      side: "right",
    });
  }

  return notches;
}

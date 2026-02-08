import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import plywoodEdgeColor from "./assets/plywood-edge/timber-028_edge-multiplex1-smooth-100x18cm-spruce-fresh_d.jpg";
import plywoodEdgeBump from "./assets/plywood-edge/timber-028_edge-multiplex1-smooth-100x18cm_b.png";
import plywoodEdgeNormal from "./assets/plywood-edge/timber-028_edge-multiplex1-smooth-100x18cm_n.png";
import plywoodEdgeRoughness from "./assets/plywood-edge/timber-028_edge-multiplex1-smooth-100x18cm_s.png";
import plywoodColor from "./assets/plywood-surface/timber-025_plywood-spruce3-200x200cm-treated-brown_d.jpg";
import plywoodAo from "./assets/plywood-surface/timber-025_plywood-spruce3-200x200cm_aa.png";
import plywoodBump from "./assets/plywood-surface/timber-025_plywood-spruce3-200x200cm_b.png";
import plywoodNormal from "./assets/plywood-surface/timber-025_plywood-spruce3-200x200cm_n.png";
import plywoodRoughness from "./assets/plywood-surface/timber-025_plywood-spruce3-200x200cm_s.png";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  buildShelfParts,
  layoutSheets,
  type Outline,
  type PartPlacement,
} from "./lib/geometry";

function App() {
  const [plywoodWidth, setPlywoodWidth] = useState(1220);
  const [plywoodLength, setPlywoodLength] = useState(2440);
  const [plywoodDepth, setPlywoodDepth] = useState(18);
  const [minShelfWidth, setMinShelfWidth] = useState(109);
  const [minShelfHeight, setMinShelfHeight] = useState(109);
  const [borderThickness, setBorderThickness] = useState(30);
  const [radiusPercent, setRadiusPercent] = useState(15);
  const [toolGap, setToolGap] = useState(6);
  const [middleCount, setMiddleCount] = useState(6);
  const [shelfCount, setShelfCount] = useState(7);
  const [notchSize, setNotchSize] = useState(8);
  const [notchInterval, setNotchInterval] = useState(20);
  const [notchCornerRadius, setNotchCornerRadius] = useState(1);
  const [activeShelf, setActiveShelf] = useState<"all" | number>("all");

  const totalShelfDepth = useMemo(() => {
    return plywoodDepth * (2 + middleCount);
  }, [plywoodDepth, middleCount]);

  const sheets = useMemo(() => {
    const parts = buildShelfParts({
      shelfCount,
      middleCount,
      minInnerWidth: minShelfWidth,
      minInnerHeight: minShelfHeight,
      borderThickness,
      toolGap,
      radiusPercent,
      notchSize,
      notchInterval,
      notchCornerRadius,
    });

    return layoutSheets({
      parts,
      sheetWidth: plywoodWidth,
      sheetHeight: plywoodLength,
      gap: toolGap,
    });
  }, [
    shelfCount,
    middleCount,
    minShelfWidth,
    minShelfHeight,
    borderThickness,
    toolGap,
    radiusPercent,
    notchSize,
    notchInterval,
    notchCornerRadius,
    plywoodWidth,
    plywoodLength,
  ]);

  const outlineSet = useMemo(() => {
    const parts = buildShelfParts({
      shelfCount,
      middleCount,
      minInnerWidth: minShelfWidth,
      minInnerHeight: minShelfHeight,
      borderThickness,
      toolGap,
      radiusPercent,
      notchSize,
      notchInterval,
      notchCornerRadius,
    });

    return parts[0]?.outlines ?? [];
  }, [
    shelfCount,
    middleCount,
    minShelfWidth,
    minShelfHeight,
    borderThickness,
    toolGap,
    radiusPercent,
    notchSize,
    notchInterval,
    notchCornerRadius,
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <Sidebar variant="inset">
          <SidebarHeader className="gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Shelf Planner</div>
                <div className="text-xs text-muted-foreground">
                  Inputs and constraints
                </div>
              </div>
              <SidebarTrigger />
            </div>
            <SidebarSeparator />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Plywood</SidebarGroupLabel>
              <SidebarGroupContent className="grid gap-3">
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Width (mm)
                  <Input
                    type="number"
                    min={1}
                    value={plywoodWidth}
                    onChange={(event) =>
                      setPlywoodWidth(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Length (mm)
                  <Input
                    type="number"
                    min={1}
                    value={plywoodLength}
                    onChange={(event) =>
                      setPlywoodLength(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Depth (mm)
                  <Input
                    type="number"
                    min={1}
                    value={plywoodDepth}
                    onChange={(event) =>
                      setPlywoodDepth(Number(event.target.value))
                    }
                  />
                </label>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Minimum Shelf Size</SidebarGroupLabel>
              <SidebarGroupContent className="grid gap-3">
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Internal width (mm)
                  <Input
                    type="number"
                    min={1}
                    value={minShelfWidth}
                    onChange={(event) =>
                      setMinShelfWidth(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Internal height (mm)
                  <Input
                    type="number"
                    min={1}
                    value={minShelfHeight}
                    onChange={(event) =>
                      setMinShelfHeight(Number(event.target.value))
                    }
                  />
                </label>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Structure</SidebarGroupLabel>
              <SidebarGroupContent className="grid gap-3">
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Nested shelves
                  <Input
                    type="number"
                    min={1}
                    value={shelfCount}
                    onChange={(event) =>
                      setShelfCount(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Tool gap (mm)
                  <Input
                    type="number"
                    min={0}
                    value={toolGap}
                    onChange={(event) => setToolGap(Number(event.target.value))}
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Notch size (mm)
                  <Input
                    type="number"
                    min={1}
                    value={notchSize}
                    onChange={(event) =>
                      setNotchSize(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Notch interval (mm)
                  <Input
                    type="number"
                    min={1}
                    value={notchInterval}
                    onChange={(event) =>
                      setNotchInterval(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Notch corner radius (mm)
                  <Input
                    type="number"
                    min={0}
                    value={notchCornerRadius}
                    onChange={(event) =>
                      setNotchCornerRadius(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Border thickness (mm)
                  <Input
                    type="number"
                    min={1}
                    value={borderThickness}
                    onChange={(event) =>
                      setBorderThickness(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Corner radius (%)
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    value={radiusPercent}
                    onChange={(event) =>
                      setRadiusPercent(Number(event.target.value))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Middle pieces
                  <Input
                    type="number"
                    min={0}
                    value={middleCount}
                    onChange={(event) =>
                      setMiddleCount(Number(event.target.value))
                    }
                  />
                </label>
                <div className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                  Total shelf depth:{" "}
                  <span className="font-medium text-foreground">
                    {totalShelfDepth} mm
                  </span>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="gap-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Sheet Layout & Preview</h1>
              <p className="text-sm text-muted-foreground">
                Automated nesting with labeled parts. No manual edits.
              </p>
            </div>
          </div>
          <Tabs defaultValue="plywood" className="flex flex-1 flex-col gap-4">
            <TabsList className="self-start">
              <TabsTrigger value="plywood">Plywood Layout</TabsTrigger>
              <TabsTrigger value="model">3D Model</TabsTrigger>
            </TabsList>
            <TabsContent value="plywood" className="m-0">
              <section className="flex flex-1 flex-col gap-3 rounded-xl border bg-card p-4">
                <div className="text-sm font-semibold">Plywood Sheets</div>
                <div className="grid flex-1 gap-4">
                  {sheets.map((sheet, index) => (
                    <SheetPreview
                      key={sheet.id}
                      sheet={sheet}
                      index={index}
                      sheetWidth={plywoodWidth}
                      sheetHeight={plywoodLength}
                    />
                  ))}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="model" className="m-0">
              <section className="h-full flex flex-1 flex-col gap-3 rounded-xl border bg-card p-4">
                <div className="text-sm font-semibold">3D Shelf Preview</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={activeShelf === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveShelf("all")}
                  >
                    All Shelves
                  </Button>
                  {outlineSet.map((_, index) => (
                    <Button
                      key={`shelf-${index}`}
                      type="button"
                      variant={activeShelf === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveShelf(index)}
                    >
                      Shelf {index + 1}
                    </Button>
                  ))}
                </div>
                <div className="flex-grow w-full overflow-hidden rounded-lg border bg-background">
                  <Canvas
                    camera={{
                      position: [0, 0, 600],
                      fov: 35,
                      near: 0.1,
                      far: 10000,
                    }}
                  >
                    <ambientLight intensity={0.2} />
                    <directionalLight
                      position={[200, 300, 200]}
                      intensity={0.9}
                    />
                    <ShelfModel
                      outlines={outlineSet}
                      thickness={plywoodDepth}
                      middleCount={middleCount}
                      activeShelf={activeShelf}
                    />
                    <OrbitControls
                      makeDefault
                      enablePan
                      minDistance={400}
                      maxDistance={5000}
                    />
                    <Environment preset="studio" />
                  </Canvas>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;

function SheetPreview({
  sheet,
  index,
  sheetWidth,
  sheetHeight,
}: {
  sheet: { id: string; placements: PartPlacement[] };
  index: number;
  sheetWidth: number;
  sheetHeight: number;
}) {
  const palette = [
    "#0f172a",
    "#0f766e",
    "#7c3aed",
    "#c2410c",
    "#1d4ed8",
    "#0f766e",
    "#b45309",
    "#4f46e5",
  ];

  const roundedRectPath = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    return [
      `M ${x + r} ${y}`,
      `H ${x + width - r}`,
      `A ${r} ${r} 0 0 1 ${x + width} ${y + r}`,
      `V ${y + height - r}`,
      `A ${r} ${r} 0 0 1 ${x + width - r} ${y + height}`,
      `H ${x + r}`,
      `A ${r} ${r} 0 0 1 ${x} ${y + height - r}`,
      `V ${y + r}`,
      `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
      "Z",
    ].join(" ");
  };

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Sheet {index + 1}</span>
        <span>
          {sheetWidth} × {sheetHeight} mm
        </span>
      </div>
      <div className="w-full overflow-hidden rounded-md border bg-white">
        <svg
          viewBox={`0 0 ${sheetWidth} ${sheetHeight}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            x={0}
            y={0}
            width={sheetWidth}
            height={sheetHeight}
            fill="#f8fafc"
            stroke="#cbd5f5"
            strokeWidth={2}
          />
          {sheet.placements.map((placement) => (
            <g key={placement.id}>
              {placement.outlines.map((outline, outlineIndex) => {
                const color = palette[outlineIndex % palette.length];
                const offsetX =
                  placement.x + (placement.width - outline.outerWidth) / 2;
                const offsetY =
                  placement.y + (placement.height - outline.outerHeight) / 2;
                const innerOffsetX =
                  placement.x + (placement.width - outline.innerWidth) / 2;
                const innerOffsetY =
                  placement.y + (placement.height - outline.innerHeight) / 2;
                const isMiddle = placement.partType === "middle";

                return (
                  <g key={`${placement.id}-${outlineIndex}`}>
                    <path
                      d={`${roundedRectPath(
                        offsetX,
                        offsetY,
                        outline.outerWidth,
                        outline.outerHeight,
                        outline.outerRadius,
                      )} ${roundedRectPath(
                        innerOffsetX,
                        innerOffsetY,
                        outline.innerWidth,
                        outline.innerHeight,
                        outline.innerRadius,
                      )}`}
                      fill={color}
                      fillOpacity={0.18}
                      fillRule="evenodd"
                    />
                    {isMiddle ? (
                      <path
                        d={buildNotchCutoutPath(placement, outline)}
                        fill="#f8fafc"
                      />
                    ) : null}
                  </g>
                );
              })}
              <text
                x={placement.x + 6}
                y={placement.y + 16}
                fontSize="12"
                fill="#111827"
              >
                {placement.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function ShelfModel({
  outlines,
  thickness,
  middleCount,
  activeShelf,
}: {
  outlines: Outline[];
  thickness: number;
  middleCount: number;
  activeShelf: "all" | number;
}) {
  const surfaceTextures = useTexture({
    map: plywoodColor,
    aoMap: plywoodAo,
    normalMap: plywoodNormal,
    roughnessMap: plywoodRoughness,
    bumpMap: plywoodBump,
  });

  const edgeTextures = useTexture({
    map: plywoodEdgeColor,
    normalMap: plywoodEdgeNormal,
    roughnessMap: plywoodEdgeRoughness,
    bumpMap: plywoodEdgeBump,
  });

  edgeTextures.map.repeat.set(thickness / 100, thickness / 100);
  edgeTextures.normalMap.repeat.set(thickness / 100, thickness / 100);
  edgeTextures.roughnessMap.repeat.set(thickness / 100, thickness / 100);
  edgeTextures.bumpMap.repeat.set(thickness / 100, thickness / 100);

  const geometries = useMemo(
    () =>
      outlines.map((outline) => {
        const shape = buildShelfShape(outline);
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: thickness,
          bevelEnabled: false,
          UVGenerator: createUVGenerator(outline, thickness),
        });
        if (geometry.attributes.uv) {
          geometry.setAttribute("uv2", geometry.attributes.uv.clone());
        }
        geometry.computeVertexNormals();
        return geometry;
      }),
    [outlines, thickness],
  );

  const stackCount = Math.max(2, 2 + middleCount);
  const shelfIndices =
    activeShelf === "all" ? outlines.map((_, index) => index) : [activeShelf];

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {shelfIndices.map((shelfIndex) => {
        const geometry = geometries[shelfIndex];
        const outline = outlines[shelfIndex];
        const xOffset =
          activeShelf === "all" ? shelfIndex * (outline.outerWidth + 40) : 0;

        const layers = [];
        for (let layerIndex = 0; layerIndex < stackCount; layerIndex += 1) {
          layers.push(
            <mesh
              key={`shelf-${shelfIndex}-layer-${layerIndex}`}
              geometry={geometry}
              position={[xOffset, 0, layerIndex * thickness]}
            >
              <meshStandardMaterial attach="material-0" {...surfaceTextures} />
              <meshStandardMaterial attach="material-1" {...edgeTextures} />
            </mesh>,
          );
        }

        return <group key={`shelf-${shelfIndex}`}>{layers}</group>;
      })}
    </group>
  );
}

function buildShelfShape(outline: Outline) {
  const shape = new THREE.Shape();
  const width = outline.outerWidth;
  const height = outline.outerHeight;
  const radius = Math.min(outline.outerRadius, width / 2, height / 2);

  shape.moveTo(radius, 0);
  shape.lineTo(width - radius, 0);
  shape.absarc(width - radius, radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(width, height - radius);
  shape.absarc(width - radius, height - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(radius, height);
  shape.absarc(radius, height - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(0, radius);
  shape.absarc(radius, radius, radius, Math.PI, (3 * Math.PI) / 2, false);

  const hole = new THREE.Path();
  const innerWidth = outline.innerWidth;
  const innerHeight = outline.innerHeight;
  const innerRadius = Math.min(
    outline.innerRadius,
    innerWidth / 2,
    innerHeight / 2,
  );
  const innerX = (width - innerWidth) / 2;
  const innerY = (height - innerHeight) / 2;

  hole.moveTo(innerX + innerRadius, innerY);
  hole.lineTo(innerX + innerWidth - innerRadius, innerY);
  hole.absarc(
    innerX + innerWidth - innerRadius,
    innerY + innerRadius,
    innerRadius,
    -Math.PI / 2,
    0,
    false,
  );
  hole.lineTo(innerX + innerWidth, innerY + innerHeight - innerRadius);
  hole.absarc(
    innerX + innerWidth - innerRadius,
    innerY + innerHeight - innerRadius,
    innerRadius,
    0,
    Math.PI / 2,
    false,
  );
  hole.lineTo(innerX + innerRadius, innerY + innerHeight);
  hole.absarc(
    innerX + innerRadius,
    innerY + innerHeight - innerRadius,
    innerRadius,
    Math.PI / 2,
    Math.PI,
    false,
  );
  hole.lineTo(innerX, innerY + innerRadius);
  hole.absarc(
    innerX + innerRadius,
    innerY + innerRadius,
    innerRadius,
    Math.PI,
    (3 * Math.PI) / 2,
    false,
  );

  shape.holes.push(hole);
  return shape;
}

function createUVGenerator(outline: Outline, depth: number) {
  const width = Math.max(1, outline.outerWidth);
  const height = Math.max(1, outline.outerHeight);
  const depthSafe = Math.max(1, depth);

  return {
    generateTopUV: (
      _geometry: THREE.BufferGeometry,
      vertices: number[],
      indexA: number,
      indexB: number,
      indexC: number,
    ) => {
      const ax = vertices[indexA * 3];
      const ay = vertices[indexA * 3 + 1];
      const bx = vertices[indexB * 3];
      const by = vertices[indexB * 3 + 1];
      const cx = vertices[indexC * 3];
      const cy = vertices[indexC * 3 + 1];

      return [
        new THREE.Vector2(ax / width, ay / height),
        new THREE.Vector2(bx / width, by / height),
        new THREE.Vector2(cx / width, cy / height),
      ];
    },
    generateSideWallUV: (
      _geometry: THREE.BufferGeometry,
      vertices: number[],
      indexA: number,
      indexB: number,
      indexC: number,
      indexD: number,
    ) => {
      const ax = vertices[indexA * 3];
      const ay = vertices[indexA * 3 + 1];
      const az = vertices[indexA * 3 + 2];
      const bx = vertices[indexB * 3];
      const by = vertices[indexB * 3 + 1];
      const bz = vertices[indexB * 3 + 2];
      const cx = vertices[indexC * 3];
      const cy = vertices[indexC * 3 + 1];
      const cz = vertices[indexC * 3 + 2];
      const dx = vertices[indexD * 3];
      const dy = vertices[indexD * 3 + 1];
      const dz = vertices[indexD * 3 + 2];

      const isHorizontal = Math.abs(ax - bx) > Math.abs(ay - by);
      if (isHorizontal) {
        return [
          new THREE.Vector2(ax / width, az / depthSafe),
          new THREE.Vector2(bx / width, bz / depthSafe),
          new THREE.Vector2(cx / width, cz / depthSafe),
          new THREE.Vector2(dx / width, dz / depthSafe),
        ];
      }

      return [
        new THREE.Vector2(ay / height, az / depthSafe),
        new THREE.Vector2(by / height, bz / depthSafe),
        new THREE.Vector2(cy / height, cz / depthSafe),
        new THREE.Vector2(dy / height, dz / depthSafe),
      ];
    },
  };
}

function buildNotchCutoutPath(placement: PartPlacement, outline: Outline) {
  if (!outline.notches.length) {
    return "";
  }

  const offsetX = placement.x + (placement.width - outline.outerWidth) / 2;
  const offsetY = placement.y + (placement.height - outline.outerHeight) / 2;

  return outline.notches
    .map((notch) => {
      const x = offsetX + notch.x;
      const y = offsetY + notch.y;
      const size = notch.size;
      const rMaterial = Math.max(0, Math.min(notch.materialRadius, size / 2));

      if (notch.side === "left") {
        return [
          `M ${x + rMaterial} ${y}`,
          `H ${x + size}`,
          `V ${y + size}`,
          `H ${x + rMaterial}`,
          `A ${rMaterial} ${rMaterial} 0 0 1 ${x} ${y + size - rMaterial}`,
          `V ${y + rMaterial}`,
          `A ${rMaterial} ${rMaterial} 0 0 1 ${x + rMaterial} ${y}`,
          "Z",
        ].join(" ");
      }

      return [
        `M ${x} ${y}`,
        `H ${x + size - rMaterial}`,
        `A ${rMaterial} ${rMaterial} 0 0 1 ${x + size} ${y + rMaterial}`,
        `V ${y + size - rMaterial}`,
        `A ${rMaterial} ${rMaterial} 0 0 1 ${x + size - rMaterial} ${y + size}`,
        `H ${x}`,
        "Z",
      ].join(" ");
    })
    .join(" ");
}

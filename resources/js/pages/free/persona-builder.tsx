import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import html2canvas from 'html2canvas';
import { GridStack, type GridStackOptions } from 'gridstack';
import 'gridstack/dist/gridstack.css';
import {
    Download,
    FileDown,
    FileUp,
    Plus,
    Printer,
    RotateCcw,
    Upload,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type SerializedItem = {
    x: number;
    y: number;
    w: number;
    h: number;
    content: string;
};

type ExportPayload = {
    version: 1;
    personaName: string;
    theme: {
        bgColor: string;
        columnColor: string;
        titleColor: string;
        titleSize: number;
        textColor: string;
        textSize: number;
        radius: number;
        padding: number;
        shadow: number;
        borderOn: boolean;
        borderColor: string;
        borderWidth: number;
        titleWeight: number;
        titleAlign: 'left' | 'center' | 'right';
        lineHeight: number;
        imgMaxWidth: number;
    };
    items: SerializedItem[];
};

export default function FreePersonaBuilder() {
    const [personaName, setPersonaName] = useState('');

    // Optional: allow the user to write a manual "notes"/description (no AI)
    const [notes, setNotes] = useState('');

    // Base theme
    const [bgColor, setBgColor] = useState('#dfe4fd');
    const [columnColor, setColumnColor] = useState('#000000ff');
    const [titleColor, setTitleColor] = useState('#ffffff');
    const [titleSize, setTitleSize] = useState(15);
    const [textColor, setTextColor] = useState('#ffffff');
    const [textSize, setTextSize] = useState(16);

    // Advanced styling controls
    const [radius, setRadius] = useState(8);
    const [padding, setPadding] = useState(12);
    const [shadow, setShadow] = useState(8);
    const [borderOn, setBorderOn] = useState(false);
    const [borderColor, setBorderColor] = useState('#4b5563');
    const [borderWidth, setBorderWidth] = useState(0);
    const [titleWeight, setTitleWeight] = useState(600);
    const [titleAlign, setTitleAlign] = useState<'left' | 'center' | 'right'>(
        'left',
    );
    const [lineHeight, setLineHeight] = useState(1.4);
    const [imgMaxWidth, setImgMaxWidth] = useState(100);

    const [showSettings, setShowSettings] = useState(true);

    // GridStack refs
    const gridRef = useRef<HTMLDivElement>(null);
    const gridInstanceRef = useRef<GridStack | null>(null);
    const dataRef = useRef<SerializedItem[]>([]);
    const avatarElRef = useRef<HTMLElement | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);

    const gridContainerStyle = useMemo(
        () => ({ backgroundColor: bgColor }),
        [bgColor],
    );

    // ----- Reflow queue (avoids thrashing) -----
    const reflowRaf = useRef<number | null>(null);
    const queueReflow = () => {
        if (reflowRaf.current) cancelAnimationFrame(reflowRaf.current);
        reflowRaf.current = requestAnimationFrame(() => {
            reflowGridRowAligned();
            reflowRaf.current = null;
        });
    };

    // -------------------------
    // INIT GRIDSTACK
    // -------------------------
    useEffect(() => {
        if (!gridRef.current || gridInstanceRef.current) return;

        const opts: GridStackOptions = {
            column: 4,
            cellHeight: 90,
            margin: 6,
        };

        const grid = GridStack.init(opts, gridRef.current);
        gridInstanceRef.current = grid;

        function updateSerialized() {
            const nodes = grid.engine.nodes ?? [];
            dataRef.current = nodes.map((n: any) => ({
                x: n.x ?? 0,
                y: n.y ?? 0,
                w: n.w ?? 2,
                h: n.h ?? 3,
                content:
                    (n.el?.querySelector('.grid-stack-item-content') as HTMLElement)
                        ?.innerHTML ?? '',
            }));
        }

        grid.on('change', updateSerialized);
        grid.on('added', updateSerialized);
        grid.on('removed', updateSerialized);

        const onInput = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!target?.closest('.grid-stack-item-content')) return;
            updateSerialized();
            applyLiveStyles();
            queueReflow();
        };
        gridRef.current.addEventListener('input', onInput);

        const onClick = (e: Event) => {
            const el = e.target as HTMLElement;
            if (!el?.matches?.('.delete-btn')) return;
            const item = el.closest('.grid-stack-item') as HTMLElement | null;
            if (!item) return;
            grid.removeWidget(item);
            if (avatarElRef.current === item) avatarElRef.current = null;
            updateSerialized();
            queueReflow();
        };
        gridRef.current.addEventListener('click', onClick);

        const onAnyImageLoad = (e: Event) => {
            const target = e.target as HTMLElement | null;
            if (!(target && target.tagName === 'IMG')) return;
            const item = target.closest('.grid-stack-item') as HTMLElement | null;
            if (item?.dataset.type === 'avatar') return;
            queueReflow();
        };
        gridRef.current.addEventListener('load', onAnyImageLoad, true);

        // seed a few default columns
        createNewColumn('Name', '');
        createNewColumn('Bio', '');
        createNewColumn('Goals', '');
        queueReflow();

        return () => {
            try {
                gridRef.current?.removeEventListener('input', onInput);
                gridRef.current?.removeEventListener('click', onClick);
                gridRef.current?.removeEventListener('load', onAnyImageLoad, true);
                grid.destroy(false);
            } catch {}
            gridInstanceRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Apply all live styles
    const applyLiveStyles = () => {
        const root = gridRef.current;
        if (!root) return;

        root.style.backgroundColor = bgColor;

        root.querySelectorAll<HTMLElement>('.grid-stack-item-content').forEach(
            (el) => {
                el.style.backgroundColor = columnColor;
                el.style.color = textColor;
                el.style.borderRadius = `${radius}px`;
                el.style.padding = `${padding}px`;
                el.style.boxShadow =
                    shadow > 0
                        ? `0 2px ${Math.max(6, shadow)}px rgba(0,0,0,0.18)`
                        : 'none';
                el.style.border = borderOn
                    ? `${borderWidth}px solid ${borderColor}`
                    : 'none';
            },
        );

        root.querySelectorAll<HTMLElement>('.grid-title').forEach((el) => {
            el.style.color = titleColor;
            el.style.fontSize = `${titleSize}px`;
            el.style.fontWeight = String(titleWeight);
            el.style.textAlign = titleAlign;
            el.style.marginBottom = '4px';
        });

        root.querySelectorAll<HTMLElement>('.grid-content-desc').forEach((el) => {
            el.style.color = textColor;
            el.style.fontSize = `${textSize}px`;
            el.style.lineHeight = String(lineHeight);
            (el.style as any).textAlign = titleAlign;
        });

        root.querySelectorAll<HTMLImageElement>('.grid-content-desc img').forEach(
            (img) => {
                img.style.maxWidth = `${imgMaxWidth}%`;
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = titleAlign === 'left' ? '0' : '0 auto';
                img.style.borderRadius = `${Math.max(0, radius - 2)}px`;
            },
        );
    };

    useEffect(() => {
        applyLiveStyles();
    }, [
        bgColor,
        columnColor,
        titleColor,
        titleSize,
        textColor,
        textSize,
        radius,
        padding,
        shadow,
        borderOn,
        borderColor,
        borderWidth,
        titleWeight,
        titleAlign,
        lineHeight,
        imgMaxWidth,
    ]);

    useEffect(() => {
        queueReflow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [padding, titleSize, textSize, lineHeight, imgMaxWidth]);

    useEffect(() => {
        if (!avatarElRef.current || !gridInstanceRef.current) return;
        updateAvatarHeight(avatarElRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [padding, titleSize, textSize, lineHeight, imgMaxWidth, titleAlign, radius]);

    useEffect(() => {
        if (!gridInstanceRef.current) return;
        gridInstanceRef.current.compact();
        queueReflow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSettings]);

    function addGridItem(
        htmlInner: string,
        pos?: { x?: number; y?: number; w?: number; h?: number },
    ) {
        const size = pos ?? { x: 0, y: 1, w: 2, h: 2 };
        const el = document.createElement('div');
        el.classList.add('grid-stack-item');
        el.innerHTML = `
      <div class="grid-stack-item-content"
          style="border-radius:${radius}px;box-shadow:rgba(99,99,99,0.2) 0px 2px 8px;padding:${padding}px;">
        ${htmlInner}
      </div>
    `.trim();

        gridInstanceRef.current?.makeWidget(el, size);
        applyLiveStyles();
    }

    function createNewColumn(title: string, content: string) {
        const htmlInner = `
      <div contenteditable="true" class="grid-title">${escapeHtml(
          title,
      )}</div>
      <div class="grid-content-desc mt-2" contenteditable="true">${escapeHtml(
          content,
      )}</div>
      <button class="delete-btn" style="
        position:absolute;top:6px;right:6px;
        background:#ef4444;color:#fff;border:none;
        width:22px;height:22px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;">X</button>
    `.trim();

        addGridItem(htmlInner, { x: 0, y: 0, w: 2, h: 3 });
        queueReflow();
    }

    function createAvatarColumn(imgDataUrl: string) {
        const htmlInner = `
      <div class="grid-title" contenteditable="true">Avatar</div>
      <div class="grid-content-desc mt-2" contenteditable="false">
        <img src="${imgDataUrl}" alt="persona avatar"
             style="max-width:100%;height:auto;display:block;border-radius:${Math.max(
                 0,
                 radius - 2,
             )}px" />
      </div>
      <button class="delete-btn" style="
        position:absolute;top:6px;right:6px;
        background:#ef4444;color:#fff;border:none;
        width:22px;height:22px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;">X</button>
    `.trim();

        const el = document.createElement('div');
        el.classList.add('grid-stack-item');
        el.dataset.type = 'avatar';
        el.innerHTML = `
      <div class="grid-stack-item-content"
           style="border-radius:${radius}px;box-shadow:rgba(99,99,99,0.2) 0px 2px 8px;padding:${padding}px;">
        ${htmlInner}
      </div>
    `;

        const size = { x: 0, y: 0, w: 2, h: 3 };
        gridInstanceRef.current?.makeWidget(el, size);
        applyLiveStyles();

        avatarElRef.current = el;

        const img = el.querySelector('img') as HTMLImageElement | null;
        if (img) {
            if (img.complete) updateAvatarHeight(el);
            else
                img.addEventListener('load', () => updateAvatarHeight(el), {
                    once: true,
                });
        }
        queueReflow();
    }

    function updateAvatarHeight(el: HTMLElement) {
        const grid = gridInstanceRef.current as any;
        if (!grid) return;
        const inner =
            (el.querySelector('.grid-stack-item-content') as HTMLElement)
                ?.innerHTML ?? '';
        const node = grid.engine?.nodes?.find((n: any) => n.el === el);
        const currentW = node?.w ?? 2;
        const { h } = measureHeightForCols(inner, currentW);
        grid.update(el, { h });
    }

    function measureHeightForCols(htmlInner: string, colsWanted: number) {
        const gridEl = gridRef.current;
        const grid = gridInstanceRef.current as any;
        const cols = grid?.engine?.column ?? 4;
        const cellHeight =
            (typeof grid?.cellHeight === 'number' && grid.cellHeight) ||
            grid?.getCellHeight?.() ||
            90;

        const gridWidth = (gridEl?.clientWidth ?? 800) - 16;
        const colWidth = Math.max(60, gridWidth / cols);

        const probe = document.createElement('div');
        probe.style.position = 'absolute';
        probe.style.visibility = 'hidden';
        probe.style.left = '-9999px';
        probe.style.top = '-9999px';
        probe.style.width = `${Math.ceil(colsWanted * colWidth)}px`;
        probe.innerHTML = `
      <div class="grid-stack-item-content" style="position:relative;border-radius:${radius}px;box-shadow:rgba(99,99,99,0.2) 0px 2px 8px;padding:${padding}px;">
        ${htmlInner}
      </div>
    `;
        document.body.appendChild(probe);

        const contentEl = probe.querySelector(
            '.grid-stack-item-content',
        ) as HTMLElement;
        const rect = contentEl.getBoundingClientRect();
        document.body.removeChild(probe);

        const pixels = rect.height;
        const h = Math.max(1, Math.ceil(pixels / cellHeight));
        return { h };
    }

    function reflowGridRowAligned() {
        const grid = gridInstanceRef.current as any;
        if (!grid) return;

        const nodes = [...(grid.engine.nodes ?? [])] as any[];
        if (!nodes.length) return;

        const cellHeight =
            (typeof grid.cellHeight === 'number' && grid.cellHeight) ||
            grid.getCellHeight?.() ||
            90;

        const cols = grid.engine.column ?? 4;

        grid.batchUpdate();

        // Keep order stable
        nodes.sort((a, b) => (a.y - b.y) || (a.x - b.x));

        let x = 0;
        let y = 0;
        let rowMaxH = 0;

        nodes.forEach((node) => {
            const el = node.el as HTMLElement;
            const skip = el?.dataset.type === 'avatar';

            const w = Math.min(node.w ?? 2, cols);

            if (x + w > cols) {
                x = 0;
                y += rowMaxH;
                rowMaxH = 0;
            }

            if (skip) {
                grid.update(el, { x, y, w });
                x += w;
                rowMaxH = Math.max(rowMaxH, node?.h ?? 1);
            } else {
                const inner =
                    (
                        el.querySelector(
                            '.grid-stack-item-content',
                        ) as HTMLElement
                    )?.innerHTML ?? '';

                const h = Math.max(
                    1,
                    Math.ceil(measureHeightForCols(inner, w).h),
                );

                grid.update(el, { x, y, w, h });
                x += w;
                rowMaxH = Math.max(rowMaxH, h);
            }
        });

        grid.commit();
        applyLiveStyles();

        // Keep avatar height synced after repack
        if (avatarElRef.current) updateAvatarHeight(avatarElRef.current);
    }

    const printPersona = async () => {
        const target = gridRef.current;
        if (!target) return;
        const canvas = await html2canvas(target, {
            useCORS: true,
            allowTaint: true,
        });
        const link = document.createElement('a');
        link.download = `${personaName || 'persona'}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    const serialize = (): SerializedItem[] => {
        const grid = gridInstanceRef.current as any;
        if (!grid) return [];
        const nodes = grid.engine.nodes ?? [];
        dataRef.current = nodes.map((n: any) => ({
            x: n.x ?? 0,
            y: n.y ?? 0,
            w: n.w ?? 2,
            h: n.h ?? 3,
            content:
                (n.el?.querySelector('.grid-stack-item-content') as HTMLElement)
                    ?.innerHTML ?? '',
        }));
        return dataRef.current;
    };

    const buildExportPayload = (): ExportPayload => ({
        version: 1,
        personaName,
        theme: {
            bgColor,
            columnColor,
            titleColor,
            titleSize,
            textColor,
            textSize,
            radius,
            padding,
            shadow,
            borderOn,
            borderColor,
            borderWidth,
            titleWeight,
            titleAlign,
            lineHeight,
            imgMaxWidth,
        },
        items: serialize(),
    });

    const exportJson = () => {
        const payload = buildExportPayload();
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${personaName || 'persona'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Exported JSON');
    };

    const importJson = async (file: File) => {
        const text = await file.text();
        const parsed = JSON.parse(text) as ExportPayload;
        if (!parsed?.items || !Array.isArray(parsed.items)) {
            toast.error('Invalid persona JSON');
            return;
        }

        setPersonaName(parsed.personaName ?? '');
        if (parsed.theme) {
            setBgColor(parsed.theme.bgColor ?? bgColor);
            setColumnColor(parsed.theme.columnColor ?? columnColor);
            setTitleColor(parsed.theme.titleColor ?? titleColor);
            setTitleSize(parsed.theme.titleSize ?? titleSize);
            setTextColor(parsed.theme.textColor ?? textColor);
            setTextSize(parsed.theme.textSize ?? textSize);
            setRadius(parsed.theme.radius ?? radius);
            setPadding(parsed.theme.padding ?? padding);
            setShadow(parsed.theme.shadow ?? shadow);
            setBorderOn(parsed.theme.borderOn ?? borderOn);
            setBorderColor(parsed.theme.borderColor ?? borderColor);
            setBorderWidth(parsed.theme.borderWidth ?? borderWidth);
            setTitleWeight(parsed.theme.titleWeight ?? titleWeight);
            setTitleAlign(parsed.theme.titleAlign ?? titleAlign);
            setLineHeight(parsed.theme.lineHeight ?? lineHeight);
            setImgMaxWidth(parsed.theme.imgMaxWidth ?? imgMaxWidth);
        }

        const grid = gridInstanceRef.current;
        if (!grid) return;

        grid.removeAll();
        avatarElRef.current = null;

        // Restore serialized HTML blocks as-is
        parsed.items.forEach((it) => {
            const el = document.createElement('div');
            el.classList.add('grid-stack-item');
            el.innerHTML = it.content;
            grid.makeWidget(el, { x: it.x, y: it.y, w: it.w, h: it.h });
        });

        applyLiveStyles();
        queueReflow();
        toast.success('Imported JSON');
    };

    const onPickAvatar = () => {
        fileInputRef.current?.click();
    };

    const onReset = () => {
        const grid = gridInstanceRef.current;
        if (!grid) return;
        grid.removeAll();
        avatarElRef.current = null;
        setPersonaName('');
        setNotes('');
        createNewColumn('Name', '');
        createNewColumn('Bio', '');
        createNewColumn('Goals', '');
        applyLiveStyles();
        queueReflow();
        toast.success('Reset');
    };

    return (
        <>
            <Navbar />
            <main className="xs:pt-20 px-6 pt-16 sm:pt-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold">
                            Free Persona Builder
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create and export a persona manually. No account
                            required.
                        </p>
                    </div>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                Persona details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="pname">Title</Label>
                                    <Input
                                        id="pname"
                                        value={personaName}
                                        onChange={(e) =>
                                            setPersonaName(e.target.value)
                                        }
                                        placeholder="Persona name…"
                                    />
                                </div>
                                <div>
                                    <Label>Actions</Label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                createNewColumn(
                                                    'New Section',
                                                    '',
                                                )
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Card
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onPickAvatar}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Add Avatar
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={printPersona}
                                        >
                                            <Printer className="mr-2 h-4 w-4" />
                                            Export PNG
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={exportJson}
                                        >
                                            <FileDown className="mr-2 h-4 w-4" />
                                            Export JSON
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                importInputRef.current?.click()
                                            }
                                        >
                                            <FileUp className="mr-2 h-4 w-4" />
                                            Import JSON
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={onReset}
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes (optional)</Label>
                                <Textarea
                                    id="notes"
                                    rows={4}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any extra notes (these are not stored anywhere unless you export JSON)."
                                />
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        const url = String(reader.result || '');
                                        if (!url) return;
                                        createAvatarColumn(url);
                                    };
                                    reader.readAsDataURL(f);
                                    e.currentTarget.value = '';
                                }}
                            />

                            <input
                                ref={importInputRef}
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    importJson(f);
                                    e.currentTarget.value = '';
                                }}
                            />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                        {showSettings && (
                            <div className="md:col-span-3">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">
                                            Styling
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">
                                                Show settings
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setShowSettings(false)
                                                }
                                            >
                                                Hide
                                            </Button>
                                        </div>

                                        <div>
                                            <Label htmlFor="bg">Background</Label>
                                            <Input
                                                id="bg"
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) =>
                                                    setBgColor(e.target.value)
                                                }
                                                className="h-9 p-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="col">Card</Label>
                                            <Input
                                                id="col"
                                                type="color"
                                                value={columnColor}
                                                onChange={(e) =>
                                                    setColumnColor(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-9 p-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="tcol">Title</Label>
                                            <Input
                                                id="tcol"
                                                type="color"
                                                value={titleColor}
                                                onChange={(e) =>
                                                    setTitleColor(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-9 p-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="txcol">Text</Label>
                                            <Input
                                                id="txcol"
                                                type="color"
                                                value={textColor}
                                                onChange={(e) =>
                                                    setTextColor(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-9 p-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="radius">Radius</Label>
                                            <Input
                                                id="radius"
                                                type="number"
                                                value={radius}
                                                onChange={(e) =>
                                                    setRadius(
                                                        parseInt(
                                                            e.target.value ||
                                                                '0',
                                                            10,
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="pad">Padding</Label>
                                            <Input
                                                id="pad"
                                                type="number"
                                                value={padding}
                                                onChange={(e) =>
                                                    setPadding(
                                                        parseInt(
                                                            e.target.value ||
                                                                '0',
                                                            10,
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="shadow">Shadow</Label>
                                            <Input
                                                id="shadow"
                                                type="number"
                                                value={shadow}
                                                onChange={(e) =>
                                                    setShadow(
                                                        parseInt(
                                                            e.target.value ||
                                                                '0',
                                                            10,
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">
                                                Border
                                            </Label>
                                            <input
                                                type="checkbox"
                                                checked={borderOn}
                                                onChange={(e) =>
                                                    setBorderOn(
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                        </div>

                                        {borderOn && (
                                            <>
                                                <div>
                                                    <Label htmlFor="bcol">
                                                        Border color
                                                    </Label>
                                                    <Input
                                                        id="bcol"
                                                        type="color"
                                                        value={borderColor}
                                                        onChange={(e) =>
                                                            setBorderColor(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-9 p-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="bwid">
                                                        Border width
                                                    </Label>
                                                    <Input
                                                        id="bwid"
                                                        type="number"
                                                        value={borderWidth}
                                                        onChange={(e) =>
                                                            setBorderWidth(
                                                                parseInt(
                                                                    e.target
                                                                        .value ||
                                                                        '0',
                                                                    10,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {!showSettings && (
                            <div className="md:col-span-12">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowSettings(true)}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Show Settings
                                </Button>
                            </div>
                        )}

                        <div
                            className={
                                showSettings ? 'md:col-span-9' : 'md:col-span-12'
                            }
                        >
                            <div
                                ref={gridRef}
                                className="grid-stack rounded-md p-2"
                                style={gridContainerStyle as React.CSSProperties}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function escapeHtml(value: string) {
    return (value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

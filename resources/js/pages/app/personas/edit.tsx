import type { MultiSelectOption } from '@/components/multi-select';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { GridStack, type GridStackOptions } from 'gridstack';
import 'gridstack/dist/gridstack.css';
import html2canvas from 'html2canvas';
import { Printer, Save, Settings2 } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PersonaFigmaExport } from './PersonaFigmaExport';

type SerializedItem =
 {
    x: number;
    y: number;
    w: number;
    h: number;
    content: string;
};
type PersonaCategory = { id: number; name: string };
type PersonaPayload = {
    id: string | number;
    data: SerializedItem[];
    settings: Record<string, string>;
    image?: string | null;
    prompt?: string | null;
    name?: string | null;
    categories?: PersonaCategory[];
};
type CategoryLite = { id: number; name: string; color?: string | null };

type PageProps = {
    persona: PersonaPayload;
    flash?: { status?: string; error?: string };
    categories: CategoryLite[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/' },
    { title: 'Personas', href: '/app/personas' },
    { title: 'Edit', href: '#' },
];

export default function PersonaEditPage() {
    const { props } = usePage<PageProps>();
    const persona = props.persona;

    console.log('Persona data:', persona);

    // Editor section
    const [personaName, setPersonaName] = useState(persona.name ?? '');

    const initialCategoryIds = React.useMemo(
        () => (persona.categories ?? []).map((c) => String(c.id)),
        [persona.categories],
    );
    const [categoryIds, setCategoryIds] =
        useState<string[]>(initialCategoryIds);

    useEffect(() => {
        setCategoryIds(initialCategoryIds);
    }, [initialCategoryIds]);

    const categoryOptions = React.useMemo<MultiSelectOption[]>(
        () =>
            (props.categories ?? []).map((c) => ({
                label: c.name,
                value: String(c.id),
                // optional: show color as badge background if provided
                ...(c.color ? { style: { badgeColor: c.color } } : {}),
            })),
        [props.categories],
    );

    // Theme & style (preload from settings; default fallbacks)
    const s = persona.settings || {};
    const [bgColor, setBgColor] = useState(s['background-color'] ?? '#dfe4fd');
    const [columnColor, setColumnColor] = useState(
        s['column-color'] ?? '#000000ff',
    );
    const [titleColor, setTitleColor] = useState(s['title-color'] ?? '#ffffff');
    const [titleSize, setTitleSize] = useState<number>(
        parseInt(s['title-size'] ?? '15', 10),
    );
    const [textColor, setTextColor] = useState(s['text-color'] ?? '#ffffff');
    const [textSize, setTextSize] = useState<number>(
        parseInt(s['text-size'] ?? '16', 10),
    );
    const [radius, setRadius] = useState<number>(
        parseInt(s['radius'] ?? '8', 10),
    );
    const [padding, setPadding] = useState<number>(
        parseInt(s['padding'] ?? '12', 10),
    );
    const [shadow, setShadow] = useState<number>(
        parseInt(s['shadow'] ?? '8', 10),
    );
    const [borderOn, setBorderOn] = useState(
        (s['border-on'] ?? 'false') === 'true',
    );
    const [borderColor, setBorderColor] = useState(
        s['border-color'] ?? '#4b5563',
    );
    const [borderWidth, setBorderWidth] = useState<number>(
        parseInt(s['border-width'] ?? '0', 10),
    );
    const [titleWeight, setTitleWeight] = useState<number>(
        parseInt(s['title-weight'] ?? '600', 10),
    );
    const [titleAlign, setTitleAlign] = useState<'left' | 'center' | 'right'>(
        (s['title-align'] as any) ?? 'left',
    );
    const [lineHeight, setLineHeight] = useState<number>(
        parseFloat(s['line-height'] ?? '1.4'),
    );
    const [imgMaxWidth, setImgMaxWidth] = useState<number>(
        parseInt(s['img-max-width'] ?? '100', 10),
    );
    const [showSettings, setShowSettings] = useState(true);

    // GridStack
    const gridRef = useRef<HTMLDivElement>(null);
    const gridInstanceRef = useRef<GridStack | null>(null);

    // Reflow gate: OFF initially to preserve saved layout
    const reflowEnabledRef = useRef(false);

    // Inertia forms
    const updateForm = useForm<{ data: string }>({ data: '' });

    const gridContainerStyle = useMemo(
        () => ({ backgroundColor: bgColor }),
        [bgColor],
    );

    // Reflow queue (gated)
    const reflowRaf = useRef<number | null>(null);
    const queueReflow = () => {
        if (!reflowEnabledRef.current) return; // gate: no reflow until a user edit
        if (reflowRaf.current) cancelAnimationFrame(reflowRaf.current);
        reflowRaf.current = requestAnimationFrame(() => {
            safeCompact();
            reflowRaf.current = null;
        });
    };

    // Init GridStack
    useEffect(() => {
        if (!gridRef.current || gridInstanceRef.current) return;

        const opts: GridStackOptions = {
            column: 4,
            cellHeight: 90,
            margin: 6,
            float: false, // reduce jitter
            // disableOneColumnMode: true, // optional: keep same layout on small screens
            draggable: { handle: '.grid-stack-item-content' },
            resizable: { handles: 'all' },
        };
        const grid = GridStack.init(opts, gridRef.current);
        gridInstanceRef.current = grid;

        // Any content input enables future reflow
        const onInput = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!target?.closest('.grid-stack-item-content')) return;
            reflowEnabledRef.current = true;
            applyLiveStyles();
            // no compact here (typing should not re-pack)
        };
        gridRef.current.addEventListener('input', onInput);

        // Deleting a card enables future reflow and compacts after
        const onClick = (e: Event) => {
            const el = e.target as HTMLElement;
            if (!el?.matches?.('.delete-btn')) return;
            const item = el.closest('.grid-stack-item') as HTMLElement | null;
            if (!item) return;
            reflowEnabledRef.current = true;
            grid.removeWidget(item);
            safeCompact();
        };
        gridRef.current.addEventListener('click', onClick);

        // Only compact AFTER user stops drag/resize (prevents shaking)
        const onDragStop = () => {
            if (reflowEnabledRef.current) safeCompact();
        };
        const onResizeStop = () => {
            if (reflowEnabledRef.current) safeCompact();
        };
        grid.on('dragstop', onDragStop);
        grid.on('resizestop', onResizeStop);

        // Images: after they load, compact if reflow enabled
        const onAnyImageLoad = (e: Event) => {
            if ((e.target as HTMLElement)?.tagName === 'IMG') queueReflow();
        };
        gridRef.current.addEventListener('load', onAnyImageLoad, true);

        return () => {
            try {
                gridRef.current?.removeEventListener('input', onInput);
                gridRef.current?.removeEventListener('click', onClick);
                gridRef.current?.removeEventListener(
                    'load',
                    onAnyImageLoad,
                    true,
                );

                if (grid && typeof (grid as any).off === 'function') {
                    (grid as any).off('dragstop');
                    (grid as any).off('resizestop');
                }

                grid.destroy(false);
            } catch {}
            gridInstanceRef.current = null;
        };
    }, []);

    // Hydrate grid from server persona data on mount - NO compact here
    useEffect(() => {
        const grid = gridInstanceRef.current;
        if (!grid) return;

        grid.removeAll();

        // If saved data already includes avatar, do NOT add another one.
        (persona.data ?? []).forEach((it) => {
            addGridItem(it.content, { x: it.x, y: it.y, w: it.w, h: it.h });
        });

        applyLiveStyles();
        // IMPORTANT: do NOT compact here — preserve exact saved layout.
        // Reflow becomes enabled only after the first user edit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [persona.id]);

    // Live styles
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

        root.querySelectorAll<HTMLElement>('.grid-content-desc').forEach(
            (el) => {
                el.style.color = textColor;
                el.style.fontSize = `${textSize}px`;
                el.style.lineHeight = String(lineHeight);
                (el.style as any).textAlign = titleAlign;
            },
        );

        root.querySelectorAll<HTMLImageElement>(
            '.grid-content-desc img',
        ).forEach((img) => {
            img.style.maxWidth = `${imgMaxWidth}%`;
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = titleAlign === 'left' ? '0' : '0 auto';
            img.style.borderRadius = `${Math.max(0, radius - 2)}px`;
        });
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

    // Style knobs can trigger compact after first edit; before that, they won’t
    useEffect(() => {
        queueReflow();
    }, [padding, titleSize, textSize, lineHeight, imgMaxWidth, showSettings]);

    function addGridItem(
        htmlInner: string,
        pos?: { x?: number; y?: number; w?: number; h?: number },
    ) {
        const size = { x: 0, y: 0, w: 2, h: 3, ...(pos || {}) };
        const el = document.createElement('div');
        el.classList.add('grid-stack-item');

        // Pre-set exact placement so makeWidget won’t auto-place
        el.setAttribute('gs-x', String(size.x));
        el.setAttribute('gs-y', String(size.y));
        el.setAttribute('gs-w', String(size.w));
        el.setAttribute('gs-h', String(size.h));
        el.setAttribute('gs-auto-position', 'false');

        el.innerHTML = `
      <div class="grid-stack-item-content"
           style="border-radius:${radius}px;box-shadow:rgba(99,99,99,0.2) 0px 2px 8px;padding:${padding}px;">
        ${htmlInner}
      </div>
    `.trim();

        // Keep using makeWidget (addWidget is deprecated)
        gridInstanceRef.current?.makeWidget(el);
    }

    function safeCompact() {
        const grid = gridInstanceRef.current as any;
        if (!grid) return;
        // Use GridStack’s own compacting (stable fill of holes)
        if (typeof grid.compact === 'function') {
            grid.compact();
        }
        applyLiveStyles();
    }

    function serialize(): SerializedItem[] {
        const grid = gridInstanceRef.current as any;
        if (!grid) return [];
        const nodes = grid.engine.nodes ?? [];
        return nodes.map((n: any) => ({
            x: n.x ?? 0,
            y: n.y ?? 0,
            w: n.w ?? 2,
            h: n.h ?? 3,
            content:
                (n.el?.querySelector('.grid-stack-item-content') as HTMLElement)
                    ?.innerHTML ?? '',
        }));
    }

    const savePersona = () => {
        const settings = {
            name: personaName,
            'background-color': bgColor,
            'column-color': columnColor,
            'text-color': textColor,
            'title-color': titleColor,
            'title-size': String(titleSize),
            'text-size': String(textSize),
            radius: String(radius),
            padding: String(padding),
            shadow: String(shadow),
            'border-on': String(borderOn),
            'border-color': borderColor,
            'border-width': String(borderWidth),
            'title-weight': String(titleWeight),
            'title-align': titleAlign,
            'line-height': String(lineHeight),
            'img-max-width': String(imgMaxWidth),
        };

        const body = {
            // data: JSON.stringify(serialize()),
            data: serialize(),
            // settings: JSON.stringify(settings),
            settings: settings,
            prompt: persona.prompt ?? null,
            category_ids: categoryIds.map(Number),
        };

        router.put(
            `/app/personas/${persona.id}`,
            { data: body },
            {
                preserveScroll: true,
                // onError: () => toast.error('Update failed'),
                // onSuccess: () => toast.success('Persona updated'),
            },
        );
    };

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

    const [exportItems, setExportItems] = useState<SerializedItem[]>([]);

    // Update export items whenever grid changes
    const updateExportItems = () => setExportItems(serialize());

    useEffect(() => {
        const grid = gridInstanceRef.current;
        if (!grid) return;

        // Whenever grid is hydrated
        setExportItems(serialize());

        // Listen for changes
        grid.on('change', () => {
            updateExportItems();
        });
    }, [persona.id]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Edit Persona${personaName ? ` – ${personaName}` : ''}`}
            />
            <div className="space-y-6 p-6">
                {/* Top bar: name + actions */}
                <PersonaFigmaExport
                    personaName={personaName}
                    items={exportItems} // from your GridStack instance
                    settings={{
                        backgroundColor: bgColor,
                        columnColor,
                        textColor,
                        titleColor,
                        titleSize,
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
                    }}
                    figmaAccessToken={import.meta.env.VITE_FIGMA_TOKEN!}
                    figmaFileId="JTtrZhwz3ocP2AoVjK1ws3"
                /> 

                <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                    <div className="md:col-span-6">
                        <Label htmlFor="name" className="font-semibold">
                            Title
                        </Label>
                        <Input
                            id="name"
                            placeholder="Persona name…"
                            value={personaName}
                            onChange={(e) => setPersonaName(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <Label className="font-semibold">Categories</Label>
                        <MultiSelect
                            options={categoryOptions}
                            onValueChange={setCategoryIds}
                            defaultValue={categoryIds}
                            placeholder="Select categories…"
                        />
                    </div>
                    <div className="md:col-span-2 flex items-end gap-2">
                        <Button
                            onClick={savePersona}
                            disabled={updateForm.processing}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {updateForm.processing ? 'Saving…' : 'Save'}
                        </Button>
                        <Button variant="secondary" onClick={printPersona}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </div>
                </div>

                {/* Settings + Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                    <div className="md:col-span-12">
                        <Card className="max-w-full">
                            <CardContent className="pt-1">
                                <div className="mb-2 flex items-center justify-between">
                                    <Label className="font-semibold">
                                        Settings
                                    </Label>
                                    <div className="mb-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            type="button"
                                            onClick={() =>
                                                setShowSettings((v) => !v)
                                            }
                                            title="Toggle settings width"
                                        >
                                            <Settings2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Compact, responsive grid: auto-fits items per row without overflow */}
                                {showSettings && (
                                    <div
                                        className="grid gap-1"
                                        style={{
                                            gridTemplateColumns:
                                                'repeat(auto-fill, minmax(160px, 1fr))',
                                        }}
                                    >
                                        {/* THEME */}
                                        <div>
                                            <Label
                                                htmlFor="bg"
                                                className="text-[11px]"
                                            >
                                                Theme - Background
                                            </Label>
                                            <Input
                                                id="bg"
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) =>
                                                    setBgColor(e.target.value)
                                                }
                                                className="h-8 p-1"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="col"
                                                className="text-[11px]"
                                            >
                                                Theme - Column
                                            </Label>
                                            <Input
                                                id="col"
                                                type="color"
                                                value={columnColor}
                                                onChange={(e) =>
                                                    setColumnColor(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8 p-1"
                                            />
                                        </div>

                                        {/* TITLE */}
                                        <div>
                                            <Label
                                                htmlFor="tcol"
                                                className="text-[11px]"
                                            >
                                                Title - Color
                                            </Label>
                                            <Input
                                                id="tcol"
                                                type="color"
                                                value={titleColor}
                                                onChange={(e) =>
                                                    setTitleColor(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8 p-1"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="tsz"
                                                className="text-[11px]"
                                            >
                                                Title - Size
                                            </Label>
                                            <Input
                                                id="tsz"
                                                type="number"
                                                value={titleSize}
                                                onChange={(e) =>
                                                    setTitleSize(
                                                        parseInt(
                                                            e.target.value ||
                                                                '0',
                                                            10,
                                                        ),
                                                    )
                                                }
                                                className="h-8"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="twt"
                                                className="text-[11px]"
                                            >
                                                Title - Weight
                                            </Label>
                                            <select
                                                id="twt"
                                                className="h-8 w-full rounded-md border px-2 text-sm"
                                                value={titleWeight}
                                                onChange={(e) =>
                                                    setTitleWeight(
                                                        parseInt(
                                                            e.target.value,
                                                            10,
                                                        ),
                                                    )
                                                }
                                            >
                                                {[400, 500, 600, 700, 800].map(
                                                    (w) => (
                                                        <option
                                                            key={w}
                                                            value={w}
                                                        >
                                                            {w}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="talign"
                                                className="text-[11px]"
                                            >
                                                Title - Align
                                            </Label>
                                            <select
                                                id="talign"
                                                className="h-8 w-full rounded-md border px-2 text-sm"
                                                value={titleAlign}
                                                onChange={(e) =>
                                                    setTitleAlign(
                                                        e.target.value as any,
                                                    )
                                                }
                                            >
                                                <option value="left">
                                                    Left
                                                </option>
                                                <option value="center">
                                                    Center
                                                </option>
                                                <option value="right">
                                                    Right
                                                </option>
                                            </select>
                                        </div>

                                        {/* TEXT */}
                                        <div>
                                            <Label
                                                htmlFor="txcol"
                                                className="text-[11px]"
                                            >
                                                Text - Color
                                            </Label>
                                            <Input
                                                id="txcol"
                                                type="color"
                                                value={textColor}
                                                onChange={(e) =>
                                                    setTextColor(e.target.value)
                                                }
                                                className="h-8 p-1"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="txsz"
                                                className="text-[11px]"
                                            >
                                                Text - Size
                                            </Label>
                                            <Input
                                                id="txsz"
                                                type="number"
                                                value={textSize}
                                                onChange={(e) =>
                                                    setTextSize(
                                                        parseInt(
                                                            e.target.value ||
                                                                '0',
                                                            10,
                                                        ),
                                                    )
                                                }
                                                className="h-8"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="lh"
                                                className="text-[11px]"
                                            >
                                                Text - Line height
                                            </Label>
                                            <Input
                                                id="lh"
                                                type="number"
                                                step="0.1"
                                                min="1"
                                                max="2"
                                                value={lineHeight}
                                                onChange={(e) =>
                                                    setLineHeight(
                                                        parseFloat(
                                                            e.target.value ||
                                                                '1.4',
                                                        ),
                                                    )
                                                }
                                                className="h-8"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="imgw"
                                                className="text-[11px]"
                                            >
                                                Text - % Img width
                                            </Label>
                                            <Input
                                                id="imgw"
                                                type="number"
                                                min={20}
                                                max={100}
                                                value={imgMaxWidth}
                                                onChange={(e) =>
                                                    setImgMaxWidth(
                                                        Math.max(
                                                            20,
                                                            Math.min(
                                                                100,
                                                                parseInt(
                                                                    e.target
                                                                        .value ||
                                                                        '50',
                                                                    10,
                                                                ),
                                                            ),
                                                        ),
                                                    )
                                                }
                                                className="h-8"
                                            />
                                        </div>

                                        {/* CARDS */}
                                        <div>
                                            <Label
                                                htmlFor="radius"
                                                className="text-[11px]"
                                            >
                                                Cards - Radius
                                            </Label>
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
                                                className="h-8"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="pad"
                                                className="text-[11px]"
                                            >
                                                Cards - Padding
                                            </Label>
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
                                                className="h-8"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="shadow"
                                                className="text-[11px]"
                                            >
                                                Cards - Shadow
                                            </Label>
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
                                                className="h-8"
                                            />
                                        </div>

                                        {/* BORDER */}
                                        <div>
                                            <Label className="text-[11px]">
                                                Border - Toggle
                                            </Label>
                                            <label className="flex h-8 items-center gap-2 rounded-md border px-2 text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={borderOn}
                                                    onChange={(e) =>
                                                        setBorderOn(
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                                <span>
                                                    {borderOn ? 'On' : 'Off'}
                                                </span>
                                            </label>
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="bcol"
                                                className="text-[11px]"
                                            >
                                                Border - Color
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
                                                className="h-8 p-1"
                                            />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="bwid"
                                                className="text-[11px]"
                                            >
                                                Border - Width
                                            </Label>
                                            <Input
                                                id="bwid"
                                                type="number"
                                                value={borderWidth}
                                                onChange={(e) =>
                                                    setBorderWidth(
                                                        parseInt(
                                                            e.target.value ||
                                                                '0',
                                                            10,
                                                        ),
                                                    )
                                                }
                                                className="h-8"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* GRID */}
                    <div
                        className={
                            showSettings ? 'md:col-span-12' : 'md:col-span-12'
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
        </AppLayout>
    );
}

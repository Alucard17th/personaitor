import type { MultiSelectOption } from '@/components/multi-select';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { GridStack, type GridStackOptions } from 'gridstack';
import 'gridstack/dist/gridstack.css';
import html2canvas from 'html2canvas';
import { Plus, Printer, Save, Settings2, Sparkles, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/' },
    { title: 'Personas', href: '/app/personas' },
    { title: 'Builder', href: '/app/personas/create' },
];

type PersonaMessage = { role?: string; content?: string };
type SerializedItem = {
    x: number;
    y: number;
    w: number;
    h: number;
    content: string;
};
type FlashPayload = {
    status?: string;
    error?: string;
    generated?: { persona?: PersonaMessage; image?: string };
    saved_persona?: { id: string | number; name: string };
};
type CategoryLite = { id: number; name: string; color?: string | null };

type PageProps = { flash?: FlashPayload; categories: CategoryLite[] };

export default function PersonaBuilderPage() {
    const { props } = usePage<PageProps>();

    // Prompt section
    const [prompt, setPrompt] = useState('');
    const [level, setLevel] = useState<'normal' | 'advanced'>('normal');
    const [chips, setChips] = useState<string[]>([]);
    const [chipInput, setChipInput] = useState('');

    // Editor section
    const [personaName, setPersonaName] = useState('');
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [showEditor, setShowEditor] = useState(false);
    const categories = props.categories;
    const categoryOptions = React.useMemo<MultiSelectOption[]>(
        () =>
            (categories ?? []).map((c) => ({
                label: c.name,
                value: String(c.id),
                // optional: show color as badge background if provided
                ...(c.color ? { style: { badgeColor: c.color } } : {}),
            })),
        [categories],
    );

    // Base theme
    const [bgColor, setBgColor] = useState('#dfe4fd');
    const [columnColor, setColumnColor] = useState('#000000ff');
    const [titleColor, setTitleColor] = useState('#ffffff');
    const [titleSize, setTitleSize] = useState(15);
    const [textColor, setTextColor] = useState('#ffffff');
    const [textSize, setTextSize] = useState(16);

    // Advanced styling controls (compact UI)
    const [radius, setRadius] = useState(8); // px
    const [padding, setPadding] = useState(12); // px
    const [shadow, setShadow] = useState(8); // px depth
    const [borderOn, setBorderOn] = useState(false);
    const [borderColor, setBorderColor] = useState('#4b5563');
    const [borderWidth, setBorderWidth] = useState(0); // px
    const [titleWeight, setTitleWeight] = useState(600); // 400-800
    const [titleAlign, setTitleAlign] = useState<'left' | 'center' | 'right'>(
        'left',
    );
    const [lineHeight, setLineHeight] = useState(1.4); // 1.0 - 2.0
    const [imgMaxWidth, setImgMaxWidth] = useState(100); // % inside avatar cells
    const [showSettings, setShowSettings] = useState(false);

    // GridStack refs
    const gridRef = useRef<HTMLDivElement>(null);
    const gridInstanceRef = useRef<GridStack | null>(null);
    const dataRef = useRef<SerializedItem[]>([]);
    const [newPersonaId, setNewPersonaId] = useState<string | number | null>(
        null,
    );

    // Avatar element handle (self-managed)
    const avatarElRef = useRef<HTMLElement | null>(null);

    // queue payload after generation
    const [pending, setPending] = useState<{
        persona: Record<string, unknown>;
        image?: string;
    } | null>(null);

    // Inertia forms (kept for save flows)
    const genForm = useForm<{ data: string }>({ data: '' });
    const createForm = useForm<{ data: string }>({ data: '' });
    const updateForm = useForm<{ data: string }>({ data: '' });

    const canAddChip = chips.length < 5 && chipInput.trim().length > 0;
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
        if (!showEditor) return;
        if (!gridRef.current || gridInstanceRef.current) return;

        const opts: GridStackOptions = {
            column: 4,
            // float: true,
            cellHeight: 90,
            // disableOneColumnMode: true,
            margin: 6,
        };
        const grid = GridStack.init(opts, gridRef.current);
        gridInstanceRef.current = grid;

        function updateSerialized() {
            const nodes = grid.engine.nodes ?? [];
            dataRef.current = nodes.map((n) => ({
                x: n.x ?? 0,
                y: n.y ?? 0,
                w: n.w ?? 2,
                h: n.h ?? 3,
                content:
                    (
                        n.el?.querySelector(
                            '.grid-stack-item-content',
                        ) as HTMLElement
                    )?.innerHTML ?? '',
            }));

            console.log('serialized', dataRef.current);
        }

        grid.on('change', updateSerialized);
        grid.on('added', updateSerialized);
        grid.on('removed', updateSerialized);

        const onInput = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!target?.closest('.grid-stack-item-content')) return;
            updateSerialized();
            applyLiveStyles();
            queueReflow(); // content changed -> may affect size (non-avatar)
        };
        gridRef.current.addEventListener('input', onInput);

        // Clicking the red "X" on any card
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

        // Reflow on image load—but skip the avatar (it manages itself)
        const onAnyImageLoad = (e: Event) => {
            const target = e.target as HTMLElement | null;
            if (!(target && target.tagName === 'IMG')) return;
            const item = target.closest(
                '.grid-stack-item',
            ) as HTMLElement | null;
            if (item?.dataset.type === 'avatar') return; // avatar is self-managed
            queueReflow();
        };
        gridRef.current.addEventListener('load', onAnyImageLoad, true); // capture phase

        return () => {
            try {
                gridRef.current?.removeEventListener('input', onInput);
                gridRef.current?.removeEventListener('click', onClick);
                gridRef.current?.removeEventListener(
                    'load',
                    onAnyImageLoad,
                    true,
                );
                grid.destroy(false);
            } catch {}
            gridInstanceRef.current = null;
        };
    }, [showEditor]);

    // Apply all live styles (compact + advanced)
    const applyLiveStyles = () => {
        const root = gridRef.current;
        if (!root) return;

        root.style.backgroundColor = bgColor;

        // grid item containers
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

        // titles
        root.querySelectorAll<HTMLElement>('.grid-title').forEach((el) => {
            el.style.color = titleColor;
            el.style.fontSize = `${titleSize}px`;
            el.style.fontWeight = String(titleWeight);
            el.style.textAlign = titleAlign;
            el.style.marginBottom = '4px';
        });

        // descriptions
        root.querySelectorAll<HTMLElement>('.grid-content-desc').forEach(
            (el) => {
                el.style.color = textColor;
                el.style.fontSize = `${textSize}px`;
                el.style.lineHeight = String(lineHeight);
                (el.style as any).textAlign = titleAlign;
            },
        );

        // avatar images
        root.querySelectorAll<HTMLImageElement>(
            '.grid-content-desc img',
        ).forEach((img) => {
            // inline sizing to stabilize first measurement as well
            img.style.maxWidth = `${imgMaxWidth}%`;
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = titleAlign === 'left' ? '0' : '0 auto';
            img.style.borderRadius = `${Math.max(0, radius - 2)}px`;
        });
    };

    // Re-apply styles when controls change
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
        showEditor,
    ]);

    // Reflow when size-affecting controls change (ensures proper height/rows) — non-avatar
    useEffect(() => {
        if (!showEditor) return;
        queueReflow();
    }, [padding, titleSize, textSize, lineHeight, imgMaxWidth, showEditor]);

    // When style knobs change, update avatar height directly (no global reflow)
    useEffect(() => {
        if (!showEditor || !avatarElRef.current || !gridInstanceRef.current)
            return;
        updateAvatarHeight(avatarElRef.current);
    }, [
        padding,
        titleSize,
        textSize,
        lineHeight,
        imgMaxWidth,
        titleAlign,
        radius,
        showEditor,
    ]);

    // When settings panel changes width, repack and recompute heights
    useEffect(() => {
        if (!showEditor || !gridInstanceRef.current) return;
        // when settings panel changes width, repack and recompute heights
        gridInstanceRef.current.compact();
        queueReflow();
    }, [showSettings, showEditor]);

    // helpers
    function formatContent(content: unknown) {
        if (typeof content === 'string') return content.replace(/"/g, '&quot;');
        if (Array.isArray(content)) return content.join(', ');
        if (content && typeof content === 'object') {
            return Object.entries(content as Record<string, unknown>)
                .map(
                    ([k, v]) =>
                        `${k}: ${Array.isArray(v) ? (v as any[]).join(', ') : String(v)}`,
                )
                .join(', ');
        }
        return String(content ?? '');
    }

    // Measure height for a fixed column span (used by avatar + non-avatar height calc)
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
        probe.style.width = `${Math.ceil(colsWanted * colWidth)}px`; // constrain width
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

        const h = Math.max(1, Math.ceil(rect.height / cellHeight));
        return { h };
    }

    // Global reflow: pack row-aligned, but skip the avatar widget entirely
    function reflowGridRowAligned() {
        const grid = gridInstanceRef.current as any;
        if (!grid) return;

        const cols = grid?.engine?.column ?? 4;
        const items = Array.from(
            (gridRef.current as HTMLElement).querySelectorAll(
                '.grid-stack-item',
            ),
        ) as HTMLElement[];

        const desired = items.map((el) => {
            // Skip avatar (keep its w/h; only reposition in the flow)
            if (el.dataset.type === 'avatar') {
                const node = grid.engine?.nodes?.find((n: any) => n.el === el);
                return { el, w: node?.w ?? 2, h: node?.h ?? 3, skip: true };
            }

            const inner =
                (el.querySelector('.grid-stack-item-content') as HTMLElement)
                    ?.innerHTML ?? '';
            // Keep the current width, recompute height for that width
            const currentW =
                (grid.engine?.nodes?.find((n: any) => n.el === el)?.w ??
                    parseInt(el.getAttribute('gs-w') || '1', 10)) ||
                1;
            const { h } = measureHeightForCols(inner, currentW);
            return {
                el,
                w: Math.min(Math.max(1, currentW), cols),
                h,
                skip: false,
            };
        });

        let x = 0,
            y = 0,
            rowMaxH = 0;

        grid.batchUpdate();
        desired.forEach(({ el, w, h, skip }) => {
            if (x + w > cols) {
                x = 0;
                y += rowMaxH;
                rowMaxH = 0;
            }
            if (skip) {
                // Keep its height; only move and keep current w
                const node = grid.engine?.nodes?.find((n: any) => n.el === el);
                grid.update(el, { x, y, w });
                x += w;
                rowMaxH = Math.max(rowMaxH, node?.h ?? 1);
            } else {
                grid.update(el, { x, y, w, h });
                x += w;
                rowMaxH = Math.max(rowMaxH, h);
            }
        });
        grid.commit();

        applyLiveStyles();
    }

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

    function createNewColumn(title: string, content: unknown) {
        const inner =
            title !== 'Avatar' ? formatContent(content) : (content as string);
        const htmlInner = `
      <div contenteditable="true" class="grid-title">${title}</div>
      <div class="grid-content-desc mt-2" contenteditable="true">${inner}</div>
      <button class="delete-btn" style="
        position:absolute;top:6px;right:6px;
        background:#ef4444;color:#fff;border:none;
        width:22px;height:22px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;">X</button>
    `.trim();

        addGridItem(htmlInner, { x: 0, y: 0, w: 2, h: 3 });
    }

    // ----- Avatar: self-managed (no global reflow) -----
    function createAvatarColumn(imgDataUrl: string) {
        const htmlInner = `
      <div class="grid-title" contenteditable="true">Avatar</div>
      <div class="grid-content-desc mt-2" contenteditable="false">
        <img src="${imgDataUrl}" alt="persona avatar"
             style="max-width:100%;height:auto;display:block;border-radius:${Math.max(0, radius - 2)}px" />
      </div>
      <button class="delete-btn" style="
        position:absolute;top:6px;right:6px;
        background:#ef4444;color:#fff;border:none;
        width:22px;height:22px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;">X</button>
    `.trim();

        // Build the element so we can tag it and keep a handle
        const el = document.createElement('div');
        el.classList.add('grid-stack-item');
        el.dataset.type = 'avatar';
        el.innerHTML = `
      <div class="grid-stack-item-content"
           style="border-radius:${radius}px;box-shadow:rgba(99,99,99,0.2) 0px 2px 8px;padding:${padding}px;">
        ${htmlInner}
      </div>
    `;

        const size = { x: 0, y: 0, w: 2, h: 3 }; // initial intended size
        gridInstanceRef.current?.makeWidget(el, size);
        applyLiveStyles();

        avatarElRef.current = el;

        // When the image loads (or if already loaded), set height for current width
        const img = el.querySelector('img') as HTMLImageElement | null;
        if (img) {
            if (img.complete) updateAvatarHeight(el);
            else
                img.addEventListener('load', () => updateAvatarHeight(el), {
                    once: true,
                });
        }
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
        grid.update(el, { h }); // height-only
    }

    const addChip = () => {
        if (!canAddChip) return;
        setChips((prev) => [...prev, chipInput.trim()]);
        setChipInput('');
    };
    const removeChip = (value: string) =>
        setChips((prev) => prev.filter((c) => c !== value));

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

    // ---- Generate (unchanged flow) ----
    const onGenerate = () => {
        if (!prompt.trim()) {
            toast.error('Please enter a prompt.');
            return;
        }
        const data = {
            data: JSON.stringify({ prompt, level, additionalCriteria: chips }),
        };

        router.post('/app/personas/generate', data, {
            preserveScroll: true,
            onStart: () => toast.message('Generating…'),
            // onError: () => toast.error('Generation failed'),
            // onFinish: () => {},
        });
    };

    const savePersona = (silent = false) => {
        if (!personaName.trim()) {
            if (!silent) toast.info('Please enter a persona name');
            return;
        }

        const settings = {
            name: personaName,
            'background-color': bgColor,
            'column-color': columnColor,
            'text-color': textColor,
            'title-color': titleColor,
            'title-size': String(titleSize),
            'text-size': String(textSize),
            // Persist advanced settings
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

        const data = {
            data: JSON.stringify(serialize()),
            settings: JSON.stringify(settings),
            prompt,
            category_ids: categoryIds.map(Number),
        };

        if (!newPersonaId) {
            router.post('/app/personas', data, {
                preserveScroll: true,
                // onStart: () => toast.message('Saving…'),
                // onError: () => toast.error('Save failed'),
                // onFinish: () => toast.dismiss(),
            });
            return;
        }

        updateForm.setData('data', JSON.stringify(data));
        updateForm.put(`/app/personas/${newPersonaId}`, {
            preserveScroll: true,
            // onError: () => !silent && toast.error('Update failed'),
        });
    };

    useEffect(() => {
        const flash = props.flash;
        if (!flash) return;

        // if (flash.error) toast.error(flash.error);
        // if (flash.status) toast.success(flash.status);

        if (flash.generated) {
            let content = flash.generated.persona?.content ?? '{}';
            if (content.charAt(content.length - 1) !== '}') content += '}';
            try {
                const personaObj = JSON.parse(content) as Record<
                    string,
                    unknown
                >;
                setPending({
                    persona: personaObj,
                    image: flash.generated.image,
                });
                setShowEditor(true);
            } catch (e) {
                console.error('Failed to parse persona JSON', e);
                toast.error('Invalid persona data');
            }
        }

        if (flash.saved_persona?.id) {
            setNewPersonaId(flash.saved_persona.id);
            if (flash.saved_persona.name)
                setPersonaName(flash.saved_persona.name);
        }
    }, [props.flash]);

    useEffect(() => {
        if (!showEditor) return;
        const grid = gridInstanceRef.current;
        if (!grid || !pending) return;

        grid.removeAll();
        avatarElRef.current = null;

        if (pending.image) createAvatarColumn(pending.image);
        Object.entries(pending.persona).forEach(([k, v]) =>
            createNewColumn(capitalizeFirstLetter(k), v),
        );
        applyLiveStyles();
        setPending(null);

        // Post-hydration: global pack (non-avatar) and ensure avatar height is good
        queueReflow();
        if (avatarElRef.current) updateAvatarHeight(avatarElRef.current);
    }, [showEditor, pending]);

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

    // Quick preset actions (compact one-click styling)
    const applyPreset = (name: 'Clean' | 'Dark' | 'Magazine') => {
        if (name === 'Clean') {
            setBgColor('#f3f4f6');
            setColumnColor('#ffffff');
            setTitleColor('#111827');
            setTextColor('#374151');
            setTitleSize(16);
            setTextSize(15);
            setRadius(10);
            setPadding(12);
            setShadow(6);
            setBorderOn(true);
            setBorderColor('#e5e7eb');
            setBorderWidth(1);
            setTitleWeight(600);
            setTitleAlign('left');
            setLineHeight(1.5);
        } else if (name === 'Dark') {
            setBgColor('#0b1020');
            setColumnColor('#111827');
            setTitleColor('#f3f4f6');
            setTextColor('#d1d5db');
            setTitleSize(16);
            setTextSize(15);
            setRadius(12);
            setPadding(14);
            setShadow(10);
            setBorderOn(false);
            setBorderWidth(0);
            setTitleWeight(600);
            setTitleAlign('left');
            setLineHeight(1.5);
        } else {
            setBgColor('#fff7ed');
            setColumnColor('#fff');
            setTitleColor('#7c2d12');
            setTextColor('#1f2937');
            setTitleSize(18);
            setTextSize(15);
            setRadius(14);
            setPadding(16);
            setShadow(14);
            setBorderOn(true);
            setBorderColor('#fed7aa');
            setBorderWidth(1);
            setTitleWeight(700);
            setTitleAlign('center');
            setLineHeight(1.6);
        }
        applyLiveStyles();
        // Update avatar height immediately when presets change; others will reflow in queued pass
        if (avatarElRef.current) updateAvatarHeight(avatarElRef.current);
        queueReflow();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Persona Builder" />
            <div className="space-y-6 p-6">
                {/* Prompt card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <Label
                                    htmlFor="prompt"
                                    className="font-semibold"
                                >
                                    Persona Prompt
                                </Label>
                                <Textarea
                                    id="prompt"
                                    rows={5}
                                    placeholder="Persona prompt..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Enter a detailed prompt to define your
                                    persona.
                                </p>
                            </div>

                            {/* Chips */}
                            <div className="md:col-span-2">
                                <Label
                                    htmlFor="chip-input"
                                    className="font-semibold"
                                >
                                    Add Attributes (Max 5)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="chip-input"
                                        placeholder="Type a tag and press Enter"
                                        value={chipInput}
                                        onChange={(e) =>
                                            setChipInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (canAddChip) addChip();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addChip}
                                        disabled={!canAddChip}
                                    >
                                        Add
                                    </Button>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Add titles like “Pain Points”, “Daily
                                    Challenges”, “Hobbies”… The AI will fill
                                    them.
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {chips.map((c) => (
                                        <span
                                            key={c}
                                            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs"
                                        >
                                            {c}
                                            <button
                                                className="text-red-500"
                                                onClick={() => removeChip(c)}
                                                aria-label={`remove ${c}`}
                                                type="button"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Level */}
                            <div>
                                <Label
                                    htmlFor="level"
                                    className="font-semibold"
                                >
                                    Level
                                </Label>
                                <select
                                    id="level"
                                    className="h-10 w-full rounded-md border px-3"
                                    value={level}
                                    onChange={(e) =>
                                        setLevel(
                                            e.target.value as
                                                | 'normal'
                                                | 'advanced',
                                        )
                                    }
                                >
                                    <option value="normal">Normal</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Choose the complexity of the persona
                                    details.
                                </p>
                            </div>

                            {/* Generate */}
                            <div className="mt-4 md:col-span-2">
                                <Button type="button" onClick={onGenerate}>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Editor */}
                {showEditor && (
                    <div className="space-y-4">
                        {/* Top bar: name + actions */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <Label htmlFor="name" className="font-semibold">
                                    Title
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Persona name…"
                                    value={personaName}
                                    onChange={(e) =>
                                        setPersonaName(e.target.value)
                                    }
                                />
                            </div>
                            <MultiSelect
                                options={categoryOptions}
                                onValueChange={setCategoryIds}
                                defaultValue={categoryIds}
                                placeholder="Select categories…"
                            />
                            <div className="flex items-end gap-2">
                                <Button
                                    onClick={() => savePersona()}
                                    disabled={
                                        createForm.processing ||
                                        updateForm.processing
                                    }
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {createForm.processing ||
                                    updateForm.processing
                                        ? 'Saving…'
                                        : 'Save'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={printPersona}
                                >
                                    <Printer className="mr-2 h-4 w-4" /> Print
                                </Button>
                            </div>
                        </div>

                        {/* Settings + Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                            {/* SETTINGS: compact */}
                            {showSettings && (
                                <div className="md:col-span-3">
                                    <Card>
                                        <CardContent className="pt-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <Label className="font-semibold">
                                                    Settings
                                                </Label>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            applyPreset('Clean')
                                                        }
                                                    >
                                                        Clean
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            applyPreset('Dark')
                                                        }
                                                    >
                                                        Dark
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            applyPreset(
                                                                'Magazine',
                                                            )
                                                        }
                                                    >
                                                        Mag
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Theme */}
                                                <div className="col-span-2 mt-1 text-xs font-semibold opacity-70">
                                                    Theme
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="bg"
                                                        className="text-xs"
                                                    >
                                                        Background
                                                    </Label>
                                                    <Input
                                                        id="bg"
                                                        type="color"
                                                        value={bgColor}
                                                        onChange={(e) =>
                                                            setBgColor(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 p-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="col"
                                                        className="text-xs"
                                                    >
                                                        Column
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

                                                {/* Title */}
                                                <div className="col-span-2 mt-1 text-xs font-semibold opacity-70">
                                                    Title
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="tcol"
                                                        className="text-xs"
                                                    >
                                                        Color
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
                                                        className="text-xs"
                                                    >
                                                        Size
                                                    </Label>
                                                    <Input
                                                        id="tsz"
                                                        type="number"
                                                        value={titleSize}
                                                        onChange={(e) =>
                                                            setTitleSize(
                                                                parseInt(
                                                                    e.target
                                                                        .value ||
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
                                                        className="text-xs"
                                                    >
                                                        Weight
                                                    </Label>
                                                    <select
                                                        id="twt"
                                                        className="h-8 w-full rounded-md border px-2 text-sm"
                                                        value={titleWeight}
                                                        onChange={(e) =>
                                                            setTitleWeight(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        {[
                                                            400, 500, 600, 700,
                                                            800,
                                                        ].map((w) => (
                                                            <option
                                                                key={w}
                                                                value={w}
                                                            >
                                                                {w}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="talign"
                                                        className="text-xs"
                                                    >
                                                        Align
                                                    </Label>
                                                    <select
                                                        id="talign"
                                                        className="h-8 w-full rounded-md border px-2 text-sm"
                                                        value={titleAlign}
                                                        onChange={(e) =>
                                                            setTitleAlign(
                                                                e.target
                                                                    .value as any,
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

                                                {/* Text */}
                                                <div className="col-span-2 mt-1 text-xs font-semibold opacity-70">
                                                    Text
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="txcol"
                                                        className="text-xs"
                                                    >
                                                        Color
                                                    </Label>
                                                    <Input
                                                        id="txcol"
                                                        type="color"
                                                        value={textColor}
                                                        onChange={(e) =>
                                                            setTextColor(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 p-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="txsz"
                                                        className="text-xs"
                                                    >
                                                        Size
                                                    </Label>
                                                    <Input
                                                        id="txsz"
                                                        type="number"
                                                        value={textSize}
                                                        onChange={(e) =>
                                                            setTextSize(
                                                                parseInt(
                                                                    e.target
                                                                        .value ||
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
                                                        className="text-xs"
                                                    >
                                                        Line height
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
                                                                    e.target
                                                                        .value ||
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
                                                        className="text-xs"
                                                    >
                                                        % Img width
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
                                                                            e
                                                                                .target
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

                                                {/* Cards */}
                                                <div className="col-span-2 mt-1 text-xs font-semibold opacity-70">
                                                    Cards
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="radius"
                                                        className="text-xs"
                                                    >
                                                        Radius
                                                    </Label>
                                                    <Input
                                                        id="radius"
                                                        type="number"
                                                        value={radius}
                                                        onChange={(e) =>
                                                            setRadius(
                                                                parseInt(
                                                                    e.target
                                                                        .value ||
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
                                                        className="text-xs"
                                                    >
                                                        Padding
                                                    </Label>
                                                    <Input
                                                        id="pad"
                                                        type="number"
                                                        value={padding}
                                                        onChange={(e) =>
                                                            setPadding(
                                                                parseInt(
                                                                    e.target
                                                                        .value ||
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
                                                        className="text-xs"
                                                    >
                                                        Shadow
                                                    </Label>
                                                    <Input
                                                        id="shadow"
                                                        type="number"
                                                        value={shadow}
                                                        onChange={(e) =>
                                                            setShadow(
                                                                parseInt(
                                                                    e.target
                                                                        .value ||
                                                                        '0',
                                                                    10,
                                                                ),
                                                            )
                                                        }
                                                        className="h-8"
                                                    />
                                                </div>

                                                {/* Border toggle */}
                                                <div className="col-span-2 mt-1 flex items-center justify-between">
                                                    <span className="text-xs">
                                                        Border
                                                    </span>
                                                    <label className="inline-flex items-center gap-2 text-xs">
                                                        <input
                                                            type="checkbox"
                                                            checked={borderOn}
                                                            onChange={(e) =>
                                                                setBorderOn(
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                        />
                                                        <span>
                                                            {borderOn
                                                                ? 'On'
                                                                : 'Off'}
                                                        </span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="bcol"
                                                        className="text-xs"
                                                    >
                                                        B. Color
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
                                                        className="text-xs"
                                                    >
                                                        B. Width
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
                                                        className="h-8"
                                                    />
                                                </div>

                                                {/* Quick item button */}
                                                <div className="col-span-2">
                                                    <Button
                                                        variant="outline"
                                                        type="button"
                                                        onClick={() =>
                                                            createNewColumn(
                                                                'New item',
                                                                'LOREM GOES HERE',
                                                            )
                                                        }
                                                        className="h-8 w-full text-sm"
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />{' '}
                                                        Column
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* GRID */}
                            <div
                                className={
                                    showSettings
                                        ? 'md:col-span-9'
                                        : 'md:col-span-12'
                                }
                            >
                                {/* <div className="mb-2">
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
                                </div> */}
                                <div
                                    ref={gridRef}
                                    className="grid-stack rounded-md p-2"
                                    style={
                                        gridContainerStyle as React.CSSProperties
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

// utils
function capitalizeFirstLetter(str: unknown) {
    const s = String(str ?? '');
    return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

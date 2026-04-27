"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { UploadIcon, Loader2, Save, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductFormSchema, type ProductFormValues } from "@/schema/product.schema";
import { useProductById, useProductCreatedOrUpdated } from "@/hooks/use-product";
import { NumberInputWithComma } from "@/components/shared/numberInputWithComma";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableImageCard from "../dragAndDrop/SortableImageCard";
import { Label } from "@/components/ui/label";

export interface DialogProps {
    id?: string;
}

type ImageItem = {
    id: string;
    src: string;
    file?: File;
    isRemote?: boolean;
};

export default function ProductActionContent({ id }: DialogProps) {
    const t = useTranslations('admin.setting');
    const tProduct = useTranslations('admin.setting.product');

    const { mutateAsync: action, isPending } = useProductCreatedOrUpdated();
    const { data } = useProductById(id);

    const [images, setImages] = useState<ImageItem[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const defaultValues = useMemo<ProductFormValues>(
        () => ({
            id: "",
            type: "",
            url: "",
            nameTh: "",
            headingTh: "",
            altTextTh: "",
            titleSummaryTh: "",
            metaTitleTh: "",
            metaKeywordTh: "",
            metaDescriptionTh: "",
            descriptionTh: "",
            nameEn: "",
            headingEn: "",
            altTextEn: "",
            titleSummaryEn: "",
            metaTitleEn: "",
            metaKeywordEn: "",
            metaDescriptionEn: "",
            descriptionEn: "",
            price: 0,
            images: [],
        }),
        []
    );

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues,
        mode: "onSubmit",
    });

    useEffect(() => {
        if (!id || !data) return;

        form.reset({
            ...defaultValues,
            id: id ?? "",
            type: data.type ?? "",
            url: data.url ?? "",
            nameTh: data.nameTh ?? "",
            headingTh: data.headingTh ?? "",
            altTextTh: data.altTextTh ?? "",
            titleSummaryTh: data.titleSummaryTh ?? "",
            metaTitleTh: data.metaTitleTh ?? "",
            metaKeywordTh: data.metaKeywordTh ?? "",
            metaDescriptionTh: data.metaDescriptionTh ?? "",
            descriptionTh: data.descriptionTh ?? "",

            nameEn: data.nameEn ?? "",
            headingEn: data.headingEn ?? "",
            altTextEn: data.altTextEn ?? "",
            titleSummaryEn: data.titleSummaryEn ?? "",
            metaTitleEn: data.metaTitleEn ?? "",
            metaKeywordEn: data.metaKeywordEn ?? "",
            metaDescriptionEn: data.metaDescriptionEn ?? "",
            descriptionEn: data.descriptionEn ?? "",

            price: data.price ?? 0,
            images: [],
        });
    }, [id, data, defaultValues, form]);

    const onReset = useCallback(() => {
        form.reset(defaultValues);
        form.clearErrors();

        setImages((prev) => {
            prev.forEach((x) => {
                if (x.src.startsWith("blob:")) URL.revokeObjectURL(x.src);
            });
            return [];
        });

        if (inputRef.current) inputRef.current.value = "";
    }, [form, defaultValues]);

    const onFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const newItems: ImageItem[] = files.map((file) => ({
            id: crypto.randomUUID(),
            src: URL.createObjectURL(file),
            file,
        }));

        setImages((prev) => [...prev, ...newItems]);

        const current = form.getValues("images") ?? [];
        form.setValue("images", [...current, ...files], { shouldDirty: true, shouldValidate: true });

        e.target.value = "";
    }, [form]);

    const removeImage = (id: string) => {
        setImages((prev) => {
            const target = prev.find(x => x.id === id);
            if (target?.src?.startsWith("blob:")) URL.revokeObjectURL(target.src);

            const next = prev.filter(x => x.id !== id);

            const nextFiles = next.filter(x => x.file).map(x => x.file!);
            form.setValue("images", nextFiles, { shouldDirty: true, shouldValidate: true });

            return next;
        });
    };

    const onSubmit = useCallback(
        async (values: ProductFormValues) => {
            try {
                await action(values);
                form.reset(defaultValues);
                form.clearErrors();
                setImages((prev) => {
                    prev.forEach((x) => {
                        if (x.src.startsWith("blob:")) URL.revokeObjectURL(x.src);
                    });
                    return [];
                });
            } catch {
                // handled by react-query onError
            }
        },
        [action, defaultValues, form]
    );

    type StringFieldName = {
        [K in keyof ProductFormValues]-?: NonNullable<ProductFormValues[K]> extends string ? K : never
    }[keyof ProductFormValues];

    const renderTextField = (
        name: StringFieldName,
        label: string,
        required?: boolean
    ) => (
        <FormField
            name={name}
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label} {required ? <span className="text-red-500">*</span> : null}
                    </FormLabel>
                    <FormControl>
                        <InputGroup>
                            <InputGroupInput type="text" {...field} value={field.value ?? ""} />
                        </InputGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    );

    return (
        <Card>
            <CardContent>
                <CardTitle>{id ? tProduct('headUpdated') : tProduct('headCreated')}</CardTitle>
                <CardDescription>
                    {id ? tProduct('descriptionUpdated') : tProduct('descriptionCreated')}
                </CardDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mb-3 py-3">
                            <Label className="mb-3">รูปภาพสินค้า</Label>
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => {
                                    const { active, over } = event;
                                    if (!over || active.id === over.id) return;

                                    setImages((items) => {
                                        const oldIndex = items.findIndex((i) => i.id === active.id);
                                        const newIndex = items.findIndex((i) => i.id === over.id);
                                        const next = arrayMove(items, oldIndex, newIndex);

                                        const nextFiles = next.filter((x) => x.file).map((x) => x.file!);
                                        form.setValue("images", nextFiles, { shouldDirty: true, shouldValidate: true });

                                        return next;
                                    });
                                }}
                            >
                                <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-3">
                                        {images.map((img, idx) => (
                                            <SortableImageCard
                                                key={img.id}
                                                id={img.id}
                                                src={img.src}
                                                index={idx}
                                                onRemove={() => removeImage(img.id)}
                                            />
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => inputRef.current?.click()}
                                            className="h-30 sm:h-50 rounded-lg border bg-muted flex items-center justify-center hover:bg-muted/80 transition"
                                        >
                                            <UploadIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </SortableContext>
                            </DndContext>

                            <Input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={onFilesChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {renderTextField("type", tProduct("type"), true)}

                            <FormField
                                name="url"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tProduct('url')} <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput
                                                    type="text"
                                                    {...field}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="price"
                                control={form.control}
                                render={({ field }) => (
                                    <NumberInputWithComma
                                        label={tProduct('price')}
                                        request
                                        unit={tProduct('unitPrice')}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <Accordion
                                type="single"
                                collapsible
                                className="w-full grid grid-cols-1 gap-3"
                                defaultValue="item-1"
                            >
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="border p-2">{tProduct('informationTh')}</AccordionTrigger>
                                    <AccordionContent className="grid grid-cols-1 gap-3 p-3">
                                        {renderTextField("nameTh", tProduct("name"), true)}
                                        {renderTextField("headingTh", tProduct("heading"), true)}
                                        {renderTextField("altTextTh", tProduct("altText"), true)}
                                        {renderTextField("titleSummaryTh", tProduct("titleSummary"), true)}
                                        {renderTextField("metaTitleTh", tProduct("metaTitle"), true)}
                                        {renderTextField("metaKeywordTh", tProduct("metaKeyword"), true)}
                                        {renderTextField("metaDescriptionTh", tProduct("metaDescription"), true)}

                                        <FormField
                                            name="descriptionTh"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{tProduct('description')}</FormLabel>
                                                    <FormControl>
                                                        <InputGroup>
                                                            <InputGroupInput
                                                                type="text"
                                                                {...field}
                                                            />
                                                        </InputGroup>
                                                    </FormControl>

                                                </FormItem>
                                            )}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="border p-2">{tProduct('informationEn')}</AccordionTrigger>
                                    <AccordionContent className="grid grid-cols-1 gap-3 p-3">
                                        {renderTextField("nameEn", tProduct("name"), true)}
                                        {renderTextField("headingEn", tProduct("heading"), true)}
                                        {renderTextField("altTextEn", tProduct("altText"), true)}
                                        {renderTextField("titleSummaryEn", tProduct("titleSummary"), true)}
                                        {renderTextField("metaTitleEn", tProduct("metaTitle"), true)}
                                        {renderTextField("metaKeywordEn", tProduct("metaKeyword"), true)}
                                        {renderTextField("metaDescriptionEn", tProduct("metaDescription"), true)}
                                        <FormField
                                            name="descriptionEn"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{tProduct('description')}</FormLabel>
                                                    <FormControl>
                                                        <InputGroup>
                                                            <InputGroupInput
                                                                type="text"
                                                                {...field}
                                                            />
                                                        </InputGroup>
                                                    </FormControl>

                                                </FormItem>
                                            )}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 mt-3 px-0">
                            <Button type="button" className="cursor-pointer w-full sm:w-auto" variant={'secondary'} disabled={isPending} onClick={() => onReset()}>
                                {isPending ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    <RotateCcw className="h-4 w-4" />
                                )}
                                {t('reset')}
                            </Button>

                            <Button type="submit" className="cursor-pointer w-full sm:w-[150px]" disabled={isPending}>
                                {isPending ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {t('save')}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useProfileUpdated, useMeDetail } from "@/hooks/use-member";
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Mail, User, UploadIcon, Phone, LockKeyhole, Eye, EyeOff, Loader2, Save, RotateCcw } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { MemberFormSchema } from "@/schema/member.schema";

export interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SettingProfileDialog({ open, onOpenChange }: DialogProps) {
    const { data: user, isPending, refetch } = useMeDetail();
    const { mutateAsync: updated, isPending: isUpdating } = useProfileUpdated();
    const t = useTranslations('admin.setting');
    const tMember = useTranslations('admin.setting.member');

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<MemberFormSchema>({
        resolver: zodResolver(MemberFormSchema),
        defaultValues: {
            id: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            profile: null,
        },
    })

    useEffect(() => {
        if (open) {
            void refetch().catch((err) => {
                console.error("Refetch error:", err);
            });
        }
    }, [open, refetch]);

    useEffect(() => {
        if (!open) return;
        if (!user) return;
        form.setValue("id", user.id ?? "");
        form.setValue("email", user.email ?? "");
        form.setValue("phone", user.phone ?? "");
        setImagePreview(user.profileUrl ?? null);
    }, [open, user, form]);

    const onReset = () => {
        if (!user) return;
        form.setValue("id", user.id ?? "");
        form.setValue("email", user.email ?? "");
        form.setValue("phone", user.phone ?? "");
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
        form.setValue("profile", null);
        setImagePreview(user.profileUrl ?? null);
        form.clearErrors();
    }

    const onSubmit = async (values: MemberFormSchema) => {
        try {
            const payload = {
                ...values,
                password: values.password?.trim() ? values.password : undefined,
            };
            await updated(payload);
            onReset();
            onOpenChange(false);
        } catch {
            // handled by react-query onError
        }
    };

    if (isPending) {
        return (
            <div className="grid h-full items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
                    <span className="text-sm text-muted-foreground">{t('loading')}</span>
                </div>
            </div>
        );
    }

    const initials =
        (user?.username ?? "U")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join("") || "U";


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[95vh] overflow-x-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {tMember('headProfile')}
                    </DialogTitle>
                    <DialogDescription>
                        {tMember('descriptionUpdated')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex justify-center items-center mb-3">
                            <Label className="relative group cursor-pointer">
                                <Avatar className="w-34 h-34 border overflow-hidden rounded-full">
                                    {imagePreview ? (
                                        <AvatarImage
                                            src={imagePreview}
                                            alt={user?.username ?? "Username"}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white text-3xl font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    )}
                                </Avatar>

                                <div
                                    className="
                                        absolute inset-0
                                        flex items-center justify-center
                                        rounded-full
                                        bg-black/50
                                        opacity-0
                                        transition-opacity
                                        group-hover:opacity-100
                                    "
                                >
                                    <UploadIcon className="h-8 w-8 text-white" />
                                </div>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setImagePreview(URL.createObjectURL(file));
                                        form.setValue("profile", file);
                                    }}
                                />
                            </Label>
                        </div>
                        <div className="grid grid-cols- gap-3">
                            <Label>{tMember('username')}</Label>
                            <InputGroup>
                                <InputGroupInput
                                    type="text"
                                    readOnly
                                    tabIndex={-1}
                                    className="cursor-default focus:outline-none focus:ring-0"
                                    defaultValue={user?.username || "user"}
                                />
                                <InputGroupAddon align="inline-start"><User /></InputGroupAddon>
                            </InputGroup>

                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tMember('email')}</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput
                                                    type="text"
                                                    {...field}
                                                />
                                                <InputGroupAddon align="inline-start"><Mail /></InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="phone"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tMember('phone')}</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput
                                                    type="text"
                                                    maxLength={10}
                                                    {...field}
                                                />
                                                <InputGroupAddon align="inline-start"><Phone /></InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tMember("password")}</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder={tMember('placeholderPassword')}
                                                    {...field}
                                                />

                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        variant="secondary"
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}>
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </InputGroupButton>
                                                </InputGroupAddon>

                                                <InputGroupAddon align="inline-start">
                                                    <LockKeyhole />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.watch("password")?.length ? (
                                <FormField
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{tMember('confirmPassword')}</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="กรุณายืนยันรหัสผ่าน"
                                                        {...field}
                                                    />

                                                    <InputGroupAddon align="inline-end">
                                                        <InputGroupButton
                                                            variant="secondary"
                                                            aria-label={showPassword ? "Hide password" : "Show password"}>
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </InputGroupButton>
                                                    </InputGroupAddon>

                                                    <InputGroupAddon align="inline-start">
                                                        <LockKeyhole />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : null}

                            <DialogFooter className="!justify-between !flex-col sm:!flex-row">
                                <Button type="button" className="cursor-pointer" variant={'secondary'} disabled={isUpdating} onClick={() => onReset()}>
                                    {isUpdating ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                        <RotateCcw className="h-4 w-4" />
                                    )}
                                    {t('reset')}
                                </Button>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <DialogClose asChild>
                                            <Button variant="destructive" className="w-full">{t('cancel')}</Button>
                                        </DialogClose>
                                    </div>
                                    <div className="flex-2">
                                        <Button type="submit" className="cursor-pointer w-full sm:w-[150px]" disabled={isUpdating}>
                                            {isUpdating ? (
                                                <Loader2 className="animate-spin h-4 w-4" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )}
                                            {t('save')}
                                        </Button>
                                    </div>
                                </div>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
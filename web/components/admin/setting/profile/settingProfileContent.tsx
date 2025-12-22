"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdatedUser, useUserDetail } from "@/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import z from "zod";
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

const ProfileFormSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z
        .string()
        .min(1, "กรุณากรอกอีเมล")
        .email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine((val) => !val || val.length >= 8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
        .refine((val) => !val || /[A-Z]/.test(val), "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว")
        .refine((val) => !val || /[a-z]/.test(val), "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว")
        .refine((val) => !val || /[0-9]/.test(val), "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว"),
    confirmPassword: z.string().optional().or(z.literal("")),
    phone: z
        .string()
        .min(10, "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก")
        .max(10, "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก")
        .regex(/^0[0-9]{9}$/, "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"),
    profile: z.instanceof(File).optional().nullable(),
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password && password.length > 0) {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "รหัสผ่านไม่ตรงกัน",
            });
        }
    }
});
export type ProfileFormSchema = z.infer<typeof ProfileFormSchema>;

export default function SettingProfileContent() {
    const { data: user, isPending } = useUserDetail();
    const { mutateAsync: updatedUser, isPending: isUpdating } = useUpdatedUser();
    const t = useTranslations('admin.setting');

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<ProfileFormSchema>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            id: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            profile: null,
        },
    })

    useEffect(() => {
        if (!user) return;
        form.setValue("id", user.id ?? "");
        form.setValue("username", user.username ?? "");
        form.setValue("email", user.email ?? "");
        form.setValue("phone", user.phone ?? "");
        setImagePreview(user.profileUrl ?? null);
    }, [user, form]);

    const onReset = () => {
        if (!user) return;
        form.setValue("id", user.id ?? "");
        form.setValue("username", user.username ?? "");
        form.setValue("email", user.email ?? "");
        form.setValue("phone", user.phone ?? "");
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
        form.setValue("profile", null);
        setImagePreview(user.profileUrl ?? null);
        form.clearErrors();
    }

    const onSubmit = async (values: ProfileFormSchema) => {
        try {
            const payload = {
                ...values,
                password: values.password?.trim() ? values.password : undefined,
            };
            await updatedUser(payload);
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
        <div className="p-6">
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
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('username')}</FormLabel>
                                    <FormControl>
                                        <InputGroup>
                                            <InputGroupInput
                                                type="text"
                                                readOnly
                                                tabIndex={-1}
                                                className="cursor-default focus:outline-none focus:ring-0"
                                                {...field}
                                            />
                                            <InputGroupAddon align="inline-start"><User /></InputGroupAddon>
                                        </InputGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('email')}</FormLabel>
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
                                    <FormLabel>{t('phone')}</FormLabel>
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
                                    <FormLabel>{t("password")}</FormLabel>
                                    <FormControl>
                                        <InputGroup>
                                            <InputGroupInput
                                                type={showPassword ? "text" : "password"}
                                                placeholder="กรุณากรอกรหัสผ่านใหม่ ถ้าต้องการเปลี่ยนรหัสผ่าน"
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
                                        <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
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

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
                            <Button type="button" className="cursor-pointer" variant={'secondary'} disabled={isUpdating} onClick={() => onReset()}>
                                {isUpdating ? (
                                    <Loader2 className="animeta-spin h-4 w-4" />
                                ) : (
                                    <RotateCcw className="h-4 w-4" />
                                )}
                                คืนค่า
                            </Button>

                            <Button type="submit" className="cursor-pointer" disabled={isUpdating}>
                                {isUpdating ? (
                                    <Loader2 className="animeta-spin h-4 w-4" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                ยืนยันการแก้ไข
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
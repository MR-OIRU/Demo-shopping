"use client"
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LockKeyhole, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        try {
            setLoading(true);
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            setLoading(false);

            if (res?.ok) {
                toast.success("เข้าสู่ระบบสำเร็จ");
                router.push("/admin");
                return;
            }
            toast.error(res?.error ?? "เข้าสู่ระบบไม่สำเร็จ");
        } catch {
            toast.error("ระบบมีปัญหา กรุณาลองใหม่");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="relative flex min-h-svh items-center justify-center bg-background text-foreground p-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-muted-foreground/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="rounded-2xl border bg-card/80 shadow-xl backdrop-blur">
                    <div className="space-y-2 border-b px-6 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <LockKeyhole className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">เข้าสู่ระบบ</h1>
                                <p className="text-sm text-muted-foreground">
                                    เข้าสู่ระบบเพื่อจัดการหลังบ้าน
                                </p>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-5 px-6 py-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <InputGroup>
                                <InputGroupInput
                                    placeholder="Username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    autoComplete="username"
                                />
                                <InputGroupAddon>
                                    <User className="h-4 w-4" />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        <div className="space-y-2">
                            <InputGroup>
                                <InputGroupInput
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                />
                                <InputGroupAddon>
                                    <LockKeyhole className="h-4 w-4" />
                                </InputGroupAddon>
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                                    >
                                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                        </Button>
                    </form>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    หากเข้าสู่ระบบไม่ได้ กรุณาตรวจสอบชื่อผู้ใช้/รหัสผ่าน
                </p>
            </div>
        </div>

    );
}
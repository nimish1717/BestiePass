"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { FloatingBackground } from "@/components/ui/floating-background";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Attempt Supabase login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <FloatingBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 glass-card p-10 md:p-14 rounded-[2.5rem] flex flex-col items-center text-center max-w-sm w-full"
      >
        <div className="bg-primary/20 p-4 rounded-full mb-6">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Admin Access</h1>
        <p className="text-muted-foreground mb-8">Sign in to manage your events.</p>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border-border bg-white/50 dark:bg-black/20"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border-border bg-white/50 dark:bg-black/20"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg mt-4 shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}

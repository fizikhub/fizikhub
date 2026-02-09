import { Plus } from "lucide-react";

export function FunkyActions() {
    return (
        <div className="flex gap-4 px-4 w-full max-w-md mx-auto mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 bg-funky-lime border-2 border-black rounded-xl py-3 shadow-[4px_4px_0_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                <span className="text-sm font-black text-black">Get Inspired</span>
                <Plus className="w-5 h-5 text-black stroke-[3]" />
            </button>
            <button className="flex-[0.4] flex items-center justify-center bg-white border-2 border-black rounded-xl py-3 shadow-[4px_4px_0_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                <span className="text-sm font-black text-black">Contact</span>
            </button>
        </div>
    );
}

import { Metadata } from "next";
import { PhysicsTimeline } from "@/components/visualizations/physics-timeline";

export const metadata: Metadata = {
  title: "Fizik Tarihi Şeridi | FizikHub",
  description: "Antik çağlardan kuantum mekaniğine uzanan, fiziğin dönüm noktalarını anlatan interaktif zaman çizelgesi.",
};

export default function PhysicsHistoryPage() {
  return (
    <main className="min-h-screen bg-neo-off-white overflow-x-hidden selection:bg-neo-vibrant-pink selection:text-white pb-24">
      <PhysicsTimeline />
    </main>
  );
}

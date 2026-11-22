import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, ArrowRight, Sprout, Leaf, CloudSun, ScanLine, Tractor, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeafScanPreview } from "@/components/LeafScanPreview";
import fieldImage from "@/assets/croppilot-fields.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CropPilot — Smart crop & leaf disease guidance for farmers" },
      { name: "description", content: "CropPilot helps farmers choose suitable crops, spot leaf diseases and get weather-aware advice." },
      { property: "og:title", content: "CropPilot — Smart farming decisions" },
      { property: "og:description", content: "Crop recommendations, leaf disease detection and weather-aware guidance in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: Sprout, title: "Know your soil", text: "Soil and climate insights for better crop choices." },
  { icon: ScanLine, title: "Spot the signs", text: "Leaf photos that bring plant health into focus." },
  { icon: CloudSun, title: "Plan what’s next", text: "Weather-aware guidance for the growing season." },
];

const roles = [
  { icon: Tractor, title: "Farmer", number: "01", text: "Your farm. Your next chapter.", detail: "A personal space for your farming journey.", link: "Join as a farmer" },
  { icon: GraduationCap, title: "Extension Officer", number: "02", text: "Expertise, closer to the field.", detail: "A dedicated space for agronomists and officers.", link: "Join as an officer" },
  { icon: ShieldCheck, title: "Admin", number: "03", text: "A clearer view of the community.", detail: "Registered users and roles in one secure overview.", link: "Admin sign in" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-home-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 md:px-10">
          <Link to="/" className="flex shrink-0 items-center gap-1 font-display text-lg font-semibold text-primary sm:gap-2 sm:text-2xl" aria-label="CropPilot home"><Sprout className="size-5 sm:size-7" />CropPilot<span className="text-home-earth">.</span></Link>
          <nav aria-label="Home navigation" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#vision" className="transition-colors hover:text-primary">Our vision</a>
            <a href="#leaf-lab" className="transition-colors hover:text-primary">Leaf lab</a>
            <a href="#community" className="transition-colors hover:text-primary">Community</a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-3">
            <Button asChild variant="ghost" className="px-2 sm:px-4"><Link to="/auth">Log in</Link></Button>
            <Button asChild className="px-2 text-xs sm:px-4 sm:text-sm"><Link to="/auth" search={{ mode: "register" }}>Get started<ArrowUpRight className="hidden sm:block" /></Link></Button>
          </div>
        </div>
      </header>
      <main>
        <section className="home-hero relative isolate overflow-hidden bg-home-ink text-home-light">
          <img src={fieldImage} alt="Sunrise over lush green rice fields in Bangladesh" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
          <div className="home-hero-shade absolute inset-0 -z-10" />
          <div className="mx-auto flex min-h-[550px] max-w-7xl flex-col justify-between px-5 py-10 md:min-h-[570px] md:px-10 md:py-12">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest"><span className="h-2 w-2 rounded-full bg-home-lime" /> Rooted in nature. Guided by insight.</p>
            <div className="home-enter my-10 max-w-2xl">
              <h1 className="font-display text-6xl font-medium leading-none sm:text-7xl md:text-8xl">CropPilot<span className="text-home-lime">.</span></h1>
              <p className="mt-5 font-display text-2xl sm:text-3xl">A brighter season starts here.</p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-home-light/85">Bringing soil, plant health, and farming expertise together — for the people who grow our tomorrow.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="h-12 bg-home-lime text-home-ink hover:bg-home-lime/90"><Link to="/auth" search={{ mode: "register" }}>Start your journey<ArrowUpRight /></Link></Button>
                <Button asChild variant="ghost" className="h-12 text-home-light hover:bg-home-light/10 hover:text-home-light"><a href="#leaf-lab">Explore leaf lab<ArrowDown /></a></Button>
              </div>
            </div>
            <div className="flex items-end justify-between gap-5 border-t border-home-light/25 pt-5 text-xs">
              <span className="flex items-center gap-2"><Leaf className="size-4 text-home-lime" /> Built around the growing season</span>
              <span className="hidden text-home-light/75 sm:block">01 / THE FUTURE IS GROWING</span>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-home-paper" aria-label="CropPilot at a glance">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-border px-5 py-7 md:px-10 md:py-9">
            {[{ value: "3", text: "Connected roles" }, { value: "1", text: "Shared vision" }, { value: "∞", text: "Possibilities to grow" }].map(item => <div key={item.text} className="px-3 text-center first:pl-0 last:pr-0 md:text-left md:pl-10"><p className="font-display text-3xl text-primary md:text-4xl">{item.value}</p><p className="mt-1 text-xs text-muted-foreground md:text-sm">{item.text}</p></div>)}
          </div>
        </section>

        <section id="vision" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-16 md:px-10 md:py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="text-xs font-medium uppercase tracking-widest text-primary">The CropPilot vision</p><h2 className="mt-3 max-w-lg font-display text-3xl leading-tight md:text-4xl">From the ground up.<br />Every decision matters.</h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">A vision for connected agriculture, where information becomes insight and expertise reaches the field.</p>
          </div>
          <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-3 md:gap-12">
            {steps.map((step, i) => <div key={step.title}><div className="flex items-center justify-between"><step.icon className="size-7 text-primary" /><span className="font-display text-lg text-home-earth">0{i + 1}</span></div><h3 className="mt-5 font-display text-2xl">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p><span className="mt-4 inline-block text-xs text-home-earth">Planned capability</span></div>)}
          </div>
        </section>

        <section id="leaf-lab" className="scroll-mt-6 border-y border-border bg-home-paper">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-10 md:py-20">
            <div><p className="text-xs font-medium uppercase tracking-widest text-primary">The leaf lab / concept preview</p><h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">Small signs.<br />A bigger picture.</h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">Every leaf tells a story. Plant-health insights are part of our vision for earlier, more informed decisions.</p><div className="mt-8 flex items-center gap-3 border-t border-border pt-5"><ScanLine className="size-6 text-primary" /><p className="text-sm text-muted-foreground">Plant health, in focus.</p></div></div>
            <LeafScanPreview />
          </div>
        </section>

        <section id="community" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-16 md:px-10 md:py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-medium uppercase tracking-widest text-primary">One connected community</p><h2 className="mt-3 font-display text-3xl md:text-4xl">Different roles. Common ground.</h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Growers, experts, and administrators.<br />There’s a place for you here.</p></div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {roles.map(role => <div key={role.title} className="flex flex-col rounded-lg border border-border bg-card p-6"><div className="flex items-center justify-between"><role.icon className="size-6 text-primary" /><span className="text-xs text-muted-foreground">{role.number}</span></div><h3 className="mt-7 font-display text-2xl">{role.title}</h3><p className="mt-3 text-sm font-medium">{role.text}</p><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{role.detail}</p><Button asChild variant="link" className="mt-6 justify-between p-0"><Link to="/auth" search={role.title === "Admin" ? { mode: "login" } : { mode: "register" }}>{role.link}<ArrowRight /></Link></Button></div>)}
          </div>
        </section>
        <section className="bg-home-ink text-home-light"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center md:px-10"><div><p className="text-xs uppercase tracking-widest text-home-lime">Your next chapter</p><h2 className="mt-3 font-display text-3xl">Let’s grow something better.</h2></div><Button asChild size="lg" className="h-12 bg-home-lime text-home-ink hover:bg-home-lime/90"><Link to="/auth" search={{ mode: "register" }}>Join CropPilot<ArrowUpRight /></Link></Button></div></section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-7 text-xs text-muted-foreground md:px-10"><span className="flex items-center gap-2 font-display text-lg text-primary"><Sprout className="size-5" />CropPilot.</span><span>Rooted in nature. Growing together.</span><span>© CropPilot</span></footer>
    </div>
  );
}

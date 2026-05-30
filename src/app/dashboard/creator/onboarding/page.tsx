import { redirect } from "next/navigation"

// Deze pagina bestond in een oudere versie — stuur door naar de juiste onboarding
export default function LegacyCreatorOnboardingPage() {
  redirect("/auth/onboarding/creator")
}

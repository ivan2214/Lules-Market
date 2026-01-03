import pathsConfig from "@/config/paths.config";
import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";
import { PreferencesView } from "./_components/preferences-view";

function PreferencesPage() {
  return <PreferencesView />;
}

export default withAuthenticate(PreferencesPage, {
  role: "user",
  redirect: pathsConfig.auth.signIn,
});
